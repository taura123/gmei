import { prisma } from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

export default function ProductsPage() {
    // We will just render the client component which will use SWR or fetch
    // But since this is App Router it's better to fetch here and pass as initial data
    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Manajemen Produk</h1>
                <p className="text-slate-500">Kelola katalog produk yang tampil pada halaman website publik.</p>
            </div>

            <ProductsClient />
        </div>
    );
}
