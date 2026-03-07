import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E4198",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://gramedia-edukasi.co.id"),
  title: {
    default: "Gramedia Mitra Edukasi Indonesia — Solusi Pendidikan Terpercaya",
    template: "%s | Gramedia Mitra Edukasi Indonesia",
  },
  description:
    "PT Gramedia Mitra Edukasi Indonesia (GMEI) menyediakan solusi lengkap untuk kebutuhan pendidikan dan perkantoran, mulai dari buku teks pelajaran, alat peraga edukatif, hingga perpustakaan digital.",
  keywords: [
    "Gramedia", "Mitra Edukasi", "GMEI", "pendidikan", "buku pelajaran",
    "BTP", "BTU", "alat peraga edukatif", "perpustakaan digital", "e-Perpus",
    "sekolah", "kurikulum merdeka", "literasi", "Indonesia",
  ],
  authors: [{ name: "PT Gramedia Mitra Edukasi Indonesia" }],
  creator: "Gramedia Mitra Edukasi Indonesia",
  publisher: "PT Gramedia Mitra Edukasi Indonesia",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://gramedia-edukasi.co.id",
    siteName: "Gramedia Mitra Edukasi Indonesia",
    title: "Gramedia Mitra Edukasi Indonesia — Solusi Pendidikan Terpercaya",
    description:
      "Solusi lengkap untuk kebutuhan pendidikan: buku teks, alat peraga edukatif, perpustakaan digital, dan layanan edukasi lainnya.",
    images: [
      {
        url: "/images/LOGO/LOGO GMEI (1).png",
        width: 1200,
        height: 630,
        alt: "Gramedia Mitra Edukasi Indonesia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gramedia Mitra Edukasi Indonesia",
    description: "Solusi lengkap untuk kebutuhan pendidikan dan perkantoran di Indonesia.",
    images: ["/images/LOGO/LOGO GMEI (1).png"],
  },
  icons: {
    icon: "/images/LOGO/LOGO GMEI (1).png",
    shortcut: "/images/LOGO/LOGO GMEI (1).png",
    apple: "/images/LOGO/LOGO GMEI (1).png",
  },
  verification: {
    google: "tXrgEGJMzgGUgyqFZDMToX7bNeXsr-SHs8qkeHwDanY",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
