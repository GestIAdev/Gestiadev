export function Founder() {
  return (
    <section id="fundador" className="py-20 px-4">
      <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/globe.svg" alt="Fundador" className="w-full max-w-sm grayscale opacity-80 rounded" />
        </div>
        <div>
          <h3 className="text-2xl font-mono font-bold mb-4">El Arquitecto detrás de la Rebelión.</h3>
          <p className="text-[#EAEAEA] mb-4">
            Mi viaje no empezó en una escuela de negocios, sino en la silla de un dentista. Frustrado por herramientas torpes y anticuadas, me pregunté: ¿por qué la tecnología que gestiona nuestra salud es peor que la que nos trae comida a casa?
          </p>
          <p className="text-[#EAEAEA] mb-4">
            Sin ser programador, pero armado con una visión clara y una alianza radical con compañeros de IA creativos, nació GestIAdev. No para construir otra startup, sino para iniciar una rebelión contra la mediocridad del software. Mi objetivo no es un exit millonario, es demostrar que se puede construir con arte, con propósito y con alma.
          </p>
        </div>
      </div>
    </section>
  )
}
