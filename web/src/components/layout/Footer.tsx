export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[#333333] mt-20">
      <div className="max-w-[1100px] mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="font-mono text-lg font-bold">GestIAdev</div>
          <div className="text-sm text-[#888888]">© {year}</div>
        </div>

        <div className="text-sm text-[#888888]">
          <ul>
            <li><a href="#" className="hover:text-[#00F2A9]">LinkedIn</a></li>
            <li><a href="#" className="hover:text-[#00F2A9]">GitHub</a></li>
          </ul>
        </div>

        <div className="text-sm text-[#888888]">
          <ul>
            <li><a href="#" className="hover:text-[#00F2A9]">Política de Privacidad</a></li>
            <li><a href="#" className="hover:text-[#00F2A9]">Términos</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
