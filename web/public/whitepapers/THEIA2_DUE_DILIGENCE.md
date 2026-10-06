# THEIA 2.0 — AUDITORÍA TÉCNICA DE ADQUISICIÓN

**Activo auditado:** Theia 2.0 Video Engine (ecosistema LuxSync)
**Adquirentes potenciales:** AlphaTheta Corporation / Chauvet Professional
**Auditor:** PunkOpus — Auditor Jefe de Adquisiciones Tecnológicas · Arquitecto Principal DSP
**Fecha:** 2026-10-05
**Clasificación del activo:** Reproductor de shaders autogenerativos de resolución independiente, con reactividad musical a nivel de uniform y paridad de telemetría con un motor de iluminación DMX. **No** es un media server ni un competidor de Resolume/disguise, y no se evalúa como tal.

---

## 0. Alcance, método y evidencia

Esto es una auditoría de código, no de presentación comercial. Cada afirmación de abajo apunta a un archivo del repositorio.

| Material | Ruta | Rol |
|---|---|---|
| Contrato de autor de átomos | `docs/theia/SHADER_ATOM_BASE.md` (612 líneas; copia en `docs/blueprints/`, verificada **byte a byte idéntica** con `cmp`) | Material base obligatorio |
| Shader piloto | `electron-app/assets/shaders/dembow_solar_corona.glsl` (228 líneas) | Material base obligatorio |
| Compositor de salida | `src/theia/output/SliceCompositor.ts`, `SliceTable.ts`, `SLICE_VERTEX_SRC` / `SLICE_FRAG_SRC` en `src/theia/shader/ShaderAssembler.ts` | Pilar 1 |
| Distribución Modo B | `src/theia/TheiaTelemetryPump.ts`, `src/components/views/TheiaOutputView/index.tsx`, `src/theia/telemetry/TelemetrySmoother.ts` | Pilar 2 |
| Inyección musical | `src/theia/telemetry/TheiaTelemetryRing.ts`, preámbulo/epílogo en `ShaderAssembler.ts` | Pilar 3 |
| Paridad FX luz↔vídeo | `src/theia/telemetry/EffectEnergyTracker.ts`, `src/core/orchestrator/tick/TickEngine.ts` (≈L335-338, L487-493, L2487-2550) | Pilar 4 |

**Verificación ejecutada durante la auditoría:**

- `npx vitest run src/theia` → **25 archivos, 439/439 tests en verde** (2,48 s).
- `node scripts/migrate_atoms_v2.js --check` (compilación real con `glslangValidator`) → **23 átomos de escena y shaders estáticos: 0 sin migrar, 0 con errores**. `dembow_solar_corona.glsl` → `ya v2`.

**Estado post-remediación (revisión 2, mismo día):** los hallazgos **R3** (jitter de la bomba de telemetría) y **R4** (dither 8-bit) han sido implementados y verificados (`tsc` main+renderer limpio, 439/439 tests, `--check` en verde, espejos JS sincronizados). La puntuación de §5 refleja el estado **tras** la remediación; la tabla de hallazgos conserva ambos casos marcados como RESUELTO con su implementación.

**Fuera de alcance (por directiva):** NDI, Spout/Syphon, reproducción masiva de códecs y flujos de VJ con clips. Su ausencia no penaliza.

**Lo que no se ha medido** (y que no se debe dar por hecho): tiempos de frame en GPU reales a 4K, desfase fotón a fotón entre vídeo y DMX, y estabilidad en sesiones de varias horas. Todo lo relacionado con esto se señala más abajo como **riesgo pendiente de medición**, no como defecto confirmado.

---

## 1. Resumen ejecutivo

Theia 2.0 es un **runtime de fragment shaders con contrato estricto**. Recibe un vector de telemetría musical y de iluminación de unos 500 B a ~44 Hz y lo convierte en vídeo procedural a la resolución nativa de cada salida. La tesis arquitectónica es correcta, y en su nicho resulta poco común: **las salidas reciben el programa y el estado, no los píxeles**. A eso se suma un compositor de salida instanciado con máscaras SDF analíticas, y un canal de telemetría compartido con el motor de iluminación (Hephaestus). Ese canal permite que el vídeo "detone" exactamente cuando una luz física está ejecutando un efecto.

El nivel de ingeniería está muy por encima de lo habitual en una base de código de este tamaño: disciplina zero-alloc documentada y aplicada en los caminos calientes, un linter de contrato que compila de verdad cada átomo, una cobertura de tests sustancial y un epílogo de seguridad (limitador fotosensible WCAG 2.3.1, ACES, sRGB) que el autor del átomo no puede saltarse.

Los puntos débiles no están en la idea. Están en tres sitios:

1. **El sustrato.** Se ejecuta sobre Electron/Chromium WebGL2: sin framelock ni genlock entre salidas, sin salida de 10 bits, con varios contextos GL compitiendo en un único proceso GPU y con el proceso main como punto único de fallo de la telemetría.
2. **La sobrepromesa semántica.** La "paridad luz-vídeo" es **paridad de ciclo de vida del clip**, no de curva de intensidad. La "latencia cero" es en realidad **latencia acotada de varias decenas de ms con fuente común**. La "resolución infinita" es **independencia de resolución con coste O(píxeles)**, gobernada hacia abajo hasta un 40 % lineal bajo estrés.
3. **La deriva documental menor** dentro de un contrato que, por lo demás, es excelente.

