import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-12">
                <h1 className="text-[12rem] md:text-[18rem] font-black text-slate-50 opacity-10 leading-none select-none">
                    404
                </h1>
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Halaman Tidak Ditemukan
                    </h2>
                    <p className="text-slate-500 max-w-md mx-auto text-lg font-medium">
                        Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan ke lokasi lain.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button asChild size="lg" className="rounded-full px-8 bg-[#1E4198] hover:bg-[#153480] transition-all duration-300">
                    <Link href="/">
                        <Home className="mr-2 h-5 w-5" />
                        Kembali ke Beranda
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-slate-200 hover:bg-slate-50 transition-all duration-300">
                    <Link href="/products">
                        <Search className="mr-2 h-5 w-5" />
                        Cari Produk
                    </Link>
                </Button>
            </div>

            {/* Subtle background decoration */}
            <div className="fixed bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-slate-50/50 to-transparent -z-10" />
            <div className="fixed -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />
            <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10" />
        </div>
    );
}
