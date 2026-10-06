import type { Metadata } from "next";
import "./globals.css";
import StarfieldSwitcher from "@/components/ui/StarfieldSwitcher";

export const metadata: Metadata = {
  title: "LuxSync — Photonic Control Ecosystem",
  description:
    "LuxSync is a premium, enterprise-grade photonic control ecosystem. Fluid physics, Radix-2 synchronization and the first cognitive DMX engine. Zero external dependencies.",
  keywords: [
    "DMX lighting control",
    "photonic control",
    "LuxSync",
    "Selene Lux IA",
    "real-time DMX",
    "lighting automation",
    "Zero-Dependency",
    "Electron",
    "TypeScript",
  ],
  authors: [{ name: "LuxSync Engineering" }],
  creator: "LuxSync",
  publisher: "LuxSync",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://gestiadev.pages.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LuxSync — Photonic Control Ecosystem",
    description:
      "Premium photonic control ecosystem. Fluid physics, Radix-2 synchronization and the first cognitive DMX engine. Zero external dependencies.",
    url: "https://gestiadev.pages.dev",
    siteName: "LuxSync",
    images: [
      {
        url: "/luxsync/interpreted_vector_logo.png",
        width: 1200,
        height: 630,
        alt: "LuxSync — Photonic Control Ecosystem",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LuxSync — Photonic Control Ecosystem",
    description:
      "Premium photonic control ecosystem. Fluid physics, Radix-2 synchronization and the first cognitive DMX engine.",
    images: ["/luxsync/interpreted_vector_logo.png"],
    creator: "@luxsync",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-plex-sans antialiased">
        {/* Global cyberpunk background — persists across all routes */}
        <StarfieldSwitcher />
        {children}
      </body>
    </html>
  );
}