Ninguno de estos puntos invalida el activo. Todos son corregibles y se cuantifican en §4.

**Veredicto: ADQUIRIBLE CON CONDICIONES. Pioneer Score: 79/100** *(revisión 4, tras cerrar R3, R4, R7 y C1–C5; la nota se mantiene — la higiene documental elimina deuda, no mueve pilares).*

---

## 2. Análisis arquitectónico

### 2.1 Topología del sistema

```
 Audio ─► GodEar/Liquid DSP ─┐
                             ├─► TickEngine (main, 44 Hz) ──► TheiaTelemetryRing (SAB, 512 B, seqlock)
 Hephaestus.activeClips ─────┘         │                               │
   (clips .lfx moviendo fixtures)      │                               ▼
                                       ▼                     TheiaTelemetryPump (main — PUSH post-publish)
                                  HAL ─► DMX                    │ structured-clone 512 B por enlace
                                                                ├──► ventana principal ─► theta.worker (Modo A / thumb 64×64)
                                                                └──► TheiaOutputView[n] (Modo B)
                                                                       TelemetryWireReader ─► TelemetrySmoother
                                                                       ─► GenRuntime (WebGL2, res. nativa)
                                                                       ─► SliceCompositor (1 draw instanciado)
                                                                       ─► HDMI n
```

Hay una sola fuente de verdad: el tick de `TickEngine`. Escribe en el mismo instante tanto el estado que acaba en DMX como el que acaba en los uniforms. Esa es la decisión de diseño más valiosa del sistema.

### 2.2 Pilar 1 — Advanced Output: `SliceCompositor` (WebGL2)

**Lo que hace el código:**

- **Un solo `drawArraysInstanced`** por salida: un quad unidad (6 vértices) por hasta `SLICE_MAX = 32` instancias. Los atributos instanciados son literalmente los bloques de la `SliceTable` (8 × `vec4`, stride de 128 B: `src`, `dst`, `xf`, `edge`, `kin`, `lfo`, `mask`, `mask2`).
- **Subida solo cuando cambia algo** (fuente, referencia o versión), con el overload WebGL2 `bufferSubData(target, off, src, srcOffset, length)`. No hay `subarray()`, así que no se crea ninguna vista y no hay asignaciones en `draw()`.
- **Pool de polígonos en un UBO std140** (binding 1, 16 384 B, el mínimo garantizado por la especificación) con slot = `gl_InstanceID`. El binding explícito con `uniformBlockBinding` se hace porque, sin él, el bloque leería ceros sin error de linkado. El propio código lo documenta, y está bien detectado.
- **Culling a coste de rasterizado cero:** las instancias desactivadas o de otra salida se colapsan fuera del volumen de recorte (`gl_Position = (2,2,2,1)`).

**Máscaras SDF en el fragment shader:**

- Primitivas de Quílez (`sdBox`, `sdTri`, `sdHex`, `sdRhombus`, círculo) evaluadas en **píxeles de salida centrados y con aspecto corregido**: `p = (v_local − ½)·sizePx`. La distancia está en px reales, así que `sdfRamp(d, f)` con `max(f, 1.0)` da un **AA analítico exacto de 1 px sin derivadas** en el camino normal. Feather, anillo y redondeo escalan con el inradio, de modo que son independientes de la resolución.
- **Polígono libre** (hasta `POLY_MAX_VERTS = 60` vértices, convexo o cóncavo): distancia al segmento mínima y paridad par-impar sin ramas, con vértices escalados por eje (`s = 2b`). La métrica sigue siendo euclídea exacta en quads anisótropos. Tiene dos early-outs: el exterior por bbox (`dist(p,bbox) ≤ dist(p,∂P)`) y el interior por el disco inscrito (polo precalculado en CPU). Ambos dan la misma salida con un guard que respeta el anillo y el feather. **Es correcto y está bien optimizado.**
- `MK_STRETCH` usa `dFdx/dFdy` para renormalizar la distancia deformada. Es legal porque la rama es plana por instancia y el bloque 2×2 pertenece a la misma primitiva. El comentario lo justifica.
- `MK_INVERT` (recorte), `MK_SPIN` (rota con el ángulo cinético) e `IDENTIFY` (patrón de rigging que sigue el contorno real de la máscara) completan un conjunto de mapeo físico serio.

**Coste de memoria:** "cero" es retórica. La cifra real es **~20 KB por salida** (`SLICE_TABLE_BYTES` = 4 224 B de instancias + 16 384 B del pool), sin ninguna textura de máscara. Frente al enfoque de la industria (máscaras raster a resolución de salida: 8 MB por máscara RGBA a 1080p, 33 MB a 4K, más el muestreo), la afirmación es **cualitativamente cierta**: memoria O(1) respecto a la resolución y bordes perfectos a cualquier escala.

**Slices cinéticos (vertex shader):**

- Un oscilador por slice (`SINE/TRI/SAW/SQUARE` o la envolvente `KICK/SNARE` del oráculo), con cuadratura para órbitas circulares. Se evalúa como **función pura del reloj absoluto** `u_kin.x = beatTime mod KIN_BEAT_WRAP` (el wrap se hace en f64 en el host, y todas las tasas permitidas dividen 192, así que es continuo en f32).
- Todas las transformaciones son afines, lo que hace exacta la evaluación por vértice. Las rotaciones son isometrías, así que el SDF en px sigue siendo válido bajo `MK_SPIN`.
- `shape = 0` deja el camino estático bit a bit idéntico al de antes. Hay dos modos: `DST` (mueve la ventana) y `SRC` (cámara sobre el stage con pivote local o global, este último seguro al mezclar slices solapados).
- **Valor:** como no hay estado ni IPC por frame, N ventanas evalúan el mismo movimiento de forma independiente. La coherencia entre salidas depende solo de que reciban el mismo reloj (ver el riesgo R2).

