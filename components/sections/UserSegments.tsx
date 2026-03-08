"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const segments = [
    {
        title: "Kepala Sekolah",
        description: "Kebutuhan barang dan perlengkapan sekolah lengkap.",
        icon: "/images/ASET HOME/JPG untuk Website/HOME_SUB MENU ICON-01.jpg",
        link: "/products",
        color: "bg-blue-50"
    },
    {
        title: "Guru",
        description: "Bahan ajar dan pelatihan pengembangan kompetensi.",
        icon: "/images/ASET HOME/JPG untuk Website/HOME_SUB MENU ICON-02.jpg",
        link: "/products",
        color: "bg-orange-50"
    },
    {
        title: "Siswa / Siswi",
        description: "Event, kompetisi, dan kegiatan edukatif menarik.",
        icon: "/images/ASET HOME/JPG untuk Website/HOME_SUB MENU ICON-03.jpg",
        link: "/products",
        color: "bg-green-50"
    },
    {
        title: "Mitra Penjualan",
        description: "Peluang bisnis dan kerjasama distribusi.",
        icon: "/images/ASET HOME/JPG untuk Website/HOME_SUB MENU ICON-04.jpg",
        link: "/contact",
        color: "bg-purple-50"
    },
    {
        title: "KLDI",
        description: "Kebutuhan barang dan perlengkapan institusi.",
        icon: "/images/ASET HOME/JPG untuk Website/HOME_SUB MENU ICON-05.jpg",
        link: "/products",
        color: "bg-slate-50"
    }
];

const UserSegments = () => {
    return (
        <section className="py-20 md:py-28 bg-white transition-colors duration-300 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50/50 rounded-full blur-[100px] -z-10 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-50/50 rounded-full blur-[100px] -z-10 translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24 space-y-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter px-2 uppercase italic"
                    >
                        Solusi untuk <span className="text-[#1E4198]">Setiap Kebutuhan</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed px-4"
                    >
                        Kami melayani berbagai segmen dalam ekosistem pendidikan dan dunia kerja dengan standar kualitas tinggi.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 max-w-7xl mx-auto">
                    {segments.map((segment, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group flex flex-col items-center text-center py-12 px-8 rounded-[3rem] border border-slate-100 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(30,65,152,0.12)] transition-all duration-700 hover:-translate-y-3 relative overflow-hidden"
                        >
                            {/* Card Hover Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-[#1E4198]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="mb-8 relative h-16 w-20 md:h-20 md:w-24 overflow-hidden transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
                                <Image src={segment.icon} alt={segment.title} fill className="object-contain" />
                            </div>
                            <h3 className="text-lg md:text-xl font-black text-slate-900 mb-4 leading-tight uppercase tracking-tight group-hover:text-[#1E4198] transition-colors">{segment.title}</h3>
                            <p className="text-[13px] md:text-[14px] text-slate-500 font-medium mb-8 leading-relaxed line-clamp-3 md:line-clamp-none">
                                {segment.description}
                            </p>
                            <Link href={segment.link} className="mt-auto relative z-10">
                                <span className="inline-flex items-center gap-2 text-[#F58220] font-black text-[11px] md:text-[12px] uppercase tracking-[0.2em] transition-all hover:gap-3 group/link">
                                    Lihat Produk
                                    <div className="h-0.5 w-6 bg-[#F58220] transition-all group-hover/link:w-10" />
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UserSegments;
