"use client";

import { motion } from "framer-motion";

export default function EventsLoading() {
    return (
        <div className="bg-slate-50 min-h-screen selection:bg-blue-100 pb-20">
            {/* HERO SECTION Skeleton */}
            <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-slate-900 animate-pulse">
                <div className="relative container mx-auto px-6 py-20 md:py-32 z-10">
                    <div className="max-w-3xl space-y-6">
                        <div className="h-7 w-40 bg-white/10 rounded-full" />
                        <div className="h-16 w-3/4 bg-white/10 rounded-2xl" />
                        <div className="h-16 w-1/2 bg-white/10 rounded-2xl" />
                        <div className="h-6 w-2/3 bg-white/5 rounded-lg" />
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 max-w-6xl py-16 space-y-24">
                {/* AGENDA KEGIATAN Skeleton */}
                <section className="space-y-8">
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-10 w-64 bg-slate-200 rounded-xl animate-pulse" />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="overflow-hidden rounded-[2.5rem] bg-white shadow-xl flex flex-col h-full animate-pulse">
                                <div className="aspect-[16/10] bg-slate-100 relative">
                                    <div className="absolute top-4 left-4 h-16 w-14 bg-white rounded-2xl" />
                                </div>
                                <div className="p-6 space-y-4 flex-1">
                                    <div className="h-6 w-full bg-slate-100 rounded-lg" />
                                    <div className="h-6 w-2/3 bg-slate-100 rounded-lg" />
                                    <div className="h-4 w-32 bg-slate-50 rounded-md" />
                                    <div className="pt-4 mt-auto">
                                        <div className="h-12 w-full bg-slate-50 rounded-xl" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* BERITA TERKINI Skeleton */}
                <section className="space-y-8">
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-10 w-64 bg-slate-200 rounded-xl animate-pulse" />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="overflow-hidden rounded-[2.5rem] bg-white shadow-xl flex flex-col h-full animate-pulse">
                                <div className="aspect-video bg-slate-100 relative">
                                    <div className="absolute top-4 left-4 h-6 w-32 bg-slate-100 rounded-full" />
                                </div>
                                <div className="p-6 space-y-3 flex flex-1">
                                    <div className="w-full space-y-3">
                                        <div className="h-4 w-32 bg-slate-50 rounded-md" />
                                        <div className="h-6 w-full bg-slate-100 rounded-lg" />
                                        <div className="h-6 w-4/5 bg-slate-100 rounded-lg" />
                                        <div className="h-4 w-full bg-slate-50 rounded-md" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