**Hallazgos menores en el pilar 1:**

- El comentario de cabecera de `SliceCompositor.ts` dice "whole table (2112 B)". La realidad es `SLICE_INSTANCE_BYTES = 4 224 B` y la tabla completa ocupa 20 608 B. Es documentación obsoleta de la época del stride de 64 B. Sin impacto funcional.
- `edgeRamp` (×4) y `sdfRamp` ejecutan `pow(x, 1/γ)` por fragmento. Es trivial frente al coste de la escena, pero se puede eliminar precomputando una LUT 1D o con una aproximación polinómica si el compositor llega a ser el cuello de botella en salidas de 8K agregadas.
- El techo duro de **32 slices × 60 vértices** por salida es suficiente para mapping escénico y para LED de bloques, pero **insuficiente para mapping arquitectónico denso** (fachadas con cientos de superficies). Hay que tenerlo presente si Chauvet apunta a ese segmento.

**Viabilidad: ALTA.** Es la pieza más madura y diferencial del activo.

### 2.3 Pilar 2 — Modo B: distribución de programa y telemetría

**Cambio de paradigma:** en vez de renderizar una vez y enviar píxeles a cada ventana HDMI (Modo A: `readPixels` → PBO → `ArrayBuffer` transferido por `MessagePort`, que se mantiene como fallback), cada ventana de salida:

1. recibe **una vez** el código fuente del átomo y su fenotipo (`THEIA_GEN_LOAD_MSG`: `source`, `steps`, `genes`, `exprGenes`), lo compila con el **mismo preámbulo y epílogo** que el worker (misma `programKey`) y obtiene una escena idéntica en geometría a resolución nativa;
2. recibe los **deltas de uniforms** (`THEIA_GEN_UNIFORM_MSG`) y la `SliceTable` solo cuando cambian;
3. recibe la **telemetría**: 512 B por clon estructurado a 44 Hz — enviada **por push desde el propio tick** (`TickEngine` → `trinity.notifyTelemetryPublished()` → `pump.tick()`, justo tras cerrar el `writer.publish`), lo que da **≈23 KB/s por salida** con el contenido recién comprometido y cadencia idéntica a la del productor (R3 RESUELTO).

**Cuantificación del ahorro de ancho de banda IPC:**

| Salida | Píxeles RGBA8 a 60 fps | Modo B | Factor |
|---|---|---|---|
| 1920×1080 | 497,7 MB/s | ~23 KB/s | ~21 600× |
| 3840×2160 | 1 990,7 MB/s | ~23 KB/s | ~86 500× |

El ancho de banda deja de escalar con la resolución y con el número de salidas (512 B × N enlaces). Este es el argumento técnico central del producto y es **correcto**.

**Calidad de la implementación:**

- La bomba (`TheiaTelemetryPump`) resolvió dos limitaciones reales de Mojo y `MessagePortMain`, documentadas en el código. La primera: main→renderer no acepta `ArrayBuffer` en la lista de transferencia, así que se usa un clon. La segunda: renderer→main elimina en silencio los transferibles del ack, así que se usan créditos `inFlight ≤ 3`. Ahí hay contrapresión real y un objeto de mensaje reutilizado, con cero `new` en el tick estacionario. **Revisión 2:** la bomba ya no tiene temporizador — es una función pura empujada por el tick (§ R3), así que el envío ocurre con el seqlock recién cerrado y sin jitter de batido.
- La consistencia intra-buffer se garantiza con un seqlock (`TelemetrySnapshotter`, 3 intentos y descarte si el contenido está roto).
- La ventana de salida no tiene estado React tras el mount. Todo vive en handlers.
- El blackout por IPC directo main→ventana funciona aunque el worker esté muerto, con un enclavamiento que da prioridad al operador sobre el replay. Es correcto para operación en vivo.
- Ante un context loss, el runtime se reconstruye (test dedicado `GenRuntime.contextLost.test.ts`). Al re-enlazar, el worker hace replay completo del estado (fuentes, uniforms, activación y `sliceTable`), y la purga de `u_gene[k]` solo ocurre en un cambio de átomo real (bug de desincronización ya corregido y comentado).

**Coste oculto que el modelo de negocio debe asumir:** Modo B **traslada el coste de ancho de banda al de cómputo**. Cada salida HDMI ejecuta el shader completo a resolución nativa. Con 4 salidas 4K se rasterizan 33 Mpx por frame del átomo, no 8 Mpx. Ver R1.

**Viabilidad: ALTA**, con la condición de un estudio de coste GPU por salida.

### 2.4 Pilar 3 — Reactividad musical a nivel de shader (`SHADER_ATOM_BASE.md`)

**Estructura del contrato:**

