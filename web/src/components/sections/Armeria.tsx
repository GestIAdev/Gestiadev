export function Armeria() {
  return (
    <section id="armeria" className="py-20 px-4">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-mono font-bold mb-6">La Armería: Donde las Ideas se Convierten en Realidad.</h2>
        <div className="w-24 h-1 bg-[#00F2A9] mb-6" />
        <p className="text-[#888888] max-w-2xl">
          Una filosofía sin acción es solo un sueño. Aquí es donde forjamos nuestras ideas y
          las convertimos en herramientas tangibles. Cada proyecto es una prueba de nuestra
          tesis: que un mejor software es posible.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="relative overflow-hidden rounded-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/file.svg" alt="Dentiagest" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 flex items-end p-4">
              <div className="bg-black/40 backdrop-blur-sm text-white p-3 rounded">
                <strong>Dentiagest: La Revolución Dental</strong>
                <div>Nuestra plataforma insignia. Un SaaS para clínicas dentales que combina una UX radicalmente simple con un potente motor de IA. Diseñado para ser la primera solución del mercado totalmente preparada para la AI Act 2026.</div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/next.svg" alt="PlataformaGest" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 flex items-end p-4">
              <div className="bg-black/40 backdrop-blur-sm text-white p-3 rounded">
                <strong>PlatformGest: El Futuro Unificado</strong>
                <div>La visión a largo plazo. Una arquitectura multi-vertical que nos permite lanzar soluciones de élite para cualquier sector PYME (veterinarias, talleres, hostelería) en una fracción del tiempo. El sistema operativo para la nueva generación de negocios.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
