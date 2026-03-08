import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const ProductShowcase = () => {
    return (
        <section className="py-4 bg-white transition-colors duration-300 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-4xl mx-auto mb-4 space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">Produk Unggulan Kami</h2>
                    <p className="text-base text-muted-foreground font-semibold max-w-3xl mx-auto leading-relaxed">
                        Rangkaian lengkap produk pendidikan berkualitas untuk mendukung proses pembelajaran yang efektif
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto">
                    {/* Card 1: Buku Pendidikan */}
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#00AEEF] p-6 text-white group cursor-pointer transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,174,239,0.3)] flex flex-col min-h-[340px]">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[2rem] border border-white/20 space-y-2 max-w-[280px] shadow-lg">
                                <h3 className="text-2xl font-black tracking-tighter leading-none">Buku Pendidikan</h3>
                                <p className="text-white/90 text-sm leading-relaxed font-bold">
                                    BTP, BTU, Non Teks, Buku Referensi, <br /> Perpustakaan Digital
                                </p>
                            </div>
                            <div className="mt-auto">
                                <Link href="/products?category=books">
                                    <Button className="rounded-xl bg-[#F58220] hover:bg-[#E07210] text-white border-none px-6 py-4 font-black text-lg shadow-lg transition-all hover:scale-105 active:scale-95 h-auto">
                                        Lihat Semua Buku
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Product Image Composite */}
                        <div className="absolute right-[-40px] bottom-[-20px] w-[650px] h-[400px] pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:translate-x-4">
                            <Image
                                src="/images/ASET HOME/WhatsApp Image 2026-01-23 at 15.33.43 (1).jpeg"
                                alt="Buku Pendidikan"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Card 2: Produk Non Buku */}
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#5AC8FA] p-6 text-white group cursor-pointer transition-all duration-500 hover:shadow-[0_20px_40px_rgba(90,200,250,0.3)] flex flex-col min-h-[340px]">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[2rem] border border-white/20 space-y-2 max-w-[280px] shadow-lg">
                                <h3 className="text-2xl font-black tracking-tighter leading-none">Produk Non Buku</h3>
                                <p className="text-white/90 text-sm leading-relaxed font-bold">
                                    APE, ATK, Multimedia, Meublier, dan lainnya
                                </p>
                            </div>
                            <div className="mt-auto">
                                <Link href="/products?category=non-books">
                                    <Button className="rounded-xl bg-[#F58220] hover:bg-[#E07210] text-white border-none px-6 py-4 font-black text-lg shadow-lg transition-all hover:scale-105 active:scale-95 h-auto">
                                        Lihat Semua Produk
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Product Image Composite */}
                        <div className="absolute right-[-40px] bottom-[-40px] w-[700px] h-[450px] pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:translate-x-4">
                            <Image
                                src="/images/ASET HOME/WhatsApp Image 2026-01-23 at 15.33.43.jpeg"
                                alt="Produk Non Buku"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/products">
                        <Button variant="outline" className="rounded-xl border-2 border-[#1E4198] px-8 py-5 h-auto text-[#1E4198] font-black text-lg hover:bg-[#1E4198] hover:text-white transition-all shadow-lg group active:scale-95">
                            Jelajahi Semua Produk
                            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;