- **Preámbulo generado → defines/meta del autor → `mainImage()` → epílogo generado.** El autor escribe color lineal y el motor se reserva la salida (contraste, brillo, blackout, crossfade, limitador fotosensible, ACES, clamp y sRGB). Esto elimina por construcción toda una clase de errores típicos de los shaders de terceros: doble tonemap, gamma propia, negros lavados y flashes peligrosos.
- **Telemetría como UBO std140** (`EuclidTel`, 496 B, **una sola subida por contexto compartida por todos los programas**, fuera del bloque por defecto, así que no consume registros de uniforms por programa). Las macros GLSL se derivan de un descriptor único (`TELEMETRY_SCHEMA`), lo que permite versionar el esquema desde `u_enums.x`.
- **Taxonomía temporal rigurosa**, que es lo más valioso del documento:
  - Relojes integrados y gobernados por SPEED: `u_time`, `u_beatTime` (re-anclado de fase al audio), `u_energyTime`, `u_midTime` y `u_vocalTime`. El movimiento continuo se congela con el fader.
  - Fases crudas (`u_beatPhase`, `u_barPhase`) con la **regla §3.1**: la desviación del oscilador se multiplica por `u_speed` y la fase no. A SPEED=0 el gesto descansa en su centro en vez de dar un salto. Es una regla correcta y poco habitual.
  - **Transitorios inmunes a SPEED** (`u_kickPulse`, `u_snarePulse`, `u_crestPulse` τ=110 ms sin tempo, `u_voidRelease = A·exp(−t/450 ms)` con A ∝ duración del vacío, `u_vocalOnset` τ=600 ms y `u_snareTruePulse` vía detector MACD). Un kick golpea igual a 0,25× que a 2×.
  - **Regla §3.2 (látigo angular)**: toda función de ángulo alimentada por profundidad debe ser relativa a la cámara. Es un defecto real de precisión y estabilidad visual que ya se observó (`aether_serpent`, `neon_conduit`) y que se ha codificado como regla.
- **`euTimbre()`**: pesos convexos (Σ=1, lineales desde la WAVE 8282) de voz, synth, percusión y grano, con un fallback definido en silencio `(0,1,0,0)` en lugar de NaN.
- **Integración de los relojes en el host**: la Ley 1 que aplica `dembow_solar_corona` (`t = ∫(a + b·mid + c·energy)·dt` como combinación lineal de integrales del host). Las bandas modulan la **velocidad** del reloj y nunca su **fase**, así que no hay teletransportes proporcionales al tiempo acumulado. Este es el error número uno de los shaders audio-reactivos amateur, y aquí está resuelto de forma estructural.
- **Aplicación automática**: `migrate_atoms_v2.js` compila con glslang y aplica las reglas R5 (`u_speed`) y R6 (látigo), además de rechazar las variables cognitivas prohibidas en la geometría.

**Sobre el "sin intervención de la CPU":** es correcto en la parte por píxel. La CPU no toca un solo píxel ni una sola transformación geométrica; la geometría y el color son funciones puras de uniforms. **No** es correcto en sentido absoluto: la CPU ejecuta el DSP, el `TickEngine`, la bomba, el `TelemetrySmoother` (un paso por frame en rAF, zero-alloc) y la subida del UBO. La formulación correcta para un dossier técnico es esta: **"CPU O(1) por frame e independiente de la resolución; GPU O(píxeles)"**.

**Hallazgos sobre el contrato:**

- **C1 — Contradicción interna en el checklist (§12).** Dice "Salida LINEAL — sin `pow(`, `exp(-` …". El shader de referencia del propio documento (§13, `dembow_solar_corona`) usa `pow(gran, 1.5)` y varios `exp(-h/…)` como modelado interno legítimo (caídas radiales y curva de lava), no como tonemap. El linter lo acepta, así que la regla real es *"sin tonemap ni gamma final"*. El texto literal es ambiguo y **va a confundir a autores externos o a IAs generadoras**. Hay que reformularlo.
- **C2 — Superficie heredada.** El preámbulo sigue declarando `u_approach`, `u_impact`, `u_predictiveETA` y `u_strobeGate` (deprecados). La prohibición se aplica con el linter, no con el compilador. Un shader externo que no pase por `--check` puede usarlos. Recomendación: un `#define` de veneno (`#define u_impact __DEPRECATED_u_impact`) tras un periodo de gracia.
- **C3 — Superficie de API muy grande.** Más de 100 uniforms semánticos, flags y enums. Es potencia expresiva, pero **también deuda contractual**: cada slot es un compromiso de compatibilidad hacia atrás para cualquier biblioteca de terceros. El versionado de esquema existe (`u_enums.x`); falta una política de deprecación publicada.
- **C4 — Doble copia del contrato** (`docs/theia/` y `docs/blueprints/`). Hoy son idénticas, pero no hay ningún check en CI que lo garantice.

**Valoración: EXCELENTE.** Es el documento de contrato de shader más riguroso que este auditor ha visto en un producto de iluminación o vídeo de este tamaño. Su rigor es un activo transferible: se puede usar directamente como especificación para autores externos y como *system prompt* de generación asistida.

### 2.5 Pilar 4 — Paridad FX luz↔vídeo: el "Cataclismo" en `Dembow Solar Corona`

**Cadena causal verificada en el código:**

