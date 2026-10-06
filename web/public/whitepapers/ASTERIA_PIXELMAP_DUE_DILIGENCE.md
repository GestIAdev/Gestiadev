# 🜨 ASTERIA PIXELMAP DUE DILIGENCE — ÁREA 7

## Auditoría Técnica de Adquisición — Mapeo Inverso de Píxeles y Compilador `.lfx` Espacial

**Clasificación:** Confidencial — Proceso de adquisición de IP LuxSync (Target: AlphaTheta Corporation / Chauvet Professional)
**Auditor:** PunkOpus — Auditor Jefe de Adquisiciones Tecnológicas & Arquitecto Principal DSP
**Producto evaluado:** LuxSync — *Asteria*, 4ª pestaña de Hephaestus: Lienzo Táctico + `fieldEngine` + `AsteriaCompiler` (Área 7 de 7)
**Fecha:** 2026-10-05
**Alcance verificado en código:**
`asteria/model/{AsteriaProject,fieldEngine,glyphRaster,rigDrift,rigFingerprint}.ts` ·
`asteria/compiler/{AsteriaCompiler,emissionPlan,cohortQuantizer,curveRotate,lutSynth,useAsteriaCompiler}.ts` ·
`asteria/compiler/synth/*` · `asteria/canvas/useNodeAtlas.ts` · `asteria/preview/CalibrationBus.ts` ·
`core/hephaestus/runtime/HephaestusRuntime.ts` · `core/hephaestus/HephEvaluationKernel.ts` ·
`core/aether/adapters/HephaestusAetherAdapter.ts` · `core/hephaestus/exportSanitizer.ts` · `core/aether/types.ts` (`NodeAtlasEntry`)
**Documentos precedentes:**
- `HEPHAESTUS-ENGINE-AUDIT-V1.md` — Área 2, Hephaestus (motor que ejecuta lo que Asteria compila) — **93.7/100**
- `V3_TYPE_SYSTEM_DUE_DILIGENCE.md` — Área 6, Sistema de tipos V3 / `.lfx` (contrato que Asteria emite) — **95/100**

**Evidencia empírica:** **1 010 tests verdes** en la suite ampliada (`src/theia` + `src/core/hephaestus` + `src/components/views/HephaestusView`), `tsc --noEmit` limpio en `tsconfig.node.json` **y** `tsconfig.json` (2026-10-05). Benchmarks de compilación y de runtime ejecutados por el auditor sobre el código de producción (§7), pre y post-fix.

> ## ✅ ACTUALIZACIÓN POST-AUDITORÍA — WAVE 8202 (mismo día, 2026-10-05)
>
> **El hallazgo crítico H1 (fan-out O(T×F) de pistas celulares, §5/§7.3) fue
> corregido en código durante esta auditoría.** `HephaestusRuntime.ts` +
> espejo JS de producción: si `track.cell` lleva prefijo de device que
> resuelve a un fixture vivo, `fixtureIds` se reduce a `[deviceId]` antes
> del tick — misma regla de corte que `useHephPreview` (paridad WYSIWYG).
> Tres tests de regresión nuevos (`AsteriaCellularPatches.test.ts`).
>
> | Métrica | Pre-fix | Post-fix |
> |---|---|---|
> | Muestras/frame — 32×32 (1 024 pistas) en rig de 120 | 122 880 | **1 024** |
> | `tick()` — 32×32 en rig de 120 | 136 ms (599 % frame) | **0.50 ms (2.2 %)** |
> | `tick()` — 16×16 en rig de 40 | 6.88 ms (30 %) | **0.20 ms (0.9 %)** |
> | Utilidad de muestras | 0.8–2.5 % | **100 %** |
>
> **Pioneer Score actualizado: 85.9 → 89.9 / 100** (desglose recalculado en
> §11 — Integración Hephaestus 78→92, Escalabilidad 62→78). El texto
> original de cada sección afectada se preserva con el hallazgo marcado
> como resuelto, como registro de la auditoría inicial.
>
> Hallazgo incidental cerrado en la misma intervención: `HephParameterOverlay`
> `.test.ts` usaba un factory del formato V2 (`curves: Map`) — 20 tests en
> rojo **preexistentes, no relacionados con H1**; el factory ahora emite
> `tracks[]` V3 y la suite vuelve a verde completo.
>
> ## ✅ SEGUNDA ACTUALIZACIÓN — WAVE 8203 (mismo día): H2, H3 y H6 cerrados
>
> - **H2 (presupuesto 256 KB sin aplicar)** → `USER_SAFETY_POLICY` ahora se
>   **exporta** desde `LfxFileLoader` y se aplica en `HephFileIO.saveClip`,
>   el único choke point de escritura: el JSON final (`$schema` + clip +
>   checksum) se mide con `Buffer.byteLength` y, si excede el presupuesto,
>   lanza `LFX_PAYLOAD_BUDGET_EXCEEDED` **antes de `writeFile`** — el error
>   llega a la UI vía `heph:save {success:false}` (mensaje en inglés, como
>   toda la UI). Test nuevo con electron mockeado: rechazo sin archivo +
>   ruta de éxito.
> - **H3 (sin estimador de coste)** → `CompileReport.runtimeCost`:
>   `{rigDevices, cellularTracks, estSamplesPerFrame, fanOutBound}`.
>   `estSamplesPerFrame` = Σ por pista (celular → 1 tras el narrowing WAVE
>   8202; zonal → rigDevices peor caso). `HIGH_RUNTIME_COST` si est > 2 000.
>   3 tests.
> - **H6 (strings en hot-path)** → `ResolvedTrack.blendKeyByFixture`
>   (Map `fixtureId → clave completa`) materializado en
>   `_buildResolvedTrack`; el tick hace `Map.get` — **cero strings
>   efímeros por frame** (antes T×F allocs). Fallback defensivo idéntico.
>   Espejos JS actualizados y `node --check`.
>
> **Pioneer Score: 89.9 → 90.5 / 100** (§11 — Integración 92→93 por
> zero-alloc real; Escalabilidad 78→81 por enforcement+visibilidad — el
> techo de ~440 celdas no se movió, solo su honestidad; Disciplina 93→94).
> Verificación: `tsc` limpio en ambos tsconfig, **1 010 tests verdes**.

> **NOTA DE HONESTIDAD.** El mandato de esta auditoría trae tres afirmaciones comerciales que he medido en lugar de repetir: *(a)* "compila en segundos", *(b)* "mapeos 2D/3D", *(c)* "dispararlo en tiempo real sobre matrices LED". La primera es **falsa por defecto** — compila en **milisegundos**, mejor de lo prometido. La segunda es **falsa por exceso** — el campo es estrictamente 2D (plano XZ). La tercera es **cierta con un techo duro** que he cuantificado y que hoy invalida matrices medianas en rigs medianos (§7.3). Las tres correcciones están en el cuerpo del informe con número y línea de código. Un CTO que compra sobre el pitch y no sobre esta sección compra otra cosa.

---

