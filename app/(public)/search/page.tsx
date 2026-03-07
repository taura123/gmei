import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Search, Package, Newspaper, Calendar, ArrowRight } from "lucide-react";

async function getSearchResults(query: string) {
    if (!query) return { products: [], news: [], events: [] };

    const [products, news, events] = await Promise.all([
        prisma.product.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { description: { contains: query } },
                    { category: { contains: query } },
                ]
            },
            take: 8
        }),
        prisma.news.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { description: { contains: query } },
                    { content: { contains: query } },
                ]
            },
            take: 8,
            orderBy: { date: 'desc' }
        }),
        prisma.event.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { description: { contains: query } },
                    { content: { contains: query } },
                ]
            },
            take: 8,
            orderBy: { date: 'desc' }
        })
    ]);

    return { products, news, events };
}

export default async function SearchPage({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const searchParams = await searchParamsPromise;
    const query = searchParams.q || "";
    const { products, news, events } = await getSearchResults(query);
    const totalResults = products.length + news.length + events.length;

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header Section */}
            <div className="bg-white border-b py-12">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto space-y-4">
                        <div className="flex items-center gap-3 text-blue-600 font-bold uppercase tracking-wider text-sm">
                            <Search className="h-4 w-4" />
                            Hasil Pencarian
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900">
                            {query ? `Menampilkan hasil untuk "${query}"` : "Cari Sesuatu..."}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Ditemukan {totalResults} hasil yang relevan.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="max-w-6xl mx-auto space-y-16">

                    {totalResults === 0 && query && (
                        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="h-10 w-10 text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Tidak ada hasil ditemukan</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">
                                Coba gunakan kata kunci lain atau periksa kembali ejaan pencarian Anda.
                            </p>
                        </div>
                    )}

                    {/* Products Section */}
                    {products.length > 0 && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
                                <Package className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Produk ({products.length})</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {products.map((item) => (
                                    <Link href={`/products?selected=${item.id}`} key={item.id} className="group">
                                        <Card className="rounded-[2rem] overflow-hidden border-slate-100 h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                                            <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
                                                <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-blue-600/90 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">Product</Badge>
                                                </div>
                                            </div>
                                            <CardContent className="p-6 space-y-2">
                                                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{item.title}</h3>
                                                <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* News Section */}
                    {news.length > 0 && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-l-4 border-orange-500 pl-4">
                                <Newspaper className="h-6 w-6 text-orange-500" />
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Berita ({news.length})</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {news.map((item) => (
                                    <Link href={`/events`} key={item.id} className="group">
                                        <Card className="rounded-[2.5rem] overflow-hidden border-slate-100 h-full flex flex-col md:flex-row hover:shadow-2xl transition-all duration-500">
                                            <div className="w-full md:w-48 aspect-video md:aspect-square relative overflow-hidden flex-shrink-0">
                                                <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                            </div>
                                            <CardContent className="p-6 flex flex-col justify-center gap-3 flex-1">
                                                <Badge className="w-fit bg-orange-100 text-orange-600 hover:bg-orange-100 border-none rounded-full px-4 text-[10px] font-bold uppercase tracking-widest">{item.category || "News"}</Badge>
                                                <h3 className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-tight line-clamp-2">{item.title}</h3>
                                                <div className="flex items-center text-blue-600 font-bold text-xs uppercase tracking-tighter group-hover:gap-2 transition-all">
                                                    Baca Selengkapnya <ArrowRight className="h-3 w-3 ml-1" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Events Section */}
                    {events.length > 0 && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-l-4 border-emerald-500 pl-4">
                                <Calendar className="h-6 w-6 text-emerald-500" />
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Event ({events.length})</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {events.map((item) => (
                                    <Link href={`/events`} key={item.id} className="group">
                                        <Card className="rounded-[2.5rem] overflow-hidden border-slate-100 h-full flex flex-col md:flex-row hover:shadow-2xl transition-all duration-500 bg-white">
                                            <div className="w-full md:w-48 aspect-video md:aspect-square relative overflow-hidden flex-shrink-0">
                                                <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                            </div>
                                            <CardContent className="p-6 flex flex-col justify-center gap-3 flex-1">
                                                <div className="flex justify-between items-start">
                                                    <Badge className="w-fit bg-emerald-100 text-emerald-600 hover:bg-emerald-100 border-none rounded-full px-4 text-[10px] font-bold uppercase tracking-widest">Event</Badge>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                                <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight line-clamp-2">{item.title}</h3>
                                                <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