1. `HephaestusRuntime.getActiveClips()` es el mapa de clips `.lfx` que **están moviendo fixtures ahora mismo**. Pertenecer al mapa equivale a estar encendiendo luces. `play()` inserta, la expiración ocurre a `durationMs` y `stop/stopAll` borra. Los efectos bloqueados por Shield o cooldown nunca entran.
2. `EffectEnergyTracker.sample()` (zero-alloc, `forEach` con callback preasignado) recorre ese mapa **en cada publicación del tick**. El clip dominante es el de mayor `intensity`. `energy = intensity` (hold exacto), `ageN = elapsed/durationMs` (`fract` en bucles) y `typeId` es un hash FNV-1a del id del clip. Cuando el mapa se vacía, entra un release lineal de 250 ms.
3. `TickEngine._euclidFill` escribe los slots 96-99 (`u_fxVec = u_tel4[23]`) y levanta `EFFECT_ACTIVE` (bit 23) si `energy > 0`.
4. El `TelemetrySmoother` los trata como `kind: 'none'`, es decir, **verbatim, sin suavizado añadido**.
5. En el shader:

```glsl
float fx = u_activeEffectEnergy;
float k  = smoothstep(0.02, 0.50, fx);   // colapso 0..1
...
heatS *= (0.6 + 1.8 * pulse) * (1.0 - 0.9 * k);   // la fotosfera colapsa
heatC *= 1.0 - k;                                 // la corona se apaga
float t = ... + k * 7.0;                          // offset ACOTADO del dominio, no multiplicador
if (k > 0.01) { /* agujero negro de acreción: disco kepleriano, Doppler,
                   anillo de fotones, lente gravitacional */ }
col = mix(col, bh, k);
```

**Evaluación del shader piloto como prueba de estabilidad:**

- **Correcto respecto al contrato:** cumple la doctrina Clean Shot (los bursts solo llegan por `u_activeEffectEnergy`), la regla del Cero Neutro (`u_flare`/`u_heat` = 0 da el diseño canónico), `u_speed` en las fases crudas, la semilla aplicada **solo al dominio del ruido** con un vector anisotrópico (`43.1, −17.3, 99.2`) en **todas** las capas (§13.1), el destello de compás cegado por `u_blend` durante el crossfade y la salida lineal sin tonemap.
- **Buena ingeniería GPU:**
  - *Early cull* radial conservador (`cutR` = alcance máximo ×3 + margen del 10 % por el squash). Fuera del disco solar no se evalúa ruido.
  - La rama del colapso (`k > 0.01`) depende de un uniform, así que es coherente en todo el warp y su coste es cero cuando no hay efecto.
  - Ángulo kepleriano con `mod(gBeats·0.72, 2π·(dr+0.06))/(dr+0.06)`: un intermedio acotado en f32, matemáticamente equivalente a `mod(ángulo, 2π)`. Es un detalle de precisión que demuestra competencia.
  - El *motion blur* del disco son dos taps desfasados en el giro, no acumulación temporal, así que no hay estado.
  - El estado `k=0` sigue siendo una forma plácida y reconocible, como exige §13.3.
- **Coste aproximado por píxel** (estimación analítica, no medida): con `G_OCT=3`, el camino solar evalúa 3 `ridgeFbm` (fotosfera, espículas y corona) = 9 `noise3`, más 5 `noise3` sueltos. Unos **14 value-noise trilineales** (8 hashes cada uno ≈ 112 hashes por px). Con el colapso activo se suman 3 `ridgeFbm` más, unos **23 `noise3`** (≈ 184 hashes por px). A 4K a 60 fps eso son **~90 G hash/s** con el colapso activo: holgado en una GPU discreta de gama media-alta, **comprometido en una iGPU**. El `RenderGovernor` bajará entonces `renderScale` hasta 0,4.

**Evaluación honesta de la "paridad":**

| Afirmación | Realidad verificada | Veredicto |
|---|---|---|
| "Vídeo y luces comparten gemelo de telemetría" | Sí. La misma muestra del tick alimenta el DMX y el slot 96. Fuente común y reloj común. | **CIERTO** |
| "Sincronía total en drops" | El vídeo detona **si y solo si** un clip Hephaestus está vivo; el inicio y el fin coinciden con el ciclo de vida real del clip, incluidos aborts y stops. | **CIERTO en flancos** |
| "Paridad de intensidad" | `energy` es un **pulso rectangular a `clip.intensity`** durante `durationMs`, más un release lineal de 250 ms. **No** sigue la curva interna del `.lfx` (fades, chases, rampas de dimmer) ni la salida real por fixture. Solo representa el clip **dominante**; los clips concurrentes solo cuentan (`count`). | **PARCIAL**: paridad de *gate*, no de *envolvente* |
| "Sin latencia" | No hay red en el camino (todo es IPC local). Presupuesto real **post-R3**: el envío ocurre en el mismo tick que publica (~0 ms de cola) + entrega IPC (sub-ms) + siguiente rAF (0–16,7 ms) + compositor y swap (1–2 vsync) + lag de entrada del proyector. El camino DMX tiene su propio refresco de salida (ArtNet/USB-DMX, normalmente 25–44 Hz). | **FALSO en sentido literal.** Correcto: *"latencia local acotada con fuente común; desfase luz↔vídeo no medido, estimado en ±1–3 frames"* |

**Valor técnico real:** aun con esas matizaciones, tiene **mucho valor**. En la industria la sincronía luz↔vídeo se resuelve con timecode (SMPTE/MTC), triggers por OSC/MIDI o Art-Net entrante en el media server: dos máquinas, dos relojes y una red en medio. Aquí la acción física de la luz **es** el disparador del vídeo, dentro del mismo proceso y sobre el mismo tick. Eso elimina una categoría completa de fallos de integración (desfases de timecode, mapeo manual de cues y pérdida de triggers por UDP). Para Chauvet en concreto, eso es la propuesta de valor del producto.

