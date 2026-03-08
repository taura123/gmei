import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ExternalLink, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchGramediaNews, fetchGramediaEvents } from "@/lib/news";
import ProxyImage from "@/components/ui/ProxyImage";

const EventsNews = async () => {
    // Fetch real-time data from APIs
    const [apiEvents, apiNews] = await Promise.all([
        fetchGramediaEvents(),
        fetchGramediaNews()
    ]);

    // Take top items for homepage
    const displayEvents = apiEvents.slice(0, 2);
    const displayNews = apiNews.slice(0, 1);

    return (
        <section className="py-12 md:py-20 bg-white overflow-hidden selection:bg-blue-100">
            <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                {/* Header: Centered to match ProductShowcase */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12 md:mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight italic">Event & Berita Terkini</h2>
                    <p className="text-base md:text-lg text-slate-500 font-semibold max-w-2xl mx-auto leading-relaxed px-4">
                        Ikuti berbagai kegiatan edukatif, webinar, kompetisi, dan info terbaru seputar dunia literasi.
                    </p>
                </div>

                {/* Grid: 3 columns, more compact gap */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {/* REAL-TIME EVENTS FROM API */}
                    {displayEvents.map((event) => (
                        <Card key={event.id} className="overflow-hidden rounded-[2.25rem] border-none shadow-xl hover:shadow-2xl transition-all duration-700 group flex flex-col h-full bg-white text-slate-900 border border-slate-100 hover:-translate-y-2">
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
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-xl flex flex-col items-center min-w-[55px]">
                                    <span className="text-[10px] font-black text-[#F58220] uppercase tracking-[0.2em]">{new Date(event.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                                    <span className="text-xl font-black text-slate-900">{new Date(event.date).getDate()}</span>
                                </div>
                                {new Date(event.date) >= new Date(new Date().setHours(0, 0, 0, 0)) && (
                                    <div className="absolute top-4 right-4 bg-[#1E4198] text-white text-[9px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase shadow-xl">
                                        EVENT
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-8 space-y-4 flex flex-col flex-1">
                                <h3 className="text-xl font-black text-slate-900 line-clamp-2 leading-tight min-h-[3rem] group-hover:text-[#1E4198] transition-colors uppercase tracking-tight">
                                    {event.title}
                                </h3>
                                <p className="text-slate-500 text-[13px] line-clamp-2 leading-relaxed font-medium">
                                    {event.description}
                                </p>
                                <div className="pt-4 mt-auto">
                                    <Link
                                        href={event.link}
                                        target={event.link.startsWith('http') ? "_blank" : "_self"}
                                    >
                                        <Button className="w-full rounded-2xl bg-slate-50 text-[#1E4198] hover:bg-[#F58220] hover:text-white py-6 h-auto transition-all font-black text-xs border-none shadow-sm active:scale-95 group/btn uppercase tracking-widest">
                                            Ikuti Sekarang
                                            {event.link.startsWith('http') ? (
                                                <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                            ) : (
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                            )}
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* REAL-TIME NEWS FROM API */}
                    {displayNews.map((news) => (
                        <Card key={news.id} className="overflow-hidden rounded-[2.25rem] border-none shadow-xl hover:shadow-2xl transition-all duration-700 group flex flex-col h-full bg-white text-slate-900 border border-slate-100 hover:-translate-y-2">
                            <div className="aspect-[16/10] relative bg-slate-50 overflow-hidden shrink-0">
                                <div className="absolute inset-0">
                                    <ProxyImage
                                        src={news.image}
                                        alt={news.title}
                                        className="w-full h-full transition-transform duration-1000 group-hover:scale-110"
                                        fallbackSrc="/images/ASET HOME/JPG untuk Website/HOME_SUB MENU ICON-02.jpg"
                                        fill
                                    />
                                </div>
                                <div className="absolute top-4 left-4 bg-[#1E4198]/90 backdrop-blur-xl text-white text-[9px] font-black px-4 py-2 rounded-full tracking-[0.2em] uppercase shadow-xl">
                                    INFO PENDIDIKAN
                                </div>
                            </div>
                            <CardContent className="p-8 space-y-4 flex flex-col flex-1">
                                <div className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">
                                    {new Date(news.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 line-clamp-2 leading-tight min-h-[3rem] group-hover:text-[#1E4198] transition-colors uppercase tracking-tight">
                                    {news.title}
                                </h3>
                                <p className="text-slate-500 text-[13px] line-clamp-2 leading-relaxed font-medium">
                                    {news.description}
                                </p>
                                <div className="pt-6 mt-auto border-t border-slate-100 flex items-center justify-between">
                                    <Link
                                        href={news.link}
                                        target={news.link.startsWith('http') ? "_blank" : "_self"}
                                        className="flex items-center text-[#1E4198] font-black text-xs group/btn w-full justify-between uppercase tracking-widest hover:text-[#F58220] transition-colors"
                                    >
                                        Baca Selengkapnya
                                        {news.link.startsWith('http') ? (
                                            <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                        ) : (
                                            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                        )}
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Footer Button: Centered to match ProductShowcase */}
                <div className="mt-16 text-center">
                    <Link href="/events">
                        <Button variant="outline" className="rounded-2xl border-2 border-slate-200 px-10 py-6 h-auto text-slate-800 font-black text-xl hover:bg-[#1E4198] hover:text-white hover:border-[#1E4198] transition-all shadow-xl group active:scale-95 uppercase tracking-widest mb-10">
                            Lihat Semua Berita
                            <ChevronRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-3" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default EventsNews;
