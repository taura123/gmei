"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ExternalLink, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProxyImage from "@/components/ui/ProxyImage";
import { motion } from "framer-motion";

const EventsNews = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [eventsRes, newsRes] = await Promise.all([
                    fetch('/api/events'),
                    fetch('/api/news')
                ]);

                const apiEvents = eventsRes.ok ? await eventsRes.json() : [];
                const apiNews = newsRes.ok ? await newsRes.json() : [];

                setEvents(apiEvents.slice(0, 2));
                setNews(apiNews.slice(0, 1));
            } catch (error) {
                console.error("Error loading events/news:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return (
        <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E4198] mx-auto"></div>
        </div>
    );

    return (
        <section className="py-20 md:py-32 bg-white overflow-hidden selection:bg-blue-100 relative">
            {/* Background Decorative */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />

            <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
                {/* Header: Centered */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 md:mb-24 space-y-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter italic uppercase"
                    >
                        Event & <span className="text-[#1E4198]">Berita Terkini</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed px-4"
                    >
                        Ikuti berbagai kegiatan edukatif, webinar, kompetisi, dan informasi literasi paling update dari ekosistem Gramedia.
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto">
                    {/* REAL-TIME EVENTS */}
                    {events.map((event, idx) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="overflow-hidden rounded-[3rem] border-none shadow-[0_15px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_70px_rgba(30,65,152,0.15)] transition-all duration-700 group flex flex-col h-full bg-white text-slate-900 border border-slate-100 hover:-translate-y-4">
                                <div className="aspect-[16/10] relative bg-slate-50 overflow-hidden shrink-0">
                                    <div className="absolute inset-0">
                                        <ProxyImage
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-full transition-transform duration-1000 group-hover:scale-110"
                                            fallbackSrc="/images/ASET HOME/JPG untuk Website/HOME_SUB MENU ICON-03.jpg"
                                            fill
                                        />
                                    </div>
                                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-2xl px-5 py-3 rounded-2xl shadow-2xl flex flex-col items-center min-w-[65px] border border-white/50">
                                        <span className="text-[11px] font-black text-[#F58220] uppercase tracking-[0.2em]">{new Date(event.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                                        <span className="text-2xl font-black text-slate-900">{new Date(event.date).getDate()}</span>
                                    </div>
                                    {new Date(event.date) >= new Date(new Date().setHours(0, 0, 0, 0)) && (
                                        <div className="absolute top-6 right-6 bg-gradient-to-r from-[#1E4198] to-[#2D3181] text-white text-[10px] font-black px-4 py-2 rounded-full tracking-widest uppercase shadow-2xl skew-x-[-10deg]">
                                            UPCOMING EVENT
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-10 space-y-5 flex flex-col flex-1">
                                    <h3 className="text-2xl font-black text-slate-900 line-clamp-2 leading-[1.2] min-h-[4rem] group-hover:text-[#1E4198] transition-colors uppercase italic tracking-tight">
                                        {event.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed font-medium">
                                        {event.description}
                                    </p>
                                    <div className="pt-6 mt-auto">
                                        <Link
                                            href={event.link}
                                            target={event.link.startsWith('http') ? "_blank" : "_self"}
                                        >
                                            <Button className="w-full rounded-2xl bg-[#1E4198] text-white hover:bg-[#F58220] py-8 h-auto transition-all font-black text-xs border-none shadow-xl active:scale-95 group/btn uppercase tracking-[0.2em] relative overflow-hidden">
                                                Ikuti Sekarang
                                                {event.link.startsWith('http') ? (
                                                    <ExternalLink className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                                ) : (
                                                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    {/* REAL-TIME NEWS */}
                    {news.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="overflow-hidden rounded-[3rem] border-none shadow-[0_15px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_70px_rgba(30,65,152,0.15)] transition-all duration-700 group flex flex-col h-full bg-white text-slate-900 border border-slate-100 hover:-translate-y-4">
                                <div className="aspect-[16/10] relative bg-slate-50 overflow-hidden shrink-0">
                                    <div className="absolute inset-0">
                                        <ProxyImage
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full transition-transform duration-1000 group-hover:scale-110"
                                            fallbackSrc="/images/ASET HOME/JPG untuk Website/HOME_SUB MENU ICON-02.jpg"
                                            fill
                                        />
                                    </div>
                                    <div className="absolute top-6 left-6 bg-[#F58220]/90 backdrop-blur-2xl text-white text-[10px] font-black px-5 py-2.5 rounded-full tracking-[0.2em] uppercase shadow-2xl skew-x-[-10deg]">
                                        WARTA EDUKASI
                                    </div>
                                </div>
                                <CardContent className="p-10 space-y-5 flex flex-col flex-1">
                                    <div className="text-[11px] font-black text-slate-400 tracking-[0.3em] uppercase mb-1 flex items-center gap-2">
                                        <div className="h-1 w-6 bg-slate-200" />
                                        {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 line-clamp-2 leading-[1.2] min-h-[4rem] group-hover:text-[#1E4198] transition-colors uppercase italic tracking-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed font-medium">
                                        {item.description}
                                    </p>
                                    <div className="pt-8 mt-auto border-t border-slate-100 flex items-center justify-between">
                                        <Link
                                            href={item.link}
                                            target={item.link.startsWith('http') ? "_blank" : "_self"}
                                            className="flex items-center text-[#1E4198] font-black text-sm group/btn w-full justify-between uppercase tracking-[0.2em] hover:text-[#F58220] transition-all"
                                        >
                                            Baca Selengkapnya
                                            <div className="flex items-center gap-2">
                                                {item.link.startsWith('http') ? (
                                                    <ExternalLink className="h-5 w-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                                ) : (
                                                    <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Button: Centered */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center"
                >
                    <Link href="/events">
                        <Button variant="outline" className="rounded-[2rem] border-2 border-slate-200 px-14 py-8 h-auto text-slate-800 font-black text-xl hover:bg-[#1E4198] hover:text-white hover:border-[#1E4198] transition-all shadow-2xl group active:scale-95 uppercase tracking-widest mb-10">
                            Lihat Seluruh Aktivitas
                            <ChevronRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-4" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default EventsNews;
