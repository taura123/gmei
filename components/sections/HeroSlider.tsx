"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const slides = [
    {
        id: 1,
        title: "Solusi Belajar Terpercaya Hadapi TKA",
        description: "Rangkaian buku pilihan untuk membantu siswa sukses menghadapi Tes Kompetensi Akademik.",
        image: "/images/ASET HOME/JPG untuk Website/HOME WEB GMEI_REV-01.jpg",
        cta: "Lihat Produk",
        link: "/products?category=books"
    },
    {
        id: 2,
        title: "SIPLah Gramedia",
        description: "Kebutuhan sekolah kini lebih mudah dijangkau, praktis, dan sesuai regulasi pemerintah.",
        image: "/images/ASET HOME/JPG untuk Website/HOME WEB GMEI_REV-02.jpg",
        cta: "Pelajari Selengkapnya",
        link: "/siplah"
    },
    {
        id: 3,
        title: "Belajar Koding Jadi Menyenangkan",
        description: "Program robotik dan koding interaktif untuk mengasah kreativitas masa depan anak.",
        image: "/images/ASET HOME/JPG untuk Website/HOME WEB GMEI_REV-03.jpg",
        cta: "Lihat Program",
        link: "/events"
    }
];

const HeroSlider = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
    }, [emblaApi, onSelect]);

    return (
        <section className="relative h-[350px] sm:h-[450px] lg:h-[700px] w-full overflow-hidden bg-slate-900 group/slider">
            <div className="h-full" ref={emblaRef}>
                <div className="flex h-full">
                    {slides.map((slide, index) => (
                        <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full overflow-hidden">
                            {/* Improved Image with subtle zoom-in animation */}
                            <motion.div
                                initial={{ scale: 1.1 }}
                                animate={{ scale: selectedIndex === index ? 1 : 1.1 }}
                                transition={{ duration: 10, ease: "linear" }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-cover object-center"
                                    priority={index === 0}
                                />
                                {/* Premium Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/30 to-transparent lg:hidden" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent lg:hidden" />
                            </motion.div>

                            {/* Mobile-First Text Content (Overlay for better legibility) */}
                            <div className="absolute inset-0 z-20 flex flex-col justify-end lg:justify-center p-6 sm:p-12 lg:p-24 pointer-events-none">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={selectedIndex === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="max-w-3xl space-y-4 md:space-y-6"
                                >
                                    <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight [text-shadow:0_4px_12px_rgba(0,0,0,0.5)]">
                                        {slide.title}
                                    </h2>
                                    <p className="text-sm sm:text-lg lg:text-xl text-white/90 font-medium max-w-xl leading-relaxed hidden sm:block [text-shadow:0_2px_8px_rgba(0,0,0,0.3)]">
                                        {slide.description}
                                    </p>
                                    <div className="pt-2 pointer-events-auto">
                                        <Link href={slide.link}>
                                            <Button className="rounded-2xl bg-[#F58220] hover:bg-[#E07210] text-white border-none px-8 py-7 h-auto font-black text-base shadow-2xl transition-all hover:scale-105 active:scale-95 group/btn uppercase tracking-widest">
                                                {slide.cta}
                                                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Hidden full-slide link for mobile accessibility */}
                            <Link href={slide.link} className="absolute inset-0 z-10 lg:hidden" title={slide.title} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Transition - Glassmorphism */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/50 to-transparent z-10 pointer-events-none" />

            {/* Premium Slide Indicators - Apple Style */}
            <div className="absolute bottom-10 left-6 sm:left-12 lg:left-1/2 lg:-translate-x-1/2 z-30 flex items-center gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className="relative h-2 group py-4 px-1 flex items-center"
                        onClick={() => emblaApi?.scrollTo(index)}
                        aria-label={`Buka slide ${index + 1}`}
                    >
                        <div className={`h-1.5 rounded-full transition-all duration-500 ease-out flex overflow-hidden ${selectedIndex === index ? "w-10 sm:w-16 bg-orange-500" : "w-4 sm:w-6 bg-white/40"
                            }`}>
                            {selectedIndex === index && (
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 5, ease: "linear" }}
                                    className="h-full bg-white/30"
                                />
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* Side Navigation - Hidden on Mobile, Premium on Desktop */}
            <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 right-12 z-30 flex-col gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white hover:text-slate-900 h-14 w-14 transition-all hover:scale-110 active:scale-90"
                    onClick={scrollPrev}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white hover:text-slate-900 h-14 w-14 transition-all hover:scale-110 active:scale-90"
                    onClick={scrollNext}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
        </section>
    );
};

export default HeroSlider;
