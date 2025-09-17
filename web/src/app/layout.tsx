import type { Metadata } from "next";
import "./globals.css";
// import Starfield from "@/components/ui/Starfield"; // Desactivado temporalmente

export const metadata: Metadata = {
  title: "GestIAdev - Forjamos el Futuro del Software",
  description: "Empresa especializada en desarrollo de software, consultoría tecnológica y transformación digital. Soluciones innovadoras para el futuro del software.",
  keywords: ["desarrollo software", "consultoría tecnológica", "transformación digital", "Next.js", "React", "TypeScript", "cyberpunk", "tecnología"],
  authors: [{ name: "GestIAdev Team" }],
  creator: "GestIAdev",
  publisher: "GestIAdev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://gestiadev.gestiadev.workers.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GestIAdev - Forjamos el Futuro del Software",
    description: "Empresa especializada en desarrollo de software, consultoría tecnológica y transformación digital. Soluciones innovadoras para el futuro del software.",
    url: "https://gestiadev.gestiadev.workers.dev",
    siteName: "GestIAdev",
    images: [
      {
        url: "/robot-punk-logo.svg",
        width: 1200,
        height: 630,
        alt: "GestIAdev - Cabeza del Robot Punk Logo",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GestIAdev - Forjamos el Futuro del Software",
    description: "Empresa especializada en desarrollo de software, consultoría tecnológica y transformación digital.",
    images: ["/robot-punk-logo.svg"],
    creator: "@gestiadev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "tu-codigo-de-verificacion-google",
  },
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
