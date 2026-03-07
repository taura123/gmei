import { fetchGramediaNews, fetchGramediaEvents } from "@/lib/news";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Event & Berita — Agenda Kegiatan Edukasi Terbaru",
    description: "Temukan event dan berita terbaru seputar dunia pendidikan dari Gramedia Mitra Edukasi Indonesia. Workshop, seminar, webinar, dan kegiatan literasi lainnya.",
    openGraph: {
        title: "Event & Berita Pendidikan — Gramedia Mitra Edukasi",
        description: "Agenda kegiatan edukasi dan berita terbaru dari Gramedia Mitra Edukasi Indonesia.",
        url: "/events",
    },
};

export default async function EventsPage() {
    // Fetch data concurrently from APIs
    const [apiEvents, apiNews] = await Promise.all([
        fetchGramediaEvents(),
        fetchGramediaNews()
    ]);

    return (
        <div className="bg-slate-50 min-h-screen selection:bg-blue-100 pb-20">
            {/* HERO SECTION */}
            <section className="relative min-h-[50vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/ASET HOME/WhatsApp Image 2026-01-23 at 15.33.43 (1).jpeg"
                        alt="Events Hero"
                        fill
                        className="object-cover scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-800/40" />
                </div>

                <div className="relative container mx-auto px-6 py-20 md:py-32 z-10">
                    <div className="max-w-3xl space-y-6">
                        <span className="inline-block px-4 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-400 text-sm font-bold tracking-[0.2em] uppercase backdrop-blur-md">
                            Portal Edukasi
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                            Event Terkini & <br />
                            <span className="text-blue-400">Berita Literasi</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed">
                            Eksplorasi kegiatan inspiratif dan berita literasi terkini dari keluarga besar Gramedia Mitra Edukasi Indonesia.
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent" />
            </section>

            <div className="container mx-auto px-6 max-w-6xl py-16 space-y-24">

                {/* AGENDA KEGIATAN (FROM API) */}
                <section className="space-y-8">
                    <div className="flex flex-col items-center text-center space-y-3">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Agenda Kegiatan</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {apiEvents.length > 0 ? apiEvents.map((event) => (
                            <Card key={event.id} className="overflow-hidden rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all duration-500 group bg-white flex flex-col h-full">
                                <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg flex flex-col items-center">
                                            <span className="text-[10px] font-black text-[#F58220] uppercase tracking-widest">{new Date(event.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                                            <span className="text-xl font-black text-slate-900">{new Date(event.date).getDate()}</span>
                                        </div>
                                    </div>
                                    {new Date(event.date) >= new Date(new Date().setHours(0, 0, 0, 0)) && (
                                        <div className="absolute top-4 right-4 bg-[#1E4198] text-white text-[9px] font-black px-3 py-1 rounded-full tracking-widest uppercase shadow-lg">
                                            EVENT TERKINI
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-6 space-y-4 flex flex-col flex-1">
                                    <h3 className="text-lg font-black text-slate-900 line-clamp-2 leading-tight min-h-[2.5rem] group-hover:text-[#1E4198] transition-colors">
                                        {event.title}
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                                            <Clock className="w-3.5 h-3.5 text-[#1E4198]" />
                                            {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="pt-2 mt-auto">
                                        <Link
                                            href={event.link}
                                            target={event.link.startsWith('http') ? "_blank" : "_self"}
                                        >
                                            <Button className="w-full rounded-xl bg-slate-50 text-slate-900 hover:bg-[#F58220] hover:text-white py-4 h-auto font-black text-xs tracking-tight transition-all border-none shadow-none">
                                                Ikuti Sekarang
                                                {event.link.startsWith('http') ? (
                                                    <ExternalLink className="ml-2 w-3.5 h-3.5" />
                                                ) : (
                                                    <ArrowRight className="ml-2 w-3.5 h-3.5" />
                                                )}
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        )) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] shadow-inner">
                                <p className="text-slate-400 font-medium">Sedang memuat agenda kegiatan edukasi terbaru...</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* BERITA TERKINI (FROM API) */}
                <section className="space-y-8">
                    <div className="flex flex-col items-center text-center space-y-3">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Berita Terkini</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {apiNews.length > 0 ? apiNews.map((news) => (
                            <Card key={news.id} className="overflow-hidden rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all duration-500 group bg-white flex flex-col h-full">
                                <div className="aspect-video relative overflow-hidden bg-slate-100 shrink-0">
                                    <Image
                                        src={news.image}
                                        alt={news.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-[#1E4198] text-white text-[9px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase opacity-90 backdrop-blur-sm">
                                            INFO PENDIDIKAN
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-6 space-y-3 flex flex-col flex-1">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        {new Date(news.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 line-clamp-2 leading-tight group-hover:text-[#1E4198] transition-colors min-h-[2.5rem]">
                                        {news.title}
                                    </h3>
                                    <p className="text-slate-500 text-xs leading-relaxed font-medium line-clamp-2 mb-4">
                                        {news.description}
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-slate-50">
                                        <Link
                                            href={news.link}
                                            target={news.link.startsWith('http') ? "_blank" : "_self"}
                                            className="flex items-center justify-between text-[#1E4198] font-black text-[10px] uppercase tracking-tighter group/btn w-full"
                                        >
                                            Baca Selengkapnya
                                            {news.link.startsWith('http') ? (
                                                <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                            ) : (
                                                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                            )}
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        )) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] shadow-inner">
                                <p className="text-slate-400 font-medium">Sedang memuat berita pendidikan terbaru...</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