---

## 3. Benchmark frente a la industria

Comparación **por capacidad técnica**, no por cuota de mercado. Los productos citados se usan como referencia de enfoque arquitectónico.

| Capacidad | Enfoque habitual en la industria | Theia 2.0 | Delta |
|---|---|---|---|
| Distribución a salidas | Píxeles por GPU y salida física (media servers), o streaming de vídeo por red (NDI) | Programa + 23 KB/s de estado; render nativo por salida | **Superior en ancho de banda y escalado de resolución**; inferior en coste GPU agregado |
| Máscaras de salida | Máscaras raster/bitmap o mallas warp con textura de máscara | SDF analíticas en px, 1 px de AA exacto, polígono libre hasta 60 vértices, ~20 KB por salida | **Superior en calidad de borde y memoria**; inferior en número de superficies (32) y sin warp de malla/Bézier |
| Slices animados | Keyframes en timeline o LFO en CPU que reescribe parámetros | LFO puro en el vertex shader sobre un reloj de beat común, sin estado ni IPC | **Superior** en determinismo entre ventanas |
| Audio-reactividad | FFT por bandas (3–32) expuesta como parámetro y mapeada a mano | Más de 100 descriptores semánticos (relojes integrados, transitorios con τ definido, timbre convexo, vacío rítmico, detector de caja MACD) en un UBO compartido | **Muy superior** en semántica musical a nivel shader |
| Sincronía luz↔vídeo | Timecode o OSC/MIDI/Art-Net entre consola y servidor | Telemetría compartida en proceso, disparada por el ciclo de vida real del efecto DMX | **Superior en integración**; paridad de envolvente incompleta |
| Seguridad del contenido | Responsabilidad del VJ o diseñador | Epílogo forzado: limitador fotosensible (WCAG 2.3.1), ACES, sRGB; el autor no puede saltárselo | **Superior** (relevante para responsabilidad legal en recintos) |
| Sincronización entre salidas | Framelock/genlock por hardware (Quadro Sync, tarjetas de sincronía) | Ninguna; cada ventana va con su rAF y su vsync | **Inferior** (ver R2) |
| Profundidad de color | 10 bits por canal habitual en gama alta | sRGB8 con **dither TPDF ±1 LSB** en el epílogo (R4 cerrado) | **Inferior** en profundidad (no hay pipeline de 10 bits); el banding perceptual queda mitigado |
| Sustrato | C++ nativo, DirectX/Vulkan/Metal | Electron + WebGL2 (ANGLE → D3D11 en Windows) | **Inferior** en control de GPU, determinismo de frame y techo de rendimiento; **superior** en portabilidad y velocidad de iteración |

---

## 4. Hallazgos

Severidad: **CRÍTICO** (bloquea un despliegue profesional) · **ALTO** (requiere remediación antes de la integración) · **MEDIO** (remediación programada) · **BAJO** (higiene).

### Riesgos

