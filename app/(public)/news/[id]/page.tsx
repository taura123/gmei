import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Calendar, User, Tag } from "lucide-react";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

interface NewsDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) return { title: "Berita Tidak Ditemukan" };
    return {
        title: news.title,
        description: news.description || news.content?.substring(0, 160),
        openGraph: {
            title: news.title,
            description: news.description || "",
            type: "article",
            publishedTime: news.date.toISOString(),
            authors: [news.author || "Gramedia Mitra Edukasi"],
            images: news.image ? [{ url: news.image, alt: news.title }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: news.title,
            description: news.description || "",
            images: news.image ? [news.image] : [],
        },
    };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
    const { id } = await params;
    const news = await prisma.news.findUnique({
        where: { id }
    });

    if (!news) {
        notFound();
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* HERO SECTION */}
            <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {news.image.startsWith('http') ? (
                        <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            // @ts-ignore
                            fetchpriority="high"
                        />
                    ) : (
                        <Image
                            src={news.image}
                            alt={news.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                </div>

                <div className="relative container mx-auto px-6 py-12 z-10">
                    <div className="max-w-4xl space-y-6">
                        <Link
                            href="/events"
                            className="inline-flex items-center text-white/80 hover:text-white text-sm font-bold tracking-tight transition-colors group mb-4"
                        >
                            <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Berita
                        </Link>
                        <div className="flex flex-wrap gap-3">
                            <span className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-black tracking-widest uppercase">
                                {news.category || "INFO PENDIDIKAN"}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                            {news.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-blue-400" />
                                {new Date(news.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-400" />
                                {news.author || "Admin Gramedia"}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <article className="container mx-auto px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* MAIN CONTENT */}
                        <div className="lg:col-span-12">
                            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-img:rounded-3xl prose-img:shadow-2xl">
                                <p className="text-xl font-bold text-slate-800 mb-8 leading-relaxed italic border-l-4 border-[#F58220] pl-6">
                                    {news.description}
                                </p>
                                <div
                                    className="whitespace-pre-wrap text-slate-700 space-y-6"
                                    dangerouslySetInnerHTML={{ __html: news.content }}
                                />
                            </div>

                            {/* SHARE / FOOTER */}
                            <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Bagikan Berita</span>
                                    {/* Social links could go here */}
                                </div>
                                <Link href="/events">
                                    <span className="text-blue-600 font-black text-sm hover:underline cursor-pointer">
                                        Lihat Berita Lainnya →
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