## ÍNDICE

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Modelo de Datos — El Gesture Stack no destructivo](#2-modelo-de-datos--el-gesture-stack-no-destructivo)
3. [Kernel Geométrico — `fieldEngine` (el mapeo inverso)](#3-kernel-geométrico--fieldengine-el-mapeo-inverso)
4. [Compilador — `AsteriaCompiler` + Plan de Emisión](#4-compilador--asteriacompiler--plan-de-emisión)
5. [Integración Ortogonal con Hephaestus — los parches Δ1-Δ3](#5-integración-ortogonal-con-hephaestus--los-parches-δ1-δ3)
6. [Integración Ortogonal con Selene — el pasaporte `.lfx`](#6-integración-ortogonal-con-selene--el-pasaporte-lfx)
7. [Rendimiento Medido — compilación, payload y runtime](#7-rendimiento-medido--compilación-payload-y-runtime)
8. [Chaos Engineering — El Factor "Técnico Borracho"](#8-chaos-engineering--el-factor-técnico-borracho)
9. [Benchmark vs. Industria — grandMA3, Resolume, MADRIX](#9-benchmark-vs-industria--grandma3-resolume-madrix)
10. [Hallazgos & Carencias](#10-hallazgos--carencias)
11. [Veredicto, Pioneer Score y Recomendación de Cierre](#11-veredicto-pioneer-score-y-recomendación-de-cierre)

---

## 1. RESUMEN EJECUTIVO

Asteria es un **pixel mapper inverso**. La industria mapea *hacia delante*: se renderiza una textura (vídeo, generador, bitmap) y se **muestrea** en la posición de cada píxel/fixture. Asteria invierte el flujo: no existe textura. El operador pinta **gestos paramétricos** sobre la planta del escenario en metros, un kernel geométrico evalúa esos gestos **directamente en la posición de cada nodo real del rig** (gather, no scatter) y produce un campo escalar por nodo `{delayMs, gain}` por parámetro DMX. Ese campo se **compila** a pistas `HephTrack` estándar con prefijo `ast_` dentro del clip `.lfx` V3 activo.

```
Lienzo Táctico (planta XZ, metros)
    │  7 gestos: base · wave · chrono · glyph · slice · manual · noise
    ▼
Gesture Stack  ── receta no destructiva, persistida en clip.asteria (opaco para el core)
    │  debounce 150 ms (patch-time, jamás en el tick)
    ▼
fieldEngine.evaluate()  ── O(N·G), zero-alloc, TypedArrays preasignados
    │  → FieldPlanes { scalar: Map<param, {delay, gain, mask, owner}>, color: {rgb lineal, alpha} }
    ▼
AsteriaCompiler.compile() → planEmission() → emitRoute()
    │  4 firmas espacio-temporales × 3 rutas (lambda · zoned · surgical)
    │  validateAstTrack()  ── puerta estructural, ninguna pista inválida sale
    ▼
injectAstTracks()  ── reemplaza SOLO ast_*; las pistas manuales de Forge sobreviven
    ▼
.lfx V3 normal  ──►  HephaestusRuntime (44 Hz)  ──►  HephaestusAetherAdapter (cell routing)
                                                         ──►  NodeArbiter  ──►  DMX / Art-Net / sACN
```

**Tesis de adquisición.** Asteria no añade un motor de render nuevo al ecosistema: es un **compilador** que traduce intención espacial a un formato que el resto del ecosistema ya sabe ejecutar, previsualizar, firmar (SHA-256), secuenciar (Chronos) y disparar automáticamente (Selene). El valor no está en la resolución que alcanza —es baja— sino en el **acoplamiento cero**: el runtime no sabe que Asteria existe más allá de un discriminador de 1 campo (`track.cell`).

**Primera impresión:** ingeniería de compilador seria. Rotación cíclica exacta de curvas sin remuestreo, cuantización por percentiles (Lloyd), median-cut en OKLab, migración de esquema con paridad byte a byte, detección de deriva del rig con remapeo por proximidad, y un validador estructural que rechaza en lugar de inyectar basura. **Y un defecto de escalado en la frontera con el runtime que el blueprint original negó explícitamente** ("el coste en runtime de un `.lfx` de Asteria es idéntico al de uno hecho a mano") y que he medido: con enrutamiento celular, el coste por frame es **O(pistas × fixtures del rig)**, no O(pistas) (§7.3).

**Puntuación final: 90.5/100 — EXCEPTIONAL (marginal, con techo de plataforma honesto).** La única condición crítica encontrada (H1) y los tres hallazgos de escalabilidad/memoria (H2, H3, H6) fueron corregidos y verificados durante esta misma auditoría (WAVE 8202 y WAVE 8203).

---

## 2. MODELO DE DATOS — EL GESTURE STACK NO DESTRUCTIVO

`asteria/model/AsteriaProject.ts`. Unión discriminada de 7 gestos (`Gesture`), `readonly` universal, versión de esquema explícita (`version: 2`).

### 2.1 Anatomía

| Gesto | Escribe | Semántica | Coste |
|---|---|---|---|
| `base` | delay+gain | suelo uniforme del campo | O(N) |
| `wave` | delay(+gain) | `delay = dist / speedMps · 1000`; `point`/`ring`/`line`; Huygens multi-emisor `min(dist)`; `falloffM` → gain | O(N·H) |
| `chrono` | delay | el **tempo del arrastre** es la coreografía; `captureRealTime` o reparametrización arc-length; `timeScale`, `invert` | O(N·T) |
| `glyph` | gain o delay | texto rasterizado (bitmap 5×7 embebida) muestreado por nodo; `invert`, `threshold`, `antialias` | O(N) |
| `slice` | delay | bucketing por eje (`x`/`z`/`radius`/`angle`/`dmx`/`zone`), simetría, `shuffleSeed` | O(N log N) |
| `manual` | por entrada | escape hatch O(N) por nodo | O(E) |
| `noise` | delay | value-noise fBm 1-3 octavas, determinista por seed | O(N·oct) |

Cada gesto lleva `BlendOp ∈ {replace, min, max, add, mul}` y, desde WAVE 8192, un `paint?: Partial<LayerPaint>` que declara **qué** pinta la capa (params DMX, color, opacidad, forma de onda, Λ-Ride) ortogonalmente a **cómo** reparte tiempo/gain en el espacio (geometría).

#### ✅ FORTALEZAS

1. **Máscaras por `nodeId`, jamás por índice.** `NodeMask.nodeIds` referencia handles canónicos `"<deviceId>:<cellSuffix>"` del NodeGraph. Un re-patch reordena el atlas sin corromper el documento. Es la decisión que hace posible §8.1 (Rig Drift).
2. **Separación geometría ⟂ pintura.** Mismo principio de ortogonalidad que el Área 6 elogió en `spatialZones ⟂ tracks ⟂ cognitiveDNA`, aplicado *dentro* del documento Asteria. Herencia `effectivePaint(g) = { ...defaultPaint, ...g.paint }`: un gesto sin `paint` es bit-compatible con v1.
3. **Migración v1→v2 sin pérdidas y con gate de paridad.** `migrateV1toV2` es idempotente, no muta la entrada, y fija `colorFlood: 'allow'` en documentos migrados *precisamente* para que la compilación sea byte a byte idéntica a v1 (gate G-MIG, testeado). Los proyectos nuevos nacen con `'contain'`. **Distinguir "default para lo nuevo" de "paridad para lo viejo" es madurez de formato**, no de prototipo.
4. **La receta viaja con el resultado (D-4).** `clip.asteria` se embebe en el `.lfx`; el core lo trata como payload opaco. Un `.lfx` compartido entre operadores es re-editable, no solo reproducible. Cubierto por la firma SHA-256 del Área 6.

#### ⚠️ OBSERVACIONES

1. **`GlyphGesture.svgPath` está declarado y no tiene consumidor.** `grep` sobre `asteria/model/`: una sola aparición, la declaración. El blueprint T5 promete "texto **o path SVG**". Hoy solo texto 5×7. Campo reservado no documentado como tal (a diferencia de `HephTrack.cell` en v3.0, que sí lo estaba).
2. **Charset de la fuente: A-Z, 0-9 y 8 signos.** Minúsculas se pliegan a mayúsculas; sin acentos, sin Ñ, sin símbolos. Para un comprador japonés (AlphaTheta) la ausencia de cualquier vía a glifos no latinos es un gap de producto, no de arquitectura.

**Veredicto §2: 94/100.**

---

## 3. KERNEL GEOMÉTRICO — `fieldEngine` (el mapeo inverso)

`asteria/model/fieldEngine.ts` — 973 líneas. Es el "pixel shader" de Asteria, ejecutado en CPU, sobre posiciones reales de nodos.

### 3.1 Compositor en dos etapas

```
Etapa 1 — KERNEL: cada gesto escribe su geometría cruda en UN scratch preasignado
          (sDelay, sGain, sCov, sClaim, sChan) — sin saber qué params targetea.
Etapa 2 — COMPOSITOR: para cada plano p ∈ effectivePaint(g).params:
          blendInto(plane_p, scratch, g.op, canal)
          owner_p[i] = índice de capa si claim[i] ∧ cov[i] ≥ 0.5
          color: "over" estándar en RGB LINEAL — a_i ← a_i + α·(1−a_i)
```

#### ✅ FORTALEZAS

1. **Gather puro sobre la topología real.** El kernel itera `posX/posZ` (`Float32Array` extraídos una vez del `NodeAtlas`), no una rejilla. La geometría incluye nodos que **solo existen en el backend** (pétalos sintéticos a 0.15 m de los fixtures compuestos), expuestos por un endpoint patch-time dedicado (`lux:aether:getNodeAtlas`). **No hay paso de rasterización, ni resolución de lienzo, ni aliasing de muestreo**: cada nodo recibe el valor analítico del gesto en su coordenada exacta. Esto es lo que "inverso" significa técnicamente y es la propiedad que un pixel mapper de vídeo no puede tener.
2. **Física en metros, no en índices.** `wave` ordena por distancia euclídea real; `PhaseConfigPro` (Área 2 §3) ordena por índice de fixture. En un rig asimétrico —todos los reales— el primero produce un barrido que *parece* un barrido. Huygens (`min(dist)` sobre N emisores) da frentes compuestos sin coste de diseño.
3. **Paridad determinista con el Phase Canvas.** `slice` importa `hash01` y `applySymmetry` **del mismo módulo** que `PhaseConfigPro`. Un chase hecho en Asteria y otro en el Phase Rack son comparables bit a bit. Paridad, no dialecto paralelo.
4. **Zero-alloc real en evaluación.** Todos los buffers se dimensionan a N en `createFieldEngine`; `ensurePlanes` solo realoca si cambia el *conjunto* de params activos, conservando la identidad `===` de los planos supervivientes. Las únicas alocaciones on-demand (arc-length de chrono, bitmap de glifo) crecen monótonamente al máximo visto y se cachean. El engine se recrea solo si cambia la referencia del atlas (N distinto desbordaría los buffers — documentado).
5. **Color en el espacio correcto.** Mezcla en RGB lineal con alpha acumulado; un nodo con `alpha = 0` sale del plano (`mask = 0`) — *lienzo transparente*: el fixture conserva el color que le dé Selene. Es la semántica correcta para una capa que convive con un autómata.

#### ⚠️ OBSERVACIONES

1. **El campo es 2D. Punto.** `NodeAtlasEntry.position` trae `{x, y, z}` en metros, pero el engine extrae solo `x` y `z` (`fieldEngine.ts:307-311`); `grep position.y` en `asteria/model/`: cero resultados. Un truss a 2 m y otro a 8 m sobre la misma vertical reciben el mismo valor. **La afirmación "mapeos 2D/3D" del pitch no está respaldada por el código.** Extender a 3D es aritmético (añadir `posY` y `dy²`), pero el lienzo, las herramientas y el `WorldPoint2D` del modelo son planos: es una versión mayor de UX, no un parche.
2. **Value-noise, no Perlin.** El comentario dice "Perlin-style"; es value-noise con hash `sin-fract` y smoothstep. Para modular *delays* es suficiente y determinista. Para un comprador que lea "Perlin" en un datasheet, es una imprecisión de nomenclatura.

**Veredicto §3: 92/100.**

---

## 4. COMPILADOR — `AsteriaCompiler` + Plan de Emisión

El activo técnicamente más denso del área. `AsteriaCompiler.ts` (601 L) + `emissionPlan.ts` (1189 L) + `curveRotate.ts` + `cohortQuantizer.ts` + `synth/*`.

### 4.1 El problema que resuelve

El `.lfx` V3 tiene **un único handle per-fixture**: `phaseOverrides[deviceId].offsetMs`. No existe "valor por píxel". El compilador tiene que expresar un campo arbitrario `{delay_i, gain_i}` por nodo usando solo curvas, zonas, offsets y —desde WAVE 8040— `track.cell`.

### 4.2 Las cuatro estrategias

| Estrategia | Mecanismo | Pistas emitidas | Expresa |
|---|---|---|---|
| **Vía Λ** | La curva es una **LUT**; el `offsetMs` per-fixture es su **dirección de lectura**. `spreadDeg = 1` para despertar el bus de overrides (con 0 el runtime los ignora en silencio — hallazgo A1). | **1** por (param × forma) | delay per-fixture; no gain |
| **Vía B (cohort)** | `quantizeGainCohorts`: K ≤ 16 cohortes por **percentiles** de gain; representante = media (óptimo de Lloyd para K fijo); curva maestra rotada por delay representativo, gain horneado en keyframes. | **K** por param | delay + gain cuantizado |
| **MCC-Cell** | Una pista por (nodo × param), curva rotada por el delay exacto de la celda, gain horneado, `cell = nodeId`. | **N** por param | todo, por celda |
| **MCC-Device** | Cohortes limpias + reemisión quirúrgica *solo* de las cohortes que derraman sobre zonas ajenas. | K + |spill| | todo, coste mínimo |

`'auto'` recorre el árbol: ¿algún plano distingue celdas del mismo fixture? → MCC; ¿gain varía? → MCC-Device; si no → Λ. Los gestos `glyph` fuerzan MCC (máscara libre 1:1, cero derrame).

### 4.3 Plan de Emisión (WAVE 8190)

Sustituye el multiplicador ciego `params × cohortes` por clasificación por firma:

```
tracks = Σ_p Σ_{C ∈ clases(p)} ( route(C) = surgical ? |C| : 1 )
```

Firmas `uniform-static` · `uniform-animated` · `graded-animated` · `cellular`. **Regla de Propiedad de Luminancia (§2.4):** con `intensity` activo, `color` se emite como constante de 1 keyframe por clase de color — la envolvente pertenece a intensity. Test G-PLAN-DECOUPLE: 12 fixtures × {intensity, color} con derrame total → **1** pista de color + 12 de intensity, no 24.

#### ✅ FORTALEZAS

1. **Rotación cíclica exacta sin remuestreo (`curveRotate.ts`).** `rot(C,d)(τ) = C((τ − d) mod D)` construida **reordenando keyframes**, no muestreando. Costura de borde con valor `C(d)` evaluado **con el `CurveEvaluator` de producción** (semántica idéntica al runtime, no una reimplementación); costura de wrap con `hold` exacto; solo las dos piezas partidas de un segmento Bézier degradan a lineal (decisión D-2 documentada). Invariante `rot(C, 0) === C` por referencia. **Es la pieza que un equipo junior resolvería muestreando a 100 puntos y multiplicando el payload por 30.**
2. **Corrección de la flecha del tiempo (WAVE 8197).** El runtime evalúa `t + offsetMs` (avance). El compilador emite el retardo como `offsetMs = (D − delay mod D) mod D`. El bug inverso —chases que corren al revés— es el clásico de este dominio; está identificado, corregido y documentado en los tres puntos de emisión (`lambdaOverrides`, `cohortOverrides`, `rotateCurveCyclic`).
3. **Median-cut en OKLab.** Con más colores distintos que `colorBudget`, cuantiza en un espacio perceptualmente uniforme y re-proyecta centroides a sRGB8. Un equipo que cuantiza color en RGB produce bandas visibles; aquí no.
4. **Higiene numérica antes del disco.** `sanitizeCurve`: `timeMs` entero, valores a 4 decimales, HSL a 1 decimal. El redondeo es monótono, el orden ASC se preserva sin re-sort. El ruido de coma flotante no viaja al `.lfx` — relevante porque el `.lfx` se firma con SHA-256.
5. **Validador estructural como puerta, no como log.** `validateAstTrack`: prefijo `ast_`, zonas ≠ ∅, keyframes ≠ ∅ y ASC en [0,D], valores en rango, overrides enteros en [0,D]. Una pista que viola el contrato se **rechaza con warning** (`TRACK_REJECTED`) y no se inyecta.
6. **Coexistencia con el operador.** `injectAstTracks` filtra solo `ast_*`. Si una pista Asteria enmascara una curva manual de Forge (mismo param, zonas solapadas, `replace`), el reporte lo dice: `AST_SHADOWS_FORGE`. **El sistema avisa de lo que pisa.**
7. **Reporte honesto.** `CompileReport` expone estrategia real, pistas, keyframes, overrides, nodos cubiertos, fixtures alcanzados y **bytes reales** (`JSON.stringify`). ~20 códigos de warning tipados (`GAIN_REQUIRES_COHORTS`, `COHORT_ZONE_SPILL`, `GLYPH_SUBOPTIMAL_RES`, `COLOR_QUANTIZED`, `RIDE_TYPE_MISMATCH`…). Nada se degrada en silencio.
8. **Arsenal de síntesis declarativo.** 8 formas (`pulse`, `triangle`, `ramp-up/down`, `square`, `sine`, `laser`, `hold`) con `duty`/`edge`/`floor`/`ceil`, por capa. **Λ-Ride:** cualquier curva esculpida a mano en Forge puede ser la LUT de todas las estrategias — el compilador inyecta geometría, no inventa forma.

#### ⚠️ OBSERVACIONES

1. **Vía Λ no puede expresar gain per-fixture** (`GAIN_REQUIRES_COHORTS`). Limitación del formato, declarada y reportada; `'auto'` escala a cohortes.
2. **Params no emitibles:** `gobo1`, `gobo2`, `prism`, `smoke_density`, `fan_speed` → `PARAM_SKIPPED`; `curveMode: 'stepped'` nunca se emite. Consistente (son canales de rueda, no continuos), pero un pixel mapper de gobos/prismas no existe.
3. **Coste quirúrgico ≈ 590 B por celda animada** (medido, §7.2). El compilador es eficiente *en número de pistas*; la ruta MCC no tiene compresión estructural (no hay "pista con N celdas"): la limitación es del formato V3, no del compilador — pero es lo que pone el techo de §7.

**Veredicto §4: 93/100.**

---

## 5. INTEGRACIÓN ORTOGONAL CON HEPHAESTUS — LOS PARCHES Δ1-Δ3

### 5.1 Lo que el runtime tuvo que aprender

Toda la independencia celular descansa en `HephTrack.cell` — el campo que el Área 6 (§1.3) registró como *"RESERVADO v3.0, sin consumidores"*. Asteria lo activó con tres parches:

| Parche | Dónde | Qué | Coste hot-path |
|---|---|---|---|
| **Δ1** | `HephaestusRuntime._buildResolvedTrack` | blend-key `fixtureId + ':' + param + '#' + cell`, sufijo **precalculado** en patch-time | 1 concatenación/muestra (igual que antes) |
| **Δ2** | `HephaestusRuntime.writeOutput` | `out.cell = cell` sobre el slot preasignado | 1 asignación |
| **Δ3** | `HephaestusAetherAdapter` | match exacto de celda **antes** del match por zona; sin fallback a zona ni a brightness para pistas celulares | `_nodeCellMatches`: O(1), sin alocación (`endsWith` + verificación de `:`) |

#### ✅ FORTALEZAS

1. **Compatibilidad bit-exacta con shows V3 existentes.** Sin `cell`, el blend-key es `fixtureId:paramId`, idéntico al legado. Test `Δ1-compat`: dos pistas sin `cell` siguen fundiendo (`max → 0.8`). Ningún `.lfx` previo cambia de comportamiento.
2. **Aislamiento sin fugas.** Una pista celular sin match produce **silencio**, no un volcado a todos los nodos de la familia ni a `brightness` de COLOR (`HephaestusAetherAdapter.ts:190, 214`). La fuga entre celdas —el bug natural aquí— está cerrada explícitamente.
3. **WYSIWYG preservado.** `HephEvaluationKernel` (preview) discrimina por `paramId#cell` con la misma clave que el runtime (`HephEvaluationKernel.ts:182, 201`), y `useHephPreview.resolveTrackFixtureSet` honra `cell` antes que zonas. 7 + 9 tests dedicados.
4. **Cero cambios en `TickEngine` / `NodeArbiter`.** El dogma "nada espacial en el tick" se cumple: toda la matemática espacial se hornea en patch-time.

#### ⛔ HALLAZGO CRÍTICO — H1: FAN-OUT O(T×F) DE LAS PISTAS QUIRÚRGICAS

Las pistas celulares se emiten con `zones: ['all']` (`emissionPlan.ts:1144`: *"el filtro real lo hace `cell` (Δ3)"*). En el runtime, `resolveZonesToFixtures(['all'])` devuelve **todos los fixtures del rig** (`HephaestusRuntime.ts:997`), y `tickActive` Path B emite **una muestra por fixture por pista** (`HephaestusRuntime.ts:680-695`). El adapter descarta después todas menos una.

```
coste/frame = T_celulares × F_rig        (no T_celulares)
utilidad    = 1 / F_rig
```

El blueprint lo descartó por escrito (§0.9: *"El coste en runtime de un `.lfx` de Asteria es idéntico al de un `.lfx` hecho a mano: la única diferencia es que tiene más keyframes"*). **Es falso para MCC y MCC-Device**, y el comentario de `CompileStrategy` lo admite sin cuantificarlo (*"engañando al filtro de zonas sin tocar el runtime"*). Medición en §7.3: una matriz 32×16 en un rig de 40 fixtures consume **75 %** del frame de 22.7 ms *solo en `HephaestusRuntime.tick()`*, antes del adapter y del Arbiter.

Agravante: cada muestra concatena `fixtureId + track.blendSuffix` (`HephaestusRuntime.ts:721`). Con 20 480 muestras/frame son 20 480 strings efímeros/frame — presión de GC en el camino caliente que el Área 2 certificó como zero-alloc *para el volumen de pistas de un clip hecho a mano*. **✅ Cerrado en WAVE 8203 (H6):** `blendKeyByFixture` materializado en `_buildResolvedTrack` — `Map.get` en lugar de concatenación por muestra.

**Remediación (coste bajo, sin cambiar el formato):** en `_buildResolvedTrack`, si `cell` contiene `':'` y su prefijo pertenece a `fixtureIds`, reducir `fixtureIds = [prefijo]`. El `nodeId` canónico garantiza que el `deviceId` no contiene `':'` (contrato `NodeAtlasEntry`). `useHephPreview` ya hace exactamente este corte (`useHephPreview.ts:64-66`). Coste esperado tras el fix ≈ caso `rig=1` del benchmark: **0.19 ms para 256 celdas** (§7.3). Una línea de lógica + tests.

> **✅ WAVE 8202 — RESUELTO (2026-10-05).** Implementado en
> `HephaestusRuntime._resolveClipTracks` (TS + espejo JS): corte de
> `fixtureIds` al prefijo de `cell` cuando resuelve a un fixture vivo;
> fallback intacto si el prefijo no resuelve (celda sin `':'` o device
> ausente). El corte ocurre **antes** de construir fases, así que también
> evita que `resolveWithOverrides` itere el rig completo. 3 tests de
> regresión nuevos: emisión exacta 1-muestra-por-pista con `zones:['all']`,
> conservación del fallback, y no-interferencia con pistas planas.
> Post-fix medido: **100 % de muestras útiles**, ≤ 2.2 % del frame a
> 1 024 celdas en cualquier rig (§7.3).
>
> **Veredicto §5 actualizado: 93/100** (post-WAVE 8203). Diseño de
> discriminador impecable, enrutamiento O(T) con 100 % de utilidad **y
> zero-alloc real en el hot-path** (`blendKeyByFixture`, H6). El defecto
> original se conserva arriba como registro de la auditoría.

~~**Veredicto §5: 78/100.** Diseño de discriminador impecable; la frontera de enrutamiento tiene un defecto de complejidad algorítmica que se corrige en una línea pero que hoy es real.~~

---

## 6. INTEGRACIÓN ORTOGONAL CON SELENE — EL PASAPORTE `.lfx`

### 6.1 Ortogonalidad: verificada

`grep cognitiveDNA|energyZone|acoTriad` sobre todo `asteria/`: **cero resultados**. Asteria escribe exclusivamente el Bloque C (QUÉ: `tracks`) y un payload opaco (`clip.asteria`). Selene consume exclusivamente el Bloque D (CUÁNDO/CÓMO: `cognitiveDNA`). **Ninguno conoce al otro.** Es exactamente la tesis del Área 6 (§1.2) demostrada empíricamente por un tercer consumidor: el compilador espacial puede reescribir 1 024 pistas sin tocar un bit de la elegibilidad cognitiva, y Selene puede disparar el clip sin conocer la topología.

### 6.2 El puente de exportación (WAVE 8200-8201)

La auditoría interna WAVE 8200 encontró que un clip pintado 100 % en Asteria heredaba `DEFAULT_COGNITIVE_DNA` (span de energía 5 → Gate 4 bloqueaba el SAVE; `compatibleVibes: []` → el registry lo rechazaba en silencio). La remediación `prepareClipForExport` (`core/hephaestus/exportSanitizer.ts`, puro, 19 tests) hace en patch-time:

- **M1 — higiene espacial:** normaliza `track.zones` a `CanonicalZone` (aliases Aether, sufijos laterales → zona padre, irreconocible → `'unassigned'`, **jamás `'all'`**), recomputa `spatialZones` raíz.
- **M2 — pasaporte Selene:** colapsa `energyZone` a span ≤ 2 vía `ARCHETYPE_BIAS_MAP`; si no hay vibes, marca `visibility: 'manual_only'` — catalogado, **nunca auto-seleccionado**. Flag honesto en lugar de DNA inventado.
- **M3 — doble enforcement:** renderer (bloquea el botón) **y** main (`heph:save` re-sanea y re-evalúa gates antes de escribir). Cierra el agujero de callers que bypassean la UI.

#### ✅ FORTALEZAS

1. Ortogonalidad real, no declarativa (§6.1).
2. El sanitizador **no inventa** ADN para clips Hephaestus-only y prefiere `manual_only` a fingir intención.
3. Defensa en profundidad en el IPC — el patrón que el Área 6 pidió para `.lfx`.

#### ⚠️ OBSERVACIONES

1. **Asteria no informa a Selene.** Un frente de onda a 8 m/s con `laser` es objetivamente agresivo; un `noise` de 3 octavas es objetivamente orgánico. El blueprint (WAVE 8060) propone derivar una sugerencia de genoma ACO del stack de gestos. **No existe.** Hoy el operador debe ir al DnaRail a mano o el clip queda `manual_only`. Para el pitch "autómata que dispara mapeos espaciales", esta es la pieza que falta — y es barata, porque toda la información está en el stack.
2. `PixelMapAetherAdapter` (`core/aether/canvas/`) —camino L3 vivo para *transmitir* el campo en lugar de hornearlo— existe en el core, pero **Asteria no lo usa** (WAVE 8060, no comprometida). Es la salida natural al techo de payload (~440 celdas) que ni H1 ni H2 pueden levantar — el único camino real a matrices > 32×32 en rigs grandes.

**Veredicto §6: 80/100.**

---

## 7. RENDIMIENTO MEDIDO — COMPILACIÓN, PAYLOAD Y RUNTIME

Benchmarks ejecutados por el auditor el 2026-10-05 con el código de producción, bajo `vitest` en la máquina de desarrollo (Windows, Node). Matriz sintética `W×H` de celdas `IMPACT` de un único device, pitch 0.10 m. Gesto `wave` puntual con `falloffM` (anima delay **y** gain → fuerza MCC) o `glyph "LUX"`. Promedio de 10 compilaciones tras 3 de calentamiento; runtime promedio de 200 ticks. **Cifras indicativas, no de laboratorio** — relativas entre sí son fiables, absolutas dependen del hardware.

### 7.1 Compilación — "en segundos" es falso: es en milisegundos

| Matriz | Nodos | `evaluate()` | `compile()` wave | `compile()` glyph |
|---|---|---|---|---|
| 8×8 | 64 | 0.07 ms | 1.45 ms | 0.73 ms |
| 16×16 | 256 | 0.17 ms | 3.32 ms | 1.93 ms |
| 32×16 | 512 | 0.10 ms | 4.52 ms | 2.41 ms |
| 32×32 | 1 024 | 0.17 ms | 8.27 ms | 4.02 ms |

El pipeline vivo añade un debounce deliberado de 150 ms (`ASTERIA_COMPILE_DEBOUNCE_MS`) para no compilar 60 veces/s durante un arrastre. **Latencia percibida gesto → clip actualizado: ~150-160 ms.** Escalado lineal en N. Esto **supera** la afirmación comercial por tres órdenes de magnitud; conviene corregir el pitch hacia arriba, no hacia abajo.

### 7.2 Payload — el techo de 256 KB

| Matriz | Pistas | Keyframes | Bytes (wave) | % de 256 KB |
|---|---|---|---|---|
| 8×8 | 64 | 446 | 37 372 | 14 % |
| 16×16 | 256 | 1 790 | 150 684 | 57 % |
| 32×16 | 512 | 3 582 | 302 390 | **115 %** |
| 32×32 | 1 024 | 7 166 | 603 801 | **230 %** |

≈ **590 B por celda animada** en MCC. Techo práctico: **~440 celdas animadas por clip**.

**H2 — el límite es un HUD, no una regla.** ~~`USER_SAFETY_POLICY.MAX_FILE_SIZE_BYTES = 256 KB` (`LfxFileLoader.ts:66`) sigue sin consumidor en el camino de carga (ya señalado en WAVE 8200 §Pilar 4, no remediado). El `AsteriaTransportDrawer` pinta el porcentaje, pero un `.lfx` de 600 KB se guarda y se carga. Resultado: un presupuesto que el producto anuncia y no aplica~~ **✅ Cerrado en WAVE 8203 (H2):** `USER_SAFETY_POLICY` exportada y aplicada en `HephFileIO.saveClip` — el JSON final se mide y, si excede el presupuesto, el save se rechaza con `LFX_PAYLOAD_BUDGET_EXCEEDED` antes de `writeFile`. Error visible en UI vía `heph:save {success:false}` (mensaje en inglés, igual que el resto de la UI). Test nuevo: rechazo sin archivo + éxito bajo presupuesto. El presupuesto ahora se aplica de verdad.

### 7.3 Runtime — el hallazgo H1 cuantificado

`HephaestusRuntime.tick()` aislado (sin adapter, sin Arbiter, sin DMX). Clip compilado por Asteria (wave, MCC), reproducido con `F` fixtures en el rig.

| Matriz | Rig (F) | Pistas | Muestras/frame | Útiles | `tick()` | % de 22.7 ms |
|---|---|---|---|---|---|---|
| 16×16 | **1** | 256 | 256 | 256 | **0.19 ms** | **0.8 %** |
| 16×16 | 40 | 256 | 10 240 | 256 (2.5 %) | 6.88 ms | 30 % |
| 32×16 | 40 | 512 | 20 480 | 512 (2.5 %) | 17.1 ms | **75 %** |
| 32×32 | 40 | 1 024 | 40 960 | 1 024 (2.5 %) | 39.8 ms | **175 % — drop de frame** |
| 32×32 | 120 | 1 024 | 122 880 | 1 024 (0.8 %) | 136 ms | **599 % — ~7 fps** |

**Lectura para el CTO:**
- La fila `F = 1` es el coste *intrínseco* de Asteria: **0.19 ms para 256 celdas animadas — 0.8 % del frame.** Eso es lo que el producto cuesta tras el fix de H1, y es excelente.
- Todo lo demás es fan-out desperdiciado (97.5 % de las muestras se descartan en el adapter) y crece con el tamaño del rig, que es justo la variable que el operador no controla.
- **Hoy**, en un rig de club de 40 fixtures, una matriz de 16×16 es viable (30 %, más adapter); 32×16 es marginal; 32×32 no es operable.
- **Tras el fix**, extrapolando linealmente desde `F = 1`: 1 024 celdas ≈ 0.8 ms (~3.5 % del frame). El cuello de botella vuelve a ser el payload de 256 KB (§7.2), no la CPU — que es lo que el blueprint siempre afirmó.

### 7.3b — Post-fix WAVE 8202 (medido, misma metodología)

| Matriz | Rig (F) | Muestras/frame | `tick()` pre-fix | `tick()` post-fix | % de 22.7 ms |
|---|---|---|---|---|---|
| 16×16 | 40 | **256** (era 10 240) | 6.88 ms | **0.20 ms** | **0.9 %** |
| 32×16 | 40 | **512** (era 20 480) | 17.1 ms | **0.25 ms** | **1.1 %** |
| 32×32 | 40 | **1 024** (era 40 960) | 39.8 ms | **0.48 ms** | **2.1 %** |
| 32×32 | 120 | **1 024** (era 122 880) | 136 ms | **0.50 ms** | **2.2 %** |

El coste post-fix ya **no escala con el rig** (0.20→0.50 ms de F=1 a F=120 es ruido + GC), validando la proyección hecha desde `F = 1` y confirmando que la fila `F = 1` medía el coste intrínseco real: ~0.5 µs por celda animada por frame. Escalado post-fix ≈ 84×-270× según el caso. **La afirmación del blueprint ("coste idéntico al de un `.lfx` manual") es ahora verdadera.** El cuello de botella de escalabilidad queda donde debe: en el presupuesto de bytes del `.lfx` (§7.2), no en la CPU.

**Veredicto §7 (integrado en §5 y en la categoría de escalabilidad del score).**

---

## 8. CHAOS ENGINEERING — EL FACTOR "TÉCNICO BORRACHO"

### 8.1 El rig cambió entre sesiones (re-patch, fixture retirado)

- `rigFingerprint` (hash de `nodeId`s) se sella al crear el documento. Al abrir, `computeRigDrift` compara contra el atlas vivo y reporta `missing` / `unassigned`. ✅
- Tres salidas: **remapear por proximidad** en XZ (usa `nodePositions` selladas; sin ellas, el nodo se declara `unmappable`, no se adivina), **descartar huérfanos**, **solo lectura**. ✅
- **El compilador se bloquea con drift pendiente** (`useAsteriaCompiler.ts:73`): el HUD recibe `RIG_DRIFT — N perdidos` en lugar de pistas horneadas sobre un campo mutilado. **Nunca un recompile silencioso.** ✅
- **Veredicto: ✅ IMPECABLE.** Es el escenario más frecuente en gira y está diseñado, no parcheado.

### 8.2 Documento v1 / JSON editado a mano

- `migrateV1toV2` en la frontera de `compile()`: todo lo interno opera sobre v2; campos legacy ausentes caen a defaults históricos; `colorFlood ?? 'allow'` cubre JSON corrupto. ✅
- **Veredicto: ✅ RESISTENTE.**

### 8.3 Campo vacío / máscara que no resuelve / gesto sobre nodos sin posición

- `EMPTY_FIELD`, `PARAM_NO_PLANE`, `PARAM_NO_NODES`, `NO_TRACKS` — reportados, no excepciones. `resolveMask` ignora `nodeId`s huérfanos; nodos sin `position` quedan fuera de gestos espaciales (`hasPosition[i]`). ✅
- **Veredicto: ✅ IMPECABLE.**

### 8.4 Velocidades / parámetros degenerados

- `speedMps = 0` → `Math.max(1e-6, speed)`: delay enorme pero finito; `modD` lo envuelve a [0,D) y el offset se clampa a entero. ✅
- `durationMs = 0` → `D = Math.max(1, clip.durationMs)` en el compilador; `rotateCurveCyclic` devuelve la curva intacta si `D ≤ 0` o no finito. ✅ (Simétrico con lo que el Área 2 §7.7 pidió para el preview.)
- **Veredicto: ✅ RESISTENTE.**

### 8.5 Texto que la matriz no puede resolver

- `measureGlyphLegibility` cuenta filas/columnas del bitmap 5×7 que caen sobre nodos reales; si no alcanza → `GLYPH_SUBOPTIMAL_RES` **como aviso, nunca como bloqueo** ("el operador tiene la última palabra"). ✅
- **Veredicto: ✅ CORRECTO** — honesto sin ser paternalista.

### 8.6 Matriz grande en rig grande

- Ver §7.3/§7.3b. **Post-fix:** una 32×32 en rig de 120 ocupa 2.2 % del frame — el caso "técnico borracho" extremo ya no degrada. El HUD ahora también proyecta coste de runtime (`CompileReport.runtimeCost` + `HIGH_RUNTIME_COST` — WAVE 8203, H3). ✅
- **Veredicto: ✅ RESISTENTE.** H1, H3 cerrados.

---

## 9. BENCHMARK VS. INDUSTRIA — grandMA3, RESOLUME, MADRIX

### 9.1 Tabla comparativa (mapeo espacial de efectos sobre fixtures/píxeles)

| Criterio | LuxSync · Asteria | grandMA3 (Bitmap + MAtricks) | Resolume Arena (Advanced Output / DMX) | MADRIX |
|---|---|---|---|---|
| **Paradigma** | Mapeo **inverso**: gestos analíticos evaluados en la posición de cada nodo | Media (imagen/vídeo/generador) mapeada a un *canvas* sobre el **Selection Grid** | Textura de vídeo muestreada por fixture/píxel | Motor de efectos generativos sobre mapa de píxeles |
| **Espacio** | Planta XZ en **metros reales**, 2D | Selection Grid (rejilla de índices) | Lienzo en píxeles de composición | Mapa 2D/3D de voxels |
| **Contenido pre-renderizado** | **No requerido** (gestos paramétricos) | No requerido (generadores) / opcional (vídeo) | Habitual (clips); generadores/FFGL opcionales | No requerido (generadores) |
| **Herramienta temporal manual** | **Chrono-Brush**: el tempo del arrastre *es* la coreografía | Phaser / MAtricks | Keyframes de capa | Efectos parametrizados |
| **Física espacial** | Wavefront en m/s, Huygens multi-emisor, falloff en metros | No (índices de grid) | No | Parcial |
| **Celdas de fixtures compuestos** | Exacto por `nodeId` (`track.cell`), incluidos nodos sintéticos del backend | Sub-fixtures | Por mapeo manual | Por patch |
| **Artefacto resultante** | `.lfx` V3 **estático, firmado SHA-256, re-editable**, secuenciable en Chronos | Show file | Composición | Show file |
| **Disparo contextual automático** | **Sí** — vía Selene si el clip lleva ADN (hoy manual en DnaRail) | No (doctrina manual) | BPM sync / triggers | Audio-reactivo por umbral |
| **Resolución práctica** | **~250-440 celdas animadas/clip** (§7) | Miles de píxeles (hardware dedicado) | Decenas de miles (GPU) | Decenas de miles |
| **Profundidad Y (3D)** | **No** | No en Bitmap | No nativo | Sí (voxels) |
| **Hardware** | Ninguno (software puro, CPU) | Consolas/nodos/procesadores | GPU del equipo | PC + interfaces |

### 9.2 Análisis honesto

- **"Destruye la necesidad de renderizar vídeo previo (After Effects/Resolume)".** Cierto para Asteria, **pero no es exclusivo**: grandMA3 (generadores de Bitmap), MADRIX y los generadores de Resolume tampoco requieren render previo. Vender esto como diferencial ante el CTO de AlphaTheta o Chauvet sería un error de credibilidad. **El diferencial real es otro**: (1) autoría en **metros físicos** sobre la topología real, con nodos que solo existen en el backend; (2) el **Chrono-Brush**, que no tiene equivalente en ninguna de las tres herramientas; (3) el resultado es un **artefacto de efecto estático, firmado y re-editable** dentro del mismo formato que consume un autómata de disparo — no una composición de vídeo ni un cue de consola.
- **vs grandMA3:** MA3 mapea media sobre una rejilla de *índices*; Asteria evalúa física sobre *coordenadas*. En un rig asimétrico, Asteria produce el frente de onda correcto y MA3 uno aproximado. MA3 gana sin discusión en resolución, madurez, hardware y control manual en vivo.
- **vs Resolume:** no compiten. Resolume es un servidor de medios GPU que de paso pixelmapea; Asteria es un compilador de efectos de iluminación de baja resolución. Para paredes LED, el ecosistema LuxSync tiene a **Theia** (GLSL), no a Asteria.
- **vs MADRIX:** el competidor directo en "pixel mapping generativo". MADRIX gana por resolución (dos órdenes de magnitud) y por 3D. Asteria gana en integración con fixtures móviles/compuestos, en física métrica y en que su salida es un efecto que un autómata puede elegir.

**Conclusión:** Asteria **no** "erradica" a ninguno de los incumbentes en pixel mapping de alta resolución y no debe venderse así. Ocupa un nicho que ninguno cubre: **coreografía espacial de rigs de fixtures (incluidas celdas de aparatos compuestos y matrices LED de baja resolución) autorada en metros, compilada a un efecto determinista y disparable por un autómata.** En ese nicho no he encontrado competidor.

---

## 10. HALLAZGOS & CARENCIAS

### ⛔ Críticos

1. ~~**H1 — Fan-out O(T×F) de las pistas celulares**~~ **✅ CERRADO (WAVE 8202).** `zones: ['all']` + filtrado tardío en el adapter. 32×16 en 40 fixtures = 75 % del frame solo en `tick()`. Corregido en `_resolveClipTracks` con la misma regla de corte del preview + espejo JS + 3 tests de regresión. Post-fix: 1 024 celdas en rig de 120 → 0.50 ms (2.2 % del frame, §7.3b).

### 🟠 Altos

2. ~~**H2 — Presupuesto de 256 KB no aplicado**~~ **✅ CERRADO (WAVE 8203).** Enforcement en `HephFileIO.saveClip` (único choke point de escritura): `LFX_PAYLOAD_BUDGET_EXCEEDED` antes de `writeFile`. La decisión de producto que queda — elevar el presupuesto o añadir salida *streaming* (`PixelMapAetherAdapter`) para matrices grandes — sigue abierta, pero ahora es una elección, no una deuda.
3. ~~**H3 — El HUD mide bytes, no coste de runtime**~~ **✅ CERRADO (WAVE 8203).** `CompileReport.runtimeCost` proyecta `estSamplesPerFrame` por pista (celular → 1 tras narrowing; zonal → rigDevices) + `fanOutBound` histórico + `HIGH_RUNTIME_COST` si est > 2 000.

### 🟡 Medios

4. **H4 — "2D/3D" no respaldado** (§3). Campo estrictamente XZ. Corregir el material comercial o planificar el eje Y como versión mayor.
5. **H5 — Asteria no sugiere ADN a Selene** (§6). La información para derivar A/C/O del stack existe; hoy los clips Asteria quedan `manual_only` salvo intervención manual.
6. ~~**H6 — Strings en el hot path**~~ **✅ CERRADO (WAVE 8203).** `blendKeyByFixture` (Map `fixtureId → clave completa`) materializado en `_buildResolvedTrack`; el tick hace `Map.get` — cero allocs por muestra. Cumple el contrato zero-alloc del Área 2 por volumen real, no solo por volumen típico.

### 🟢 Bajos

7. `svgPath` declarado sin consumidor; charset de glifos solo latino-mayúsculas (§2).
8. Nomenclatura "Perlin" para value-noise (§3).
9. Params de rueda (`gobo*`, `prism`) no emitibles — coherente, pero limita el alcance.

### ⛔ Limitaciones de plataforma (honestas)

1. **Sin GPU en el camino de Asteria.** El kernel corre en CPU sobre TypedArrays. Es la elección correcta para N ≤ 10³ nodos y patch-time; no lo es para pixel mapping de decenas de miles de píxeles — para eso existe Theia.
2. **Formato V3 sin pista multi-celda.** Cada celda animada cuesta una pista completa (~590 B). Una extensión del formato (`cells: string[]` + tabla de offsets por celda) eliminaría el techo de payload; es cambio de esquema, no de compilador.
3. Hereda las limitaciones de entorno del Área 2 (V8/GC, SAB hacia renderer bloqueado, `serialport` en Worker).

---

## 11. VEREDICTO, PIONEER SCORE Y RECOMENDACIÓN DE CIERRE

### Desglose

| Categoría | Peso | Puntuación | Ponderado |
|---|---|---|---|
| Modelo de datos / Gesture Stack / migración | 15 % | 94/100 | 14.1 |
| Kernel geométrico (`fieldEngine`, mapeo inverso) | 14 % | 92/100 | 12.9 |
| Compilador + Plan de Emisión (rotación exacta, cohortes, OKLab, validador) | 18 % | 93/100 | 16.7 |
| Integración Hephaestus (Δ1-Δ3, WYSIWYG, H1+H6 cerrados) | 15 % | 93/100 | 14.0 |
| Escalabilidad a matrices LED (payload + runtime medidos, H2+H3 cerrados) | 12 % | 81/100 | 9.7 |
| Integración Selene / ecosistema (ortogonalidad, pasaporte) | 8 % | 80/100 | 6.4 |
| Robustez / Chaos Resilience (Rig Drift, gates, degradados) | 10 % | 92/100 | 9.2 |
| Disciplina de ingeniería (1 010 tests, documentación de decisiones) | 8 % | 94/100 | 7.5 |

### PIONEER SCORE: **90.5 / 100 — EXCEPTIONAL (marginal)**

Historial del score: 85.9 (auditoría inicial, pre-fix) → 89.9 (H1 cerrado, WAVE 8202) → **90.5** (H2+H3+H6 cerrados, WAVE 8203). La recalificación es deliberadamente conservadora: H2 y H3 no expanden capacidad — expanden *honestidad operativa* (el presupuesto ahora se aplica, el operador ahora ve el coste). El techo de payload (~440 celdas animadas por clip) no se movió; solo dejó de ser silencioso. H6 restaura el contrato zero-alloc del Área 2 para volumen real, no solo típico.

**Categorías que anclan el score en 90.5 y no más arriba:** Escalabilidad (81) — el formato V3 no tiene pista multi-celda ni salida streaming; Integración Selene (80) — Asteria no informa ADN al autómata (H5 abierto); Campo estrictamente 2D (H4). El siguiente escalón (+5) requiere `PixelMapAetherAdapter` en producción, no más parches.

### Escala de referencia

| Rango | Calificación |
|---|---|
| 90–100 | **EXCEPTIONAL** — compite en su categoría con cualquier cosa del mercado |
| 80–89 | **ACQUISITION-WORTHY** — sólido con deficiencias corregibles |
| 70–79 | **PROMISING** — base sólida, requiere inversión |
| <70 | no apto para producción profesional |

### Veredicto final

**Asteria es un compilador espacial de grado profesional, no un juguete de visualización.** El kernel evalúa física en metros directamente sobre la topología real del rig —incluidos nodos que solo existen en el backend—, el compilador traduce un campo arbitrario a un formato que tiene *un solo handle per-fixture* mediante cuatro estrategias con árbol de decisión, rota curvas cíclicamente **sin remuestrear** usando el evaluador de producción, cuantiza gain por percentiles y color en OKLab, y rechaza en lugar de inyectar. La integración con Hephaestus es ortogonal de verdad (un campo, tres parches, compatibilidad bit-exacta con shows existentes) y con Selene lo es tanto que ni siquiera se conocen.

**¿Compila "en segundos"?** No: en **milisegundos** (3.3 ms para 256 celdas). **¿Mapea en 3D?** No: en 2D. **¿Dispara en tiempo real sobre matrices LED?** Sí — verificado post-fix: una 32×32 (1 024 celdas) consume **2.2 % del frame** en un rig de 120 fixtures; el techo práctico es el payload de ~256 KB por clip (~440 celdas animadas — ahora **aplicado de verdad** en escritura con `LFX_PAYLOAD_BUDGET_EXCEEDED`).

**¿Domina el mercado audiovisual unificado por sí sola?** No, y quien lo afirme ante el comprador perderá credibilidad en la primera demo con una pared LED. **¿Aporta algo que grandMA3, Resolume o MADRIX no tienen?** Sí: coreografía autorada a mano sobre la planta física (Chrono-Brush), física de frente de onda en metros, enrutamiento exacto a celdas de aparatos compuestos, y un artefacto de salida firmado y re-editable que un autómata contextual puede seleccionar. Es una **categoría**, no una versión mejor de una existente.

### Recomendación para AlphaTheta / Chauvet

**CERRAR — como componente del paquete de ecosistema, no como activo independiente**, con:

1. ~~**Condición precedente (pre-signing):**~~ **✅ CUMPLIDA.** H1 cerrado en código con test de regresión de complejidad y benchmark §7.3b re-ejecutado sobre el binario corregido (muestras/frame = pistas celulares, 100 % útiles).
2. **Condición post-cierre (90 días):** ~~H2 (enforcement)~~ **✅** + ~~H3 (estimador)~~ **✅** + H5 (sugerencia ACO desde el stack — único ítem pendiente de la lista original).
3. **Ajuste del material comercial:** retirar "3D" y "erradica la necesidad de render previo" como diferenciales; sustituir por "milisegundos", "metros reales", "Chrono-Brush" y "disparo autónomo".

Para un fabricante de hardware de control (AlphaTheta) el encaje estratégico es claro: Asteria convierte cualquier rig de fixtures + matrices de baja resolución en material coreografiable desde una superficie táctil sin consola dedicada, y su salida alimenta directamente el autómata que el comprador ya está evaluando en las Áreas 2 y 4. El precio de la IP debe reflejar ese encaje sistémico, no la resolución de pixel mapping, donde Asteria no compite.

---

*PunkOpus — Advanced Signal Processing Group*
*"El código no miente. Lo medimos contra el mejor a propósito. Las limitaciones cuentan igual que las capacidades."*

---

**DISCLAIMER:** Informe basado en revisión de código fuente, ejecución de la suite de tests (1 010 tests verdes en la suite ampliada), `tsc --noEmit` limpio en ambos tsconfig, y benchmarks sintéticos de compilación y runtime ejecutados por el auditor bajo `vitest` en hardware de desarrollo, pre y post-fix (WAVE 8202 + WAVE 8203). No incluye medición del `HephaestusAetherAdapter` ni del `NodeArbiter` bajo carga, ni pruebas con matrices LED físicas sobre Art-Net/sACN. Se recomienda una auditoría de campo con una matriz ≥ 16×16 real antes de cualquier compromiso comercial sobre resolución.
