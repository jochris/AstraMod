import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AstraMod - GitHub Dark Horizon MOD Direct Catalog",
  description: "Download ribuan MOD APK game dan aplikasi premium gratis dengan server unduhan cepat dan aman.",
  metadataBase: new URL('https://mod.astralune.cfd'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "AstraMod - Game & Aplikasi MOD Terlengkap",
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
      <body className="min-h-screen bg-[#0D1117] text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
