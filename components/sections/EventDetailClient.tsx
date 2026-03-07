"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Calendar, MapPin, Clock, ArrowRight, Share2, Info, Link2, Facebook, Linkedin, Twitter, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

interface EventDetailClientProps {
    event: any;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
    const isUpcoming = new Date(event.date) >= new Date(new Date().setHours(0, 0, 0, 0));

    return (
        <div className="bg-white min-h-screen pb-32">
            {/* HERO SECTION */}
            <section className="relative h-[65vh] min-h-[550px] flex items-end pb-24 overflow-hidden bg-slate-900">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    {event.image?.startsWith('http') ? (
                        <img
                            src={`/api/proxy-image?url=${encodeURIComponent(event.image)}`}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <Image
                            src={event.image || "/images/ABOUT/IMG_7787.JPG"}
                            alt={event.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
                </motion.div>

                <div className="relative container mx-auto px-6 z-10">
                    <div className="max-w-4xl space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Link
                                href="/events"
                                className="inline-flex items-center text-white/70 hover:text-white text-sm font-bold tracking-tight transition-all group px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10"
                            >
                                <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                Kembali ke Agenda
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-wrap gap-2">
                                {isUpcoming ? (
                                    <span className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-black tracking-[0.2em] uppercase shadow-lg shadow-blue-500/20">
                                        UPCOMING EVENT
                                    </span>
                                ) : (
                                    <span className="px-4 py-1.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-black tracking-[0.2em] uppercase border border-slate-700">
                                        PAST EVENT
                                    </span>
                                )}
                                <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black tracking-[0.2em] uppercase border border-white/20">
                                    {event.category || 'AGENDA'}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
                                {event.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-4">
                                <div className="flex items-center gap-3 text-white/90">
                                    <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30 backdrop-blur-md">
                                        <Calendar className="h-5 w-5 text-orange-400" />
                                    </div>
                                    <span className="text-sm md:text-base font-bold tracking-wide uppercase">
                                        {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-white/90">
                                    <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 backdrop-blur-md">
                                        <MapPin className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <span className="text-sm md:text-base font-bold tracking-wide uppercase">
                                        {event.location || "Gramedia Official"}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CONTENT GRID */}
            <div className="container mx-auto px-6 -mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT: CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="lg:col-span-8"
                    >
                        <div className="bg-white rounded-[3.5rem] p-10 md:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 min-h-[500px] flex flex-col">
                            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                                    <Info className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tentang Kegiatan</h2>
                            </div>

                            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium flex-1">
                                {event.description && (
                                    <p className="text-xl text-slate-900 font-bold mb-8 italic border-l-4 border-blue-600 pl-6 py-2 bg-blue-50/50 rounded-r-2xl">
                                        {event.description}
                                    </p>
                                )}
                                <div
                                    className="whitespace-pre-wrap text-slate-700 leading-loose"
                                    dangerouslySetInnerHTML={{ __html: event.content || event.description }}
                                />
                            </div>

                            <div className="mt-20 pt-10 border-t border-slate-50 flex flex-wrap items-center justify-between gap-6">
                                <Link href="/events" className="group flex items-center text-slate-400 font-black text-xs uppercase tracking-[0.2em] hover:text-blue-600 transition-all">
                                    <ArrowRight className="mr-2 h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                                    Kembali ke Daftar Event
                                </Link>
                                <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-full border border-slate-100 relative">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Share ke:</span>
                                    <div className="flex items-center gap-2">
                                        <ShareMenu event={event} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: SIDEBAR / CTA */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="lg:col-span-4 space-y-8"
                    >
                        <div className="bg-white rounded-[3rem] p-10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-slate-100 sticky top-32 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 -z-10" />

                            <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Detail Pelaksanaan</h3>

                            <div className="space-y-6 mb-10">
                                <div className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group">
                                    <div className="h-14 w-14 shrink-0 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                        <Calendar className="h-7 w-7 text-blue-600 group-hover:text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="block text-[10px] font-black text-slate-300 uppercase tracking-widest">TANGGAL</span>
                                        <span className="text-slate-900 font-black text-base">{new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-orange-200 hover:bg-white transition-all group">
                                    <div className="h-14 w-14 shrink-0 rounded-2xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                                        <MapPin className="h-7 w-7 text-orange-600 group-hover:text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="block text-[10px] font-black text-slate-300 uppercase tracking-widest">LOKASI</span>
                                        <span className="text-slate-900 font-black text-base">{event.location || "Gramedia Official"}</span>
                                    </div>
                                </div>
                            </div>

                            {isUpcoming ? (
                                <div className="space-y-4">
                                    <Link href={event.link || "#"} target="_blank">
                                        <Button className="w-full h-16 rounded-[1.5rem] bg-[#1E4198] hover:bg-[#F58220] transition-all duration-500 font-black text-lg shadow-xl shadow-blue-500/20 group border-b-4 border-blue-900 active:border-b-0 active:translate-y-1">
                                            Daftar Sekarang
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="p-1.5 rounded-[1.5rem] bg-slate-100 border border-slate-200">
                                    <div className="py-4 border-2 border-dashed border-slate-300 rounded-[1.2rem] text-center bg-white/50">
                                        <span className="text-slate-400 font-black uppercase text-sm tracking-[0.2em]">Event telah berakhir</span>
                                    </div>
                                </div>
                            )}

                            <p className="mt-8 text-center text-[11px] text-slate-400 font-bold leading-relaxed">
                                Butuh bantuan? Hubungi kami melalui tombol WhatsApp <br /> di pojok kanan bawah halaman.
                            </p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}

function ShareMenu({ event }: { event: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = `Ayo ikuti event "${event.title}" dari Gramedia Mitra Edukasi Indonesia!`;

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [shareUrl]);

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: event.title,
                    text: shareTitle,
                    url: shareUrl,
                });
            } catch (err) {
                console.log('Error sharing:', err);
                // Fallback for desktop/non-supporting browsers if native share fails
                setIsOpen(!isOpen);
            }
        } else {
            setIsOpen(!isOpen);
        }
    };

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><ArrowRight className="h-4 w-4" /></div>, // Using ArrowRight as representative if icon not found
            href: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
        },
        {
            name: 'Facebook',
            icon: <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Facebook className="h-4 w-4" /></div>,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: 'LinkedIn',
            icon: <div className="h-8 w-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center"><Linkedin className="h-4 w-4" /></div>,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: 'Twitter',
            icon: <div className="h-8 w-8 rounded-lg bg-slate-50 text-slate-800 flex items-center justify-center"><Twitter className="h-4 w-4" /></div>,
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
        },
    ];

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={handleNativeShare}
                className={`h-9 w-9 rounded-full transition-all ${isOpen ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white hover:shadow-md text-slate-600'}`}
            >
                <Share2 className="h-4 w-4" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute bottom-full right-0 mb-4 w-72 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-6 z-50 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -mr-12 -mt-12 -z-10" />

                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Bagikan Ke</p>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {shareLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors group"
                                    >
                                        {link.icon}
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{link.name}</span>
                                    </a>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-slate-50">
                                <button
                                    onClick={handleCopy}
                                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 group-hover:text-blue-600 shadow-sm'}`}>
                                            {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                                        </div>
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">
                                            {copied ? 'Tersalin!' : 'Salin Link'}
                                        </span>
                                    </div>
                                    {!copied && <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