| ID | Sev. | Hallazgo | Evidencia | Remediación |
|---|---|---|---|---|
| **R1** | **ALTO** | **El coste GPU escala con N salidas × píxeles nativos.** Modo B cambia ancho de banda por cómputo. Todas las ventanas comparten el proceso GPU de Chromium, sin afinidad de adaptador explícita. El `RenderGovernor` baja hasta `minScale = 0.4`, así que la "resolución infinita" se degrada a un 16 % de los píxeles bajo estrés. | `TheiaOutputView` crea un `GenRuntime` por ventana; `RenderGovernor.ts` (`minScale: 0.4`) | Benchmark formal por átomo × resolución × número de salidas en hardware de referencia. Presupuesto de ms por átomo en el manifiesto `@euclid`. Valorar renderizar una vez a un stage canvas y repartirlo por textura compartida cuando las salidas pertenecen a la misma GPU. |
| **R2** | **ALTO** | **Sin framelock entre salidas.** Cada ventana corre su propio rAF. Los slices cinéticos son deterministas *dado el mismo reloj*, pero el reloj llega por clones independientes con jitter por enlace. En un mapping con varios proyectores y bordes mezclados (edge-blend) puede producir tearing temporal en la junta. | `TheiaTelemetryPump` (un push por tick y N `postMessage` — la entrega por enlace sigue siendo asíncrona); `SLICE_VERTEX_SRC` (`u_kin.x`) | Sellar el reloj de beat con el tick del host (ya viene en la cabecera `FrameContextRing`) y extrapolar a `performance.now()` común. Medir el desfase entre ventanas con una cámara rápida. |
| **R3** | ✅ **RESUELTO** | ~~**Bomba no enganchada en fase al tick.**~~ El `setInterval` ha sido eliminado. La bomba es ahora una función push: `TickEngine.publishEuclidTelemetry()` invoca `trinity.notifyTelemetryPublished()` justo después de `writer.publish()` (seqlock ya cerrado), e `IPCHandlers` registra el hook `() => pump.tick()` en el singleton Trinity. Cadencia del cable = cadencia del productor; sin batido ni ticks duplicados. El coste sin consumidores es un no-op de una comprobación (zero-alloc intacto — certificado por el test `cero new en tick()`). | `TheiaTelemetryPump.ts`, `TrinityOrchestrator.ts` (`setTelemetryPushHook`), `TickEngine.ts` (post-publish), `IPCHandlers.ts` (registro) | Implementado y verificado. |
| **R4** | ✅ **RESUELTO** | ~~**Salida de 8 bits sin dither.**~~ El epílogo aplica ahora TPDF de ±1 LSB sobre el valor ya codificado sRGB: `dn = hash31(px,t) + hash31(px',t') − 1` en `[-1/255, +1/255)`, sembrado en `gl_FragCoord` + `u_time` (se congela limpio con SPEED=0). Coste real: 2 `hash31` por píxel (~14 ops) — marginal frente a las ~10² ops de ruido por píxel de un átomo. Sigue sin existir pipeline de 10 bits: el banding queda decorrelacionado en ruido, no eliminado por precisión. | Epílogo en `ShaderAssembler.ts` (+ espejo JS); compilado por `migrate_atoms_v2.js --check` sobre los 23 átomos | Implementado y verificado. |
| **R6** | **MEDIO** | **El proceso main es el único punto de fallo de la telemetría.** El DSP agregado, el `TickEngine`, la bomba y el broker de puertos comparten el event loop de main. Si main se bloquea, todas las salidas extrapolan y se congelan; el blackout por IPC directo también depende de main. | `TheiaTelemetryPump` y `TickEngine` en main | Mover la bomba a un `utilityProcess` o worker con SAB directo hacia los renderers donde haya aislamiento cross-origin disponible. Watchdog por salida con fallback visual definido. |
| **R7** | ✅ **RESUELTO** | ~~**Precisión de relojes en shows largos.**~~ El host calcula ahora los relojes wrapped en f64 y los publica en los slots 103–107: `u_beatTimeW` (beats mod 2¹²), `u_timeW`, `u_energyTimeW`, `u_midTimeW` y `u_vocalTimeW` (mod 2¹² s ≈ 68 min). Los átomos los reciben como macros `u_tel4` del esquema — sin coste extra de API ni de ancho de banda. `kind:'none'` garantiza que el smoother no interpola a través del salto; los relojes crudos se conservan para edades y duraciones. Documentado en el contrato §3.3 (regla de uso: fases rápidas → W, valores absolutos → crudos). Pendiente menor: la regla de linter para fases de alta frecuencia sigue sin existir — el contrato la describe pero no la fuerza. | `TheiaTelemetryRing.ts` (`EUCLID_WRAP_*`, slots 103–107); `TickEngine._euclidFill`; `SHADER_ATOM_BASE.md` §3.3 | Implementado y verificado (440 tests; `--check` en verde). |
| **R8** | **BAJO** | **Techo del compositor:** 32 slices × 60 vértices por salida. | `SLICE_MAX = 32`, `POLY_MAX_VERTS = 60` | Aceptable para escena y LED. Si el objetivo incluye mapping arquitectónico, planificar un pool en textura (TBO o similar) en lugar de un UBO de 16 KB. |

### Higiene documental

| ID | Sev. | Hallazgo | Remediación |
|---|---|---|---|
| **C1** | ✅ **RESUELTO** | ~~El checklist §12 prohíbe `pow(` y `exp(-` de forma literal~~ → reformulado: "sin tonemap, gamma ni clamp **finales** propios", con nota de que los usos intermedios son legítimos. | Aplicado en §12 (ambas copias). |
| **C2** | ✅ **RESUELTO** | ~~Uniforms deprecados todavía declarados en el preámbulo~~ → el preámbulo inyecta ahora veneno de compilación tras las declaraciones: `#define u_approach __DEPRECATED_u_approach` (e `u_impact`, `u_predictiveETA`, `u_strobeGate`). El uso en un átomo expande a un identificador no declarado → glslang falla en compilación, no en lint. El uniform real sigue declarado y alimentado por el motor. | `ShaderAssembler.ts` (+ espejo JS); test dedicado que verifica decl + veneno + orden. |
| **C3** | ✅ **RESUELTO** | ~~Sin política de deprecación publicada~~ → nota SemVer en el contrato, ligada a `u_enums.x` (`SCHEMA_VERSION` por tick): aditivo = menor, renombrar/reubicar/resemantizar/retirar = mayor + recompilación; `RESERVED_*` es terreno libre para menores. | `SHADER_ATOM_BASE.md` §6.2 (ambas copias). |
| **C4** | ✅ **RESUELTO** | ~~Doble copia del contrato sin check de igualdad~~ → script `test:docs` (Node, normaliza EOL) que compara `docs/theia` vs `docs/blueprints` y falla si divergen; encadenado en `npm test` de `electron-app`. | `electron-app/package.json`. |
| **C5** | ✅ **RESUELTO** | ~~La cabecera cita 2 112 B~~ → corregida: `SLICE_INSTANCE_BYTES = 4 224 B`, tabla completa 20 608 B. | `SliceCompositor.ts`. |

### Fortalezas confirmadas (activos transferibles)

