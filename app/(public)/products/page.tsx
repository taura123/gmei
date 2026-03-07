import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

import ProductsCatalogClient from "./ProductsCatalogClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Katalog Produk Edukasi — Gramedia Mitra Edukasi Indonesia",
    description: "Jelajahi buku pendidikan (SD, SMP, SMA) dan alat peraga edukatif resmi dari Gramedia Mitra Edukasi Indonesia.",
    openGraph: {
        title: "Katalog Pendidikan Terbaik — GMEI",
        description: "Buku sekolah, APE, peralatan TIK, dan perlengkapan edukasi lainnya.",
        url: "/products",
    },
};

export default async function PublicProductsPage() {
    // Automatically trigger sync-service on catalog load to ensure products exist
    // It's safe to run since it upserts to avoid duplication.
    await import("@/lib/sync-service").then(m => m.SyncService.syncProducts());

    const productsData = await prisma.product.findMany({
        orderBy: { createdAt: "desc" }
    });

    // Fix: "Only plain objects can be passed to Client Components from Server Components. Decimal objects are not supported."
    const products = productsData.map(p => ({
        ...p,
        price: p.price ? Number(p.price) : null
    }));

    return (
        <div className="bg-slate-50 min-h-screen py-20 pb-32">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">Katalog Pendidikan</h1>
                    <p className="text-xl text-slate-500 leading-relaxed font-medium">
                        Temukan berbagai buku referensi kurikulum, bacaan literasi, serta alat peraga untuk SD, SMP, hingga SMA/SMK.
                    </p>
                </div>

                <ProductsCatalogClient initialProducts={products} />
            </div>
        </div>
    );
}
