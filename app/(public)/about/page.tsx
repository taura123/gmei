'use client';

import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    Target,
    Rocket,
    Award,
    ShieldCheck,
    Zap,
    HeartHandshake
} from "lucide-react";

const NilaiUtama = [
    {
        title: "Integritas",
        desc: "Kami menjunjung tinggi kejujuran dan etika dalam setiap langkah kerjasama dengan mitra.",
        icon: <ShieldCheck className="w-10 h-10 text-blue-500" />,
        color: "bg-blue-50/50 border-blue-100"
    },
    {
        title: "Inovasi",
        desc: "Terus menghadirkan solusi kreatif dan teknologi terbaru untuk mendukung dunia pendidikan.",
        icon: <Zap className="w-10 h-10 text-amber-500" />,
        color: "bg-amber-50/50 border-amber-100"
    },
    {
        title: "Kolaborasi",
        desc: "Membangun kemitraan yang kuat dan harmonis untuk mencapai tujuan bersama.",
        icon: <HeartHandshake className="w-10 h-10 text-emerald-500" />,
        color: "bg-emerald-50/50 border-emerald-100"
    },
    {
        title: "Kualitas Utama",
        desc: "Memastikan setiap produk dan layanan memenuhi standar kualitas tertinggi Gramedia.",
        icon: <Award className="w-10 h-10 text-purple-500" />,
        color: "bg-purple-50/50 border-purple-100"
    }
];

const TimelineData = [
    { year: "2016", title: "Awal Perjalanan", desc: "Gramedia Mitra Edukasi Indonesia resmi berdiri dengan fokus pada distribusi buku pilihan." },
    { year: "2018", title: "Ekspansi Nasional", desc: "Membuka jaringan di lebih dari 15 provinsi and bermitra dengan ribuan institusi pendidikan." },
    { year: "2020", title: "Transformasi Digital", desc: "Mulai mengintegrasikan solusi teknologi digital ke dalam layanan pengadaan sekolah." },
    { year: "2023", title: "Standardisasi Layanan", desc: "Memperoleh pengakuan sebagai mitra strategis utama untuk pengadaan BUMN dan instansi pemerintah." },
    { year: "2025", title: "Masa Depan", desc: "Berkomitmen menjadi ekosistem pendidikan terlengkap di seluruh pelosok nusantara." }
];

