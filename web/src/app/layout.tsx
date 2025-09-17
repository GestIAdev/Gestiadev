import type { Metadata } from "next";
import "./globals.css";
// import Starfield from "@/components/ui/Starfield"; // Desactivado temporalmente

export const metadata: Metadata = {
  title: "GestIAdev",
  description: "Forjamos el Futuro del Software.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-plex-sans antialiased">
        {/* <Starfield /> */} {/* Desactivado temporalmente - starfield procedural original */}
        {children}
      </body>
    </html>
  );
}
