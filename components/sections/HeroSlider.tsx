"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

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
        <section className="relative h-[650px] w-full overflow-hidden bg-white">
            <div className="h-full" ref={emblaRef}>
                <div className="flex h-full">
                    {slides.map((slide, index) => (
                        <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full">
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover object-center"
                                priority={index === 0}
                            />

                            {/* Make the whole slide clickable since it's just an image */}
                            <Link href={slide.link} className="absolute inset-0 z-10" title={slide.title} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Transition Gradient (Subtle) */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50/80 to-transparent z-20 pointer-events-none" />

            {/* Navigation Controls */}
            <div className="absolute bottom-8 right-8 z-30 flex gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white/20 border-white/40 text-white hover:bg-white hover:text-blue-900 h-12 w-12"
                    onClick={scrollPrev}
                    aria-label="Slide sebelumnya"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white/20 border-white/40 text-white hover:bg-white hover:text-blue-900 h-12 w-12"
                    onClick={scrollNext}
                    aria-label="Slide berikutnya"
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`h-2.5 rounded-full transition-all duration-300 ${selectedIndex === index ? "w-8 bg-orange-500" : "w-2.5 bg-white/50"
                            }`}
                        onClick={() => emblaApi?.scrollTo(index)}
                        aria-label={`Buka slide ${index + 1}`}
                        aria-current={selectedIndex === index ? "true" : "false"}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSlider;
