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
        <section className="py-12 bg-white overflow-hidden selection:bg-blue-100">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header: Centered to match ProductShowcase */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-10 space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight italic">Event & Berita Terkini</h2>
                    <p className="text-base text-slate-500 font-semibold max-w-3xl mx-auto leading-relaxed">
                        Ikuti berbagai kegiatan edukatif, webinar, kompetisi, dan info terbaru seputar dunia literasi.
                    </p>
                </div>

                {/* Grid: 3 columns, more compact gap */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {/* REAL-TIME EVENTS FROM API */}
                    {displayEvents.map((event) => (
                        <Card key={event.id} className="overflow-hidden rounded-[2rem] border-none shadow-lg hover:shadow-xl transition-all duration-500 group flex flex-col h-full bg-white text-slate-900">
                            <div className="aspect-[16/11] relative bg-slate-50 overflow-hidden shrink-0">
                                <div className="absolute inset-0">
                                    <ProxyImage
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full transition-transform duration-700 group-hover:scale-110"
                                        fallbackSrc="/images/ASET HOME/JPG untuk Website/HOME_SUB MENU ICON-03.jpg"
                                        fill
                                    />
                                </div>
                                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md flex flex-col items-center min-w-[45px]">
                                    <span className="text-[9px] font-black text-[#F58220] uppercase tracking-widest">{new Date(event.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                                    <span className="text-lg font-black text-slate-900">{new Date(event.date).getDate()}</span>
                                </div>
                                {new Date(event.date) >= new Date(new Date().setHours(0, 0, 0, 0)) && (
                                    <div className="absolute top-3 right-3 bg-[#1E4198] text-white text-[8px] font-black px-2.5 py-1 rounded-full tracking-widest uppercase shadow-md">
                                        EVENT
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-6 space-y-3 flex flex-col flex-1">
                                <h3 className="text-lg font-black text-slate-900 line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-[#1E4198] transition-colors">
                                    {event.title}
                                </h3>
                                <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed font-medium">
                                    {event.description}
                                </p>
                                <div className="pt-2 mt-auto">
                                    <Link
                                        href={event.link}
                                        target={event.link.startsWith('http') ? "_blank" : "_self"}
                                    >
                                        <Button className="w-full rounded-xl bg-slate-50 text-slate-900 hover:bg-[#F58220] hover:text-white py-5 h-auto transition-all font-black text-sm border-none shadow-none active:scale-95 group/btn">
                                            Ikuti Sekarang
                                            {event.link.startsWith('http') ? (
                                                <ExternalLink className="ml-2 h-3.5 w-3.5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                            ) : (
                                                <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                            )}
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* REAL-TIME NEWS FROM API */}
                    {displayNews.map((news) => (
                        <Card key={news.id} className="overflow-hidden rounded-[2rem] border-none shadow-lg hover:shadow-xl transition-all duration-500 group flex flex-col h-full bg-white text-slate-900">
                            <div className="aspect-[16/11] relative bg-slate-50 overflow-hidden shrink-0">
                                <div className="absolute inset-0">
                                    <ProxyImage
                                        src={news.image}
                                        alt={news.title}
                                        className="w-full h-full transition-transform duration-700 group-hover:scale-110"
                                        fallbackSrc="/images/ASET HOME/JPG untuk Website/HOME_SUB MENU ICON-02.jpg"
                                        fill
                                    />
                                </div>
                                <div className="absolute top-3 left-3 bg-[#1E4198]/90 backdrop-blur-md text-white text-[8px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase shadow-md">
                                    INFO PENDIDIKAN
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-3 flex flex-col flex-1">
                                <div className="text-[9px] font-black text-slate-400 tracking-widest uppercase mb-1">
                                    {new Date(news.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                                </div>
                                <h3 className="text-lg font-black text-slate-900 line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-[#1E4198] transition-colors">
                                    {news.title}
                                </h3>
                                <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed font-medium">
                                    {news.description}
                                </p>
                                <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
                                    <Link
                                        href={news.link}
                                        target={news.link.startsWith('http') ? "_blank" : "_self"}
                                        className="flex items-center text-[#1E4198] font-black text-xs group/btn w-full justify-between"
                                    >
                                        Baca Selengkapnya
                                        {news.link.startsWith('http') ? (
                                            <ExternalLink className="h-3.5 w-3.5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                        ) : (
                                            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                        )}
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Footer Button: Centered to match ProductShowcase */}
                <div className="mt-12 text-center">
                    <Link href="/events">
                        <Button variant="outline" className="rounded-xl border-2 border-slate-200 px-8 py-5 h-auto text-slate-800 font-black text-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-lg group active:scale-95">
                            Lihat Semua Event & Berita
                            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default EventsNews;