export default function AboutPage() {
    const [isVisiFlipped, setIsVisiFlipped] = useState(false);
    const [isMisiFlipped, setIsMisiFlipped] = useState(false);

    return (
        <div className="bg-white text-slate-900 selection:bg-blue-100 overflow-x-hidden min-h-screen">
            {/* HERO SECTION */}
            <section className="relative min-h-[50vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/Tentang Kami/WhatsApp Image 2026-01-08 at 15.00.51.jpeg"
                        alt="Gramedia Mitra Edukasi Indonesia"
                        fill
                        priority
                        className="object-cover scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-800/40" />
                </div>

                <div className="relative container mx-auto px-6 py-20 md:py-32 z-10">
                    <div className="max-w-3xl space-y-6">
                        <span className="inline-block px-4 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-400 text-sm font-bold tracking-[0.2em] uppercase backdrop-blur-md">
                            Tentang GMEI
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                            Membangun Masa Depan <br />
                            <span className="text-blue-400">Pendidikan Indonesia</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed">
                            Mitra strategis yang berdedikasi melayani kebutuhan pendidikan dan perkantoran melalui solusi inovatif dan terpercaya.
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
            </section>

            {/* PROFIL PERUSAHAAN */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-10">
                            <h2 className="text-3xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Profil Perusahaan
                            </h2>

                            <div className="space-y-8 text-slate-600 text-lg md:text-[1.125rem] leading-relaxed">
                                <p>
                                    Sejak berdiri pada tahun 2016, Gramedia Mitra Edukasi Indonesia telah berdedikasi membantu berbagai institusi di seluruh Indonesia meningkatkan kualitas proses belajar, layanan pendidikan, dan operasional kerja. Selama bertahun-tahun, kami telah melayani ribuan sekolah, instansi pemerintahan, lembaga swasta, hingga BUMN, dengan solusi produk dan layanan yang terstandar dan terpercaya.
                                </p>
                                <p>
                                    Dengan dukungan jaringan kuat Gramedia, pemanfaatan teknologi digital, serta tim ahli di bidangnya, kami memastikan setiap kebutuhan baik pendidikan maupun perkantoran dipenuhi dengan tepat, cepat, dan berkualitas. Kami hadir sebagai mitra strategis yang selalu siap tumbuh bersama Anda.
                                </p>
                            </div>
                        </div>

                        <div className="relative flex justify-center lg:justify-end">
                            {/* Frame Logo */}
                            <div className="relative w-full max-w-[550px] aspect-[16/10] rounded-[1.5rem] border-[3px] border-slate-100 p-2 shadow-sm bg-white">
                                <div className="relative w-full h-full rounded-[1rem] overflow-hidden bg-slate-900 flex items-center justify-center p-8">
                                    <Image
                                        src="/images/LOGO/LOGO GMEI (1).png"
                                        alt="Logo Gramedia"
                                        fill
                                        className="object-contain p-6 md:p-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NILAI UTAMA */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6 text-center mb-16">
                    <div className="max-w-2xl mx-auto space-y-4">
                        <h2 className="text-sm font-black text-blue-600 tracking-[0.3em] uppercase">Core Values</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 uppercase tracking-tight">Apa Yang Kami Yakini</h3>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                        {NilaiUtama.map((nilai, i) => (
                            <div
                                key={i}
                                className={`p-8 rounded-[2.5rem] border ${nilai.color} hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group text-left`}
                            >
                                <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                    {nilai.icon}
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-3">{nilai.title}</h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">{nilai.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* VISI & MISI - Tetap menggunakan animasi flip karena interaktif */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute -top-24 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* VISI CARD */}
                        <div className="perspective-1000 group h-80">
                            <motion.div
                                animate={{ rotateY: isVisiFlipped ? 180 : 0 }}
                                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                                onClick={() => setIsVisiFlipped(!isVisiFlipped)}
                                className="relative w-full h-full cursor-pointer preserve-3d"
                            >
                                <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-10 bg-slate-900 rounded-[3rem] text-white shadow-xl shadow-blue-900/20">
                                    <Target className="w-16 h-16 text-blue-400 mb-6" />
                                    <h4 className="text-2xl font-black tracking-widest uppercase">VISI</h4>
                                    <div className="mt-4 w-12 h-1 bg-blue-400 rounded-full" />
                                    <p className="mt-6 text-sm text-slate-400 font-medium">Klik untuk mendalami</p>
                                </div>
                                <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-12 bg-white border-2 border-slate-900 rounded-[3rem] text-slate-900 shadow-2xl">
                                    <p className="text-lg md:text-xl font-bold text-center italic leading-relaxed">
                                        &quot;Menjadi perusahaan terbesar dan terbaik di Indonesia dalam pelayanan menyeluruh atas kebutuhan produk-produk edukasi dan pelayanan lainnya yang terkait.&quot;
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* MISI CARD */}
                        <div className="perspective-1000 group h-80">
                            <motion.div
                                animate={{ rotateY: isMisiFlipped ? 180 : 0 }}
                                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                                onClick={() => setIsMisiFlipped(!isMisiFlipped)}
                                className="relative w-full h-full cursor-pointer preserve-3d"
                            >
                                <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-10 bg-blue-600 rounded-[3rem] text-white shadow-xl shadow-blue-600/20">
                                    <Rocket className="w-16 h-16 text-white mb-6" />
                                    <h4 className="text-2xl font-black tracking-widest uppercase">MISI</h4>
                                    <div className="mt-4 w-12 h-1 bg-white rounded-full" />
                                    <p className="mt-6 text-sm text-blue-100 font-medium">Klik untuk mendalami</p>
                                </div>
                                <div className="absolute inset-0 backface-hidden rotate-y-180 p-10 flex flex-col justify-center bg-white border-2 border-blue-600 rounded-[3rem] text-slate-900 shadow-2xl">
                                    <ul className="space-y-4">
                                        {[
                                            "Menyediakan produk berkualitas tinggi.",
                                            "Memastikan pengadaan berkelanjutan.",
                                            "Membangun kemitraan jangka panjang."
                                        ].map((misi, i) => (
                                            <li key={i} className="flex gap-4 items-center">
                                                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                                <span className="font-semibold text-sm md:text-base">{misi}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TIMELINE */}
            <section className="py-24 bg-slate-950 text-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-sm font-black text-blue-500 tracking-[0.3em] uppercase mb-4">Sejarah Kami</h2>
                        <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">Jejak Langkah GMEI</h3>
                    </div>

                    <div className="relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 hidden lg:block -translate-y-1/2" />

                        <div className="grid lg:grid-cols-5 gap-8">
                            {TimelineData.map((item, i) => (
                                <div
                                    key={i}
                                    className="relative z-10 flex flex-col items-center lg:items-start space-y-4"
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-600 border-4 border-slate-950 flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                                        {i + 1}
                                    </div>
                                    <div className="text-center lg:text-left pt-2">
                                        <p className="text-blue-400 font-bold font-mono text-xl">{item.year}</p>
                                        <h4 className="font-bold text-lg mt-1">{item.title}</h4>
                                        <p className="text-slate-500 text-sm mt-2 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* JANGKAUAN */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto rounded-[3.5rem] bg-slate-50 border border-slate-100 p-8 md:p-16">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-sm font-black text-blue-600 tracking-[0.3em] uppercase">Jangkauan Kami</h2>
                                    <h3 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                                        Melayani Dari Sabang <br /> Sampai Merauke
                                    </h3>
                                </div>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Kami memahami bahwa akses terhadap produk pendidikan yang berkualitas adalah hak seluruh anak bangsa. Melalui jaringan distribusi kami, kami siap hadir di mana pun Anda berada.
                                </p>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                        <p className="text-4xl font-black text-foreground">1.000+</p>
                                        <p className="text-blue-600 font-bold uppercase text-[10px] tracking-widest">Institusi Mitra</p>
                                    </div>
                                    <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                        <p className="text-4xl font-black text-foreground">30+</p>
                                        <p className="text-blue-600 font-bold uppercase text-[10px] tracking-widest">Provinsi</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative aspect-[16/10] bg-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl group">
                                <Image
                                    src="/images/Tentang Kami/WhatsApp Image 2026-01-06 at 11.46.49.jpeg"
                                    alt="Peta Jangkauan"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CSS for 3D flip card effect */}
            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                    height: 100%;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div>
    );
}
