import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hubungi Kami — Kontak & Lokasi Cabang Gramedia",
    description: "Temukan informasi kontak lengkap PT Gramedia Mitra Edukasi Indonesia. Alamat kantor pusat, nomor telepon, email, dan lokasi cabang di seluruh Indonesia.",
    openGraph: {
        title: "Hubungi Kami — Gramedia Mitra Edukasi Indonesia",
        description: "Alamat, telepon, email, dan lokasi cabang Gramedia Mitra Edukasi di seluruh Indonesia.",
        url: "/contact",
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
