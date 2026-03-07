"use client";

import { motion } from "framer-motion";

export default function ProductsLoading() {
    return (
        <div className="bg-slate-50 min-h-screen py-20 pb-32">
            <div className="container mx-auto px-4">
                {/* Header Skeleton */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <div className="h-12 w-64 bg-slate-200 rounded-2xl mx-auto animate-pulse" />
                    <div className="h-6 w-full max-w-lg bg-slate-200 rounded-lg mx-auto animate-pulse" />
                </div>

                {/* Filters Skeleton */}
                <div className="flex flex-col gap-6 mb-16">
                    <div className="max-w-2xl mx-auto w-full h-16 bg-white rounded-[2rem] border border-slate-100 shadow-sm animate-pulse" />
                    <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-11 w-32 bg-white border border-slate-200 rounded-full animate-pulse" />
                        ))}
                    </div>
                </div>

                {/* Product Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="rounded-[2rem] border-slate-100 shadow-sm bg-white overflow-hidden h-full"
                        >
                            {/* Image Skeleton */}
                            <div className="aspect-square bg-slate-50 relative flex items-center justify-center p-6 border-b border-slate-50">
                                <div className="w-3/4 h-3/4 bg-slate-100 rounded-2xl animate-pulse" />
                                <div className="absolute top-4 left-4 h-6 w-20 bg-white shadow-sm rounded-full animate-pulse" />
                            </div>

                            {/* Content Skeleton */}
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <div className="h-6 w-full bg-slate-100 rounded-lg animate-pulse" />
                                    <div className="h-6 w-2/3 bg-slate-100 rounded-lg animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-slate-50 rounded-md animate-pulse" />
                                    <div className="h-4 w-5/6 bg-slate-50 rounded-md animate-pulse" />
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <div className="h-9 w-24 bg-slate-100 rounded-lg animate-pulse" />
                                    <div className="h-9 w-24 bg-slate-100 rounded-lg animate-pulse" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
