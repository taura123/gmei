import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tentang Kami — Profil & Visi Misi Gramedia Mitra Edukasi",
    description: "Kenali lebih dekat PT Gramedia Mitra Edukasi Indonesia (GMEI). Pelajari sejarah, visi & misi, nilai inti perusahaan, dan tim profesional kami yang berdedikasi memajukan pendidikan Indonesia.",
    openGraph: {
        title: "Tentang Kami — Gramedia Mitra Edukasi Indonesia",
        description: "Profil lengkap, visi misi, nilai inti, dan tim profesional Gramedia Mitra Edukasi Indonesia.",
        url: "/about",
    },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
