"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Home, AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/60 max-w-2xl w-full border border-slate-100 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 opacity-50" />

                <div className="relative z-10 space-y-8">
                    <div className="inline-flex items-center justify-center p-4 bg-red-50 text-red-500 rounded-3xl mb-4">
                        <AlertCircle className="h-12 w-12" />
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Terjadi Kesalahan Sistem
                        </h1>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed">
                            Kami mengalami kendala teknis saat memproses permintaan Anda. Tim kami telah diberitahu mengenai masalah ini.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button
                            onClick={() => reset()}
                            size="lg"
                            className="rounded-full px-8 bg-slate-900 hover:bg-black transition-all duration-300"
                        >
                            <RefreshCcw className="mr-2 h-5 w-5" />
                            Coba Lagi
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-slate-200 hover:bg-white transition-all duration-300">
                            <Link href="/">
                                <Home className="mr-2 h-5 w-5" />
                                Beranda
                            </Link>
                        </Button>
                    </div>

                    {error.digest && (
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest pt-8">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>
            </div>

            <p className="mt-12 text-slate-400 font-medium text-sm">
                &copy; 2026 PT Gramedia Mitra Edukasi Indonesia. All rights reserved.
            </p>
        </div>
    );
}
