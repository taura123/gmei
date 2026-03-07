"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function SearchLoading() {
    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header Skeleton */}
            <div className="bg-white border-b py-12">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto space-y-4">
                        <div className="flex items-center gap-3 text-slate-200 font-bold uppercase tracking-wider text-sm animate-pulse">
                            <Search className="h-4 w-4" />
                            Hasil Pencarian
                        </div>
                        <div className="h-10 w-2/3 bg-slate-100 rounded-2xl animate-pulse" />
                        <div className="h-6 w-48 bg-slate-100 rounded-lg animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="max-w-6xl mx-auto space-y-16">
                    {/* Products Section Skeleton */}
                    <div className="space-y-8">
                        <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse border-l-4 border-slate-200 pl-4" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="rounded-[2rem] overflow-hidden border border-slate-100 bg-white h-full animate-pulse">
                                    <div className="aspect-[4/5] bg-slate-50" />
                                    <div className="p-6 space-y-3">
                                        <div className="h-5 w-full bg-slate-100 rounded-md" />
                                        <div className="h-4 w-2/3 bg-slate-50 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* News Section Skeleton */}
                    <div className="space-y-8">
                        <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse border-l-4 border-slate-200 pl-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[1, 2].map((i) => (
                                <div key={i} className="rounded-[2.5rem] overflow-hidden border border-slate-100 bg-white h-full flex flex-col md:flex-row animate-pulse">
                                    <div className="w-full md:w-48 aspect-video md:aspect-square bg-slate-50 flex-shrink-0" />
                                    <div className="p-6 flex flex-col justify-center gap-4 flex-1">
                                        <div className="w-24 h-5 bg-slate-100 rounded-full" />
                                        <div className="h-6 w-full bg-slate-100 rounded-md" />
                                        <div className="h-4 w-32 bg-slate-100 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
