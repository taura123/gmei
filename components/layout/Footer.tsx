import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
    return (
        <footer className="bg-[#0b0b1a] text-slate-400 relative mt-20 border-t border-slate-800">
            {/* Decorative Top Border Line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#F27121] via-[#4481EB] to-[#1778F2]" />

            <div className="container mx-auto px-4 md:px-6 pt-12 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 mb-8">

                    {/* Column 1: Branding & Social */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/50 shadow-inner">
                                <Building2 className="w-8 h-8 text-white opacity-95" />
                            </div>
                            <div className="flex flex-col pt-0.5">
                                <span className="text-white font-black text-xl leading-none tracking-tight">PT Gramedia</span>
                                <span className="text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase mt-1.5">Mitra Edukasi Indonesia</span>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed max-w-[280px] font-medium text-slate-400">
                            Solusi terpercaya untuk kebutuhan pendidikan dan perkantoran di Indonesia.
                        </p>
                        <div className="flex gap-3 pt-2">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                                <Link key={i} href="#" className="h-9 w-9 rounded-full bg-slate-800/50 flex items-center justify-center hover:bg-[#00AEEF] transition-all hover:scale-110 border border-slate-700/50 group">
                                    <Icon className="h-4 w-4 text-white/50 group-hover:text-white" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="lg:pl-8">
                        <h3 className="text-white font-black mb-6 text-xs uppercase tracking-[0.25em]">Tautan Cepat</h3>
                        <ul className="space-y-3.5 text-sm font-medium">
                            <li><Link href="/about" className="hover:text-white transition-colors">Tentang Kami</Link></li>
                            <li><Link href="/products" className="hover:text-white transition-colors">Produk</Link></li>
                            <li><Link href="/events" className="hover:text-white transition-colors">Event & Berita</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Kontak</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Product Categories */}
                    <div className="lg:pl-4">
                        <h3 className="text-white font-black mb-6 text-xs uppercase tracking-[0.25em]">Produk Kami</h3>
                        <ul className="space-y-3.5 text-sm font-medium">
                            <li><Link href="/products?category=books" className="hover:text-white transition-colors">Buku Pendidikan</Link></li>
                            <li><Link href="/products?category=non-books" className="hover:text-white transition-colors">Produk Non Buku</Link></li>
                            <li><Link href="/products?subcategory=sd" className="hover:text-white transition-colors">Katalog SD</Link></li>
                            <li><Link href="/products?subcategory=smp" className="hover:text-white transition-colors">Katalog SMP</Link></li>
                            <li><Link href="/products?subcategory=sma" className="hover:text-white transition-colors">Katalog SMA/SMK</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-white font-black mb-6 text-xs uppercase tracking-[0.25em]">Hubungi Kami</h3>
                        <ul className="space-y-5 text-sm font-medium">
                            <li className="flex gap-4">
                                <div className="text-[#00AEEF] font-black text-xl mt-0.5 min-w-[24px]">@</div>
                                <span className="leading-relaxed">Jl. Palmerah Selatan No. 22-28, Gelora, Tanah Abang, Jakarta Pusat, DKI Jakarta 10270</span>
                            </li>
                            <li className="flex gap-4 items-center group">
                                <Phone className="h-5 w-5 text-[#00AEEF] transition-transform group-hover:rotate-12" />
                                <span className="group-hover:text-white transition-colors font-bold text-base">(021) 5481487</span>
                            </li>
                            <li className="flex gap-4 items-center group">
                                <Mail className="h-5 w-5 text-[#00AEEF] transition-transform group-hover:-rotate-12" />
                                <span className="group-hover:text-white transition-colors font-bold text-base">info@gramedia-men.co.id</span>
                            </li>
                        </ul>
                        <div className="pt-2">
                            <Link href="/contact" className="inline-flex items-center text-[#F58220] text-xs font-black group transition-all">
                                <span className="border-b-2 border-transparent group-hover:border-[#F58220] pb-0.5 uppercase tracking-[0.15em]">Lihat Kantor Cabang</span>
                                <span className="ml-3 text-lg transition-transform group-hover:translate-x-2">→</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="pt-6 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black tracking-[0.15em] uppercase text-slate-500">
                    <p>© {new Date().getFullYear()} PT Gramedia Mitra Edukasi Indonesia. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