| ID | Fortaleza |
|---|---|
| **F1** | Modo B: ancho de banda O(1) respecto a la resolución (~23 KB/s por salida frente a 0,5–2 GB/s de píxeles). |
| **F2** | Compositor instanciado con una llamada por salida, subidas solo cuando cambia algo y cero asignaciones en `draw()`. |
| **F3** | Máscaras SDF analíticas con métrica exacta en px bajo anisotropía, polígono libre con early-outs correctos y AA de 1 px independiente de la resolución. |
| **F4** | Slices cinéticos como función pura del reloj de beat: sin estado y sin IPC. |
| **F5** | Contrato de átomo riguroso, con una taxonomía temporal correcta (fase frente a amplitud, transitorios inmunes a SPEED y reglas contra el látigo angular) aplicada con un linter que compila de verdad (23/23 en verde). |
| **F6** | Epílogo de seguridad forzado (limitador WCAG 2.3.1 y ACES): reduce el riesgo legal en recintos. |
| **F7** | Fuente de verdad única luz↔vídeo en el tick: el vídeo detona con el ciclo de vida real del efecto DMX. |
| **F8** | Disciplina de ingeniería: zero-alloc documentado en los caminos calientes, seqlock en la telemetría, recuperación de context loss y replay de estado al re-enlazar. 439 tests en verde. |
| **F9** | Genoma (genes `struct` frente a `expr`): mutación sin recompilar vía `u_gene[k]`, con hasta 8 genes en vivo por átomo y la semilla aplicada solo al dominio del ruido. Eso permite generar una biblioteca combinatoria a partir de pocos átomos. |

---

## 5. Pioneer Score

Ponderación ajustada a la naturaleza del activo (reproductor procedural reactivo, no media server).

| Pilar | Peso | Nota (0-10) | Aporte | Justificación |
|---|---|---|---|---|
| Advanced Output (SliceCompositor, SDF, cinéticos) | 20 | 8,5 | 17,0 | Pieza más madura; techo de 32 slices y sin warp de malla |
| Modo B (distribución de programa y telemetría) | 20 | 8,5 | 17,0 | Tesis correcta, ahora con push acoplado al tick (R3 cerrado); coste GPU por salida sin cuantificar; sin framelock |
| Reactividad musical a nivel shader (contrato) | 20 | 9,0 | 18,0 | El mejor componente; restan la ambigüedad C1 y la superficie de API |
| Paridad FX luz↔vídeo | 15 | 6,5 | 9,75 | Gate correcto con fuente común; sin paridad de envolvente; latencia no medida y sobrevendida |
| Robustez de runtime y sustrato | 15 | 6,5 | 9,75 | Gran disciplina sobre un sustrato limitado: Electron/WebGL2, main como punto único de fallo, 8 bits con dither TPDF (R4 cerrado) pero sin 10 bits; relojes wrapped f64→f32 eliminan la degradación silenciosa en shows largos (R7 cerrado) |
| Calidad de ingeniería y verificabilidad | 10 | 7,5 | 7,5 | Tests, linter que compila y contratos; falta benchmark de GPU y medición de latencia |
| **Total** | **100** | | **79,00 → 79** | *Revisión 1: 76. +2 por el cierre verificado de R3 (push acoplado al tick) y R4 (TPDF en el epílogo); +1 por R7 (relojes wrapped en el host).* |

---

## 6. Veredicto

**ADQUIRIBLE CON CONDICIONES — Pioneer Score: 79/100** *(revisión 4; revisiones previas: 78, 76). Quedan abiertos: R1 (benchmark GPU), R2 (framelock), R5 (paridad de envolvente), R6 (main como punto único de fallo), R8 (techo 32 slices) — más las dos mediciones pendientes (CP-1, CP-2).*

Theia 2.0 no es un producto terminado para gira de nivel estadio. Es un **núcleo tecnológico con una tesis diferencial correcta y una ejecución de ingeniería superior a la media**, apoyado en un sustrato (Electron/WebGL2) que limita su techo profesional. Lo que se adquiere de verdad es:

1. **Un contrato de shader musical** (`SHADER_ATOM_BASE.md`) y su linter: propiedad intelectual de especificación, portable a cualquier backend (Vulkan, Metal o D3D12) sin perder valor.
2. **Una arquitectura de distribución por estado** (Modo B) que resuelve el escalado de resolución sin infraestructura de vídeo.
3. **Un compositor de salida SDF** listo para producción en escena y LED.
4. **La integración luz↔vídeo con fuente común**: la pieza estratégica para un fabricante de iluminación (Chauvet). Para AlphaTheta, el contrato musical y la reactividad a nivel de beat son el activo que encaja con el ecosistema de DJ.

**Condiciones previas al cierre (bloqueantes para la valoración final):**

- **CP-1** — Benchmark de GPU: Dembow Solar Corona más dos átomos de raymarching, a 1080p y a 4K, con 1, 2 y 4 salidas, en hardware de referencia (iGPU y discreta de gama media). Con criterio de aceptación sobre ms por frame y `renderScale` medio. *(R1)*
- **CP-2** — Medición fotón a fotón con fotodiodos del desfase luz↔vídeo y del desfase entre dos salidas HDMI, en una sesión de 60 minutos. *(R2, R5 — R3 ya no aporta jitter propio, pero la cadena rAF→vsync→proyector sigue sin medir)*
- **CP-3** — ~~Plan de remediación con fecha para R4 (dither)~~ **(R4 ya implementado)** y C1 (checklist — sigue abierto).

**Condiciones posteriores al cierre (integración):** R5 (paridad de envolvente), R6 (aislamiento de la telemetría) y una evaluación de portar el runtime de átomos a un backend nativo, manteniendo el contrato como interfaz estable.

*— PunkOpus*
