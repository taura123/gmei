import HeroSlider from "@/components/sections/HeroSlider";
import dynamicImport from "next/dynamic";
import { Metadata } from "next";

const UserSegments = dynamicImport(() => import("@/components/sections/UserSegments"));
const ProductShowcase = dynamicImport(() => import("@/components/sections/ProductShowcase"));
const EventsNews = dynamicImport(() => import("@/components/sections/EventsNews"));

export const revalidate = 300; // ISR: revalidate every 5 minutes

export const metadata: Metadata = {
  title: "Beranda — Solusi Pendidikan & Perkantoran Terpercaya",
  description: "PT Gramedia Mitra Edukasi Indonesia menyediakan buku pelajaran, alat peraga edukatif, perpustakaan digital, dan berbagai solusi pendidikan berkualitas untuk sekolah di seluruh Indonesia.",
  openGraph: {
    title: "Gramedia Mitra Edukasi Indonesia — Beranda",
    description: "Solusi lengkap untuk kebutuhan pendidikan dan perkantoran di Indonesia.",
    url: "/",
  },
};

export default function Home() {
  return (
    <div className="overflow-hidden">
      <HeroSlider />
      <UserSegments />
      <ProductShowcase />
      <EventsNews />
    </div>
  );
}
