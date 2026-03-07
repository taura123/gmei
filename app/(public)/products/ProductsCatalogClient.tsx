"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, BookOpen, Monitor, PackageOpen, GraduationCap, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

// Matches Prisma Product type
interface Product {
    id: string;
    title: string;
    description: string;
    price: any;
    image: string;
    category: string;
    subcategory: string | null;
    link: string | null;
}

export default function ProductsCatalogClient({ initialProducts }: { initialProducts: Product[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("Semua Katalog");

    const FILTERS = [
        { label: "Semua Katalog", icon: PackageOpen },
        { label: "Buku Pendidikan", icon: BookOpen },
        { label: "Produk Non Buku", icon: Monitor },
        { label: "Katalog SD", icon: GraduationCap },
        { label: "Katalog SMP", icon: GraduationCap },
        { label: "Katalog SMA/SMK", icon: GraduationCap }
    ];

    const filteredProducts = initialProducts.filter(p => {
        // Search Match
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter Match logic as user requested mappings
        let matchesFilter = true;
        if (activeFilter === "Buku Pendidikan") matchesFilter = p.category === "Educational Books";
        if (activeFilter === "Produk Non Buku") matchesFilter = p.category === "Non-Book Products";
        // Specific SD/SMP/SMA Subcategories
        if (activeFilter === "Katalog SD") matchesFilter = p.subcategory === "Katalog SD";
        if (activeFilter === "Katalog SMP") matchesFilter = p.subcategory === "Katalog SMP";
        if (activeFilter === "Katalog SMA/SMK") matchesFilter = p.subcategory === "Katalog SMA/SMK";

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="container mx-auto px-4">
            {/* SEARCH AND FILTERS */}
            <div className="flex flex-col gap-6 mb-16">
                <div className="max-w-2xl mx-auto w-full relative flex items-center shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] rounded-[2rem] bg-white p-2 border border-slate-100 group focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
                    <div className="absolute left-6 h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-focus-within:bg-blue-50 transition-colors">
                        <Search className={`h-5 w-5 transition-colors ${searchQuery ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                    <Input
                        placeholder="Cari buku, alat peraga, seragam..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-20 h-16 border-transparent text-lg shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent flex-1 font-medium placeholder:text-slate-300"
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSearchQuery("")}
                            className="mr-2 h-10 w-10 rounded-full hover:bg-slate-100 text-slate-400"
                        >
                            <Search className="h-4 w-4 rotate-45" /> {/* Simulating an X */}
                        </Button>
                    )}
                </div>

                <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                    {FILTERS.map(filter => (
                        <Button
                            key={filter.label}
                            variant={activeFilter === filter.label ? "default" : "outline"}
                            onClick={() => setActiveFilter(filter.label)}
                            className={`rounded-full h-11 px-6 font-bold transition-all ${activeFilter === filter.label
                                ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                                }`}
                        >
                            <filter.icon className={`mr-2 h-4 w-4 ${activeFilter === filter.label ? "text-white" : "text-slate-400"}`} />
                            {filter.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* PRODUCT GRID */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
            >
                <AnimatePresence mode="popLayout">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <motion.div
                                layout
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card className="rounded-[2rem] border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-2xl transition-all h-full overflow-hidden group hover:-translate-y-1 bg-white">
                                    <div className="aspect-square relative bg-white flex items-center justify-center p-6 border-b border-slate-50">
                                        {product.image ? (
                                            <div className="relative w-full h-full">
                                                {product.image.startsWith('http') ? (
                                                    <img
                                                        src={`/api/proxy-image?url=${encodeURIComponent(product.image)}`}
                                                        alt={product.title}
                                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                                        referrerPolicy="no-referrer"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.onerror = null; // Prevent infinite loop
                                                            target.src = "/images/ASET HOME/JPG untuk Website/HOME_SUB MENU ICON-01.jpg"; // Use an existing asset as placeholder
                                                            target.style.opacity = "0.5";
                                                        }}
                                                    />
                                                ) : (
                                                    <Image
                                                        src={product.image}
                                                        alt={product.title}
                                                        fill
                                                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm shadow-sm rounded-full text-[10px] font-black tracking-widest uppercase text-blue-600 border border-slate-100">
                                            {product.subcategory || product.category}
                                        </div>
                                    </div>
                                    <CardContent className="p-6 bg-white text-slate-900">
                                        <h3 className="font-bold text-lg text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors uppercase">{product.title}</h3>
                                        <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-black text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg text-sm border border-slate-100">
                                                {product.price ? `Rp ${Number(product.price).toLocaleString('id-ID')}` : 'Hubungi Kami'}
                                            </span>
                                            {product.link ? (
                                                <Button asChild variant="outline" size="sm" className="rounded-lg h-9 hover:bg-blue-50 border-slate-200 text-blue-600 font-bold">
                                                    <a href={product.link} target="_blank" rel="noopener noreferrer">Detail Produk</a>
                                                </Button>
                                            ) : (
                                                <Button variant="outline" size="sm" className="rounded-lg h-9 cursor-not-allowed">
                                                    Instock
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-1 md:col-span-2 lg:col-span-4 py-20 text-center space-y-4 text-slate-500"
                        >
                            <div className="h-20 w-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <PackageOpen className="h-10 w-10 text-slate-300" />
                            </div>
                            <p className="text-xl font-bold text-slate-900">Tidak ada produk ditemukan</p>
                            <p className="text-sm text-slate-500">Coba sesuaikan kata kunci atau filter kategori Anda.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
