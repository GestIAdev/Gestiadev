"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoWordmark from '@/components/ui/LogoWordmark';

const Header = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", text: "Overview" },
    { href: "/media", text: "Media" },
    { href: "/whitepapers", text: "Architecture" },
    { href: "/community", text: "Developer Hub" },
    { href: "/contact", text: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="w-full border-b border-gris-trazado z-50 sticky top-0 bg-noche/90 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto py-3 px-6">

        {/* MÓVIL */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="flex justify-between items-center">
            <Link href="/">
              <LogoWordmark className="text-base" />
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-plex-mono text-menta"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-menta opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-menta"></span>
              </span>
              LuxSync Beta
            </Link>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 font-plex-sans text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`bg-transparent border-none p-1 hover:text-menta transition-colors ${
                  isActive(link.href) ? 'text-menta' : 'text-hueso'
                }`}
              >
                {link.text}
              </Link>
            ))}
          </nav>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex justify-between items-center gap-8">

          {/* IZQUIERDA: Logo */}
          <Link href="/" className="flex-shrink-0">
            <LogoWordmark className="text-lg" />
          </Link>

          {/* CENTRO: Nav */}
          <nav className="flex gap-8 font-plex-sans text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative bg-transparent border-none p-0 transition-colors hover:text-menta group ${
                  isActive(link.href) ? 'text-menta' : 'text-hueso'
                }`}
              >
                {link.text}
                <span
                  className={`absolute -bottom-3.5 left-0 right-0 h-px bg-menta transition-transform duration-300 origin-left ${
                    isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* DERECHA: Beta Status */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="h-4 w-px bg-gris-trazado" />
            <Link href="/" className="flex flex-col items-end gap-0.5 group">
              <span className="text-sm font-plex-mono text-hueso group-hover:text-menta transition-colors">
                LuxSync
              </span>
              <span className="flex items-center gap-1 text-xs font-plex-sans text-menta">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-menta opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-menta"></span>
                </span>
                Beta Active
              </span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
