import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AstraMod - Download Game & Aplikasi MOD Terlengkap 100% Gratis",
  description: "Download ribuan MOD APK game dan aplikasi premium gratis dengan server unduhan cepat dan aman.",
  metadataBase: new URL('https://mod.astralune.cfd'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "AstraMod - Download Game & Aplikasi MOD Terlengkap",
    description: "Download ribuan MOD APK game dan aplikasi premium gratis dengan server unduhan cepat.",
    url: 'https://mod.astralune.cfd',
    siteName: 'AstraMod',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AstraMod - Game & Aplikasi MOD Terlengkap',
    description: 'Download ribuan MOD APK game dan aplikasi premium gratis.',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
