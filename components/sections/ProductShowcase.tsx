import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const ProductShowcase = () => {
    return (
        <section className="py-12 md:py-20 bg-white transition-colors duration-300 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight px-2">
                        Produk Unggulan Kami
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground font-semibold max-w-2xl mx-auto leading-relaxed px-4">
                        Rangkaian lengkap produk pendidikan berkualitas untuk mendukung proses pembelajaran.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
                    {/* Card 1: Buku Pendidikan */}
                    <div className="relative overflow-hidden rounded-[2.25rem] md:rounded-[3rem] bg-[#00AEEF] p-8 md:p-10 text-white group cursor-pointer transition-all duration-700 hover:shadow-[0_30px_60px_rgba(0,174,239,0.3)] flex flex-col min-h-[400px] md:min-h-[480px]">
                        <div className="relative z-10 flex flex-col h-full max-w-[320px]">
                            <div className="bg-white/15 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/25 space-y-3 shadow-2xl transition-all duration-500 group-hover:bg-white/20">
                                <h3 className="text-2xl md:text-4xl font-black tracking-tighter leading-none uppercase">Buku Pendidikan</h3>
                                <p className="text-white/90 text-[13px] md:text-base leading-relaxed font-bold">
                                    BTP, BTU, Non Teks, Buku Referensi, <br className="hidden md:block" /> Perpustakaan Digital
                                </p>
                            </div>
                            <div className="mt-auto pt-8">
                                <Link href="/products?category=books">
                                    <Button className="rounded-2xl bg-[#F58220] hover:bg-[#E07210] text-white border-none px-8 py-6 font-black text-lg shadow-2xl transition-all hover:scale-105 active:scale-95 h-auto uppercase tracking-widest">
                                        Lihat Koleksi
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Product Image Composite */}
                        <div className="absolute right-[-60px] md:right-[-40px] bottom-[-40px] md:bottom-[-20px] w-[500px] sm:w-[550px] md:w-[650px] h-[300px] sm:h-[350px] md:h-[400px] pointer-events-none transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:translate-x-6">
                            <Image
                                src="/images/ASET HOME/WhatsApp Image 2026-01-23 at 15.33.43 (1).jpeg"
                                alt="Buku Pendidikan"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Card 2: Produk Non Buku */}
                    <div className="relative overflow-hidden rounded-[2.25rem] md:rounded-[3rem] bg-[#5AC8FA] p-8 md:p-10 text-white group cursor-pointer transition-all duration-700 hover:shadow-[0_30px_60px_rgba(90,200,250,0.3)] flex flex-col min-h-[400px] md:min-h-[480px]">
                        <div className="relative z-10 flex flex-col h-full max-w-[320px]">
                            <div className="bg-white/15 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/25 space-y-3 shadow-2xl transition-all duration-500 group-hover:bg-white/20">
                                <h3 className="text-2xl md:text-4xl font-black tracking-tighter leading-none uppercase">Produk Non Buku</h3>
                                <p className="text-white/90 text-[13px] md:text-base leading-relaxed font-bold">
                                    APE, ATK, Multimedia, Meublier, dan lainnya
                                </p>
                            </div>
                            <div className="mt-auto pt-8">
                                <Link href="/products?category=non-books">
                                    <Button className="rounded-2xl bg-[#F58220] hover:bg-[#E07210] text-white border-none px-8 py-6 font-black text-lg shadow-2xl transition-all hover:scale-105 active:scale-95 h-auto uppercase tracking-widest">
                                        Lihat Koleksi
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Product Image Composite */}
                        <div className="absolute right-[-60px] md:right-[-40px] bottom-[-60px] md:bottom-[-40px] w-[550px] sm:w-[600px] md:w-[700px] h-[350px] sm:h-[400px] md:h-[450px] pointer-events-none transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:translate-x-6">
                            <Image
                                src="/images/ASET HOME/WhatsApp Image 2026-01-23 at 15.33.43.jpeg"
                                alt="Produk Non Buku"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-12 md:mt-16 text-center">
                    <Link href="/products">
                        <Button variant="outline" className="rounded-2xl border-2 border-[#1E4198] px-10 py-6 h-auto text-[#1E4198] font-black text-xl hover:bg-[#1E4198] hover:text-white transition-all shadow-2xl group active:scale-95 uppercase tracking-widest mb-10">
                            Jelajahi Semua Produk
                            <ChevronRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-3" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;
