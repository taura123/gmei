"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const ProductShowcase = () => {
    return (
        <section className="py-20 md:py-32 bg-slate-50 transition-colors duration-300 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(30,65,152,0.03)_0%,transparent_70%)] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24 space-y-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter px-2 uppercase italic"
                    >
                        Produk <span className="text-[#1E4198]">Unggulan Kami</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed px-4"
                    >
                        Rangkaian lengkap produk pendidikan berkualitas tinggi untuk mendukung ekosistem pembelajaran masa depan.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-7xl mx-auto">
                    {/* Card 1: Buku Pendidikan */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#00AEEF] to-[#0089CB] p-10 md:p-14 text-white group cursor-pointer transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,174,239,0.4)] flex flex-col min-h-[500px] md:min-h-[550px]"
                    >
                        <div className="relative z-20 flex flex-col h-full max-w-[340px] space-y-8">
                            <div className="bg-white/20 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] border border-white/30 space-y-4 shadow-2xl transition-all duration-500 group-hover:bg-white/25 group-hover:scale-[1.02]">
                                <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase italic">Buku<br />Pendidikan</h3>
                                <p className="text-white/90 text-sm md:text-lg leading-relaxed font-bold">
                                    BTP, BTU, Non Teks, Buku Referensi, & Perpustakaan Digital Tercanggih.
                                </p>
                            </div>
                            <div className="mt-auto">
                                <Link href="/products?category=books">
                                    <Button className="rounded-2xl bg-[#F58220] hover:bg-[#E07210] text-white border-none px-10 py-8 font-black text-lg shadow-2xl transition-all hover:scale-105 active:scale-95 h-auto uppercase tracking-[0.1em]">
                                        Lihat Koleksi
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Product Image Composite - Refined for Mobile visibility */}
                        <div className="absolute right-[-80px] md:right-[-40px] bottom-[-40px] md:bottom-[-20px] w-[550px] sm:w-[600px] md:w-[750px] h-[350px] sm:h-[400px] md:h-[500px] pointer-events-none transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:translate-x-8">
                            <Image
                                src="/images/ASET HOME/WhatsApp Image 2026-01-23 at 15.33.43 (1).jpeg"
                                alt="Buku Pendidikan"
                                fill
                                className="object-contain"
                            />
                        </div>
                        {/* Soft Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    </motion.div>

                    {/* Card 2: Produk Non Buku */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#5AC8FA] to-[#34AADC] p-10 md:p-14 text-white group cursor-pointer transition-all duration-700 hover:shadow-[0_40px_80px_rgba(90,200,250,0.4)] flex flex-col min-h-[500px] md:min-h-[550px]"
                    >
                        <div className="relative z-20 flex flex-col h-full max-w-[340px] space-y-8">
                            <div className="bg-white/20 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] border border-white/30 space-y-4 shadow-2xl transition-all duration-500 group-hover:bg-white/25 group-hover:scale-[1.02]">
                                <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase italic">Produk<br />Non Buku</h3>
                                <p className="text-white/90 text-sm md:text-lg leading-relaxed font-bold">
                                    APE, ATK, Multimedia, Meublier, & Peralatan Laboratorium Lengkap.
                                </p>
                            </div>
                            <div className="mt-auto">
                                <Link href="/products?category=non-books">
                                    <Button className="rounded-2xl bg-[#F58220] hover:bg-[#E07210] text-white border-none px-10 py-8 font-black text-lg shadow-2xl transition-all hover:scale-105 active:scale-95 h-auto uppercase tracking-[0.1em]">
                                        Lihat Koleksi
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Product Image Composite */}
                        <div className="absolute right-[-80px] md:right-[-40px] bottom-[-60px] md:bottom-[-40px] w-[600px] sm:w-[650px] md:w-[800px] h-[400px] sm:h-[450px] md:h-[550px] pointer-events-none transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:translate-x-8">
                            <Image
                                src="/images/ASET HOME/WhatsApp Image 2026-01-23 at 15.33.43.jpeg"
                                alt="Produk Non Buku"
                                fill
                                className="object-contain"
                            />
                        </div>
                        {/* Soft Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 md:mt-28 text-center"
                >
                    <Link href="/products">
                        <Button variant="outline" className="rounded-[2rem] border-2 border-[#1E4198] px-14 py-8 h-auto text-[#1E4198] font-black text-xl hover:bg-[#1E4198] hover:text-white transition-all shadow-2xl group active:scale-95 uppercase tracking-widest relative overflow-hidden">
                            <span className="relative z-10 flex items-center">
                                Jelajahi Katalog Lengkap
                                <ChevronRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-4" />
                            </span>
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default ProductShowcase;
