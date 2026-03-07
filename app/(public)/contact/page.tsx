'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Phone,
    Mail,
    ChevronRight,
    Clock,
    Building2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import ContactForm from "@/components/sections/ContactForm";

const BranchMap = dynamic(() => import("@/components/ui/BranchMap"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-50 animate-pulse flex items-center justify-center text-slate-300 font-bold">Menyiapkan Peta...</div>
});

const branches = [
    {
        city: "Jakarta (Kantor Pusat)",
        address: "Gedung Kompas Gramedia, Jl. Palmerah Selatan No. 22-28, Gelora, Tanah Abang, Jakarta Pusat 10270",
        phone: "021 - 5481487",
        email: "mitra@gramedia.com",
        coords: [-6.2057313, 106.7972421] as [number, number]
    },
    {
        city: "Surabaya",
        address: "Jl. Rungkut Industri III No. 68, Gunung Anyar, Kota Surabaya, Jawa Timur 60293",
        phone: "031 - 8431002",
        email: "sby.mitra@gramedia.com",
        coords: [-7.331206, 112.759491] as [number, number]
    },
    {
        city: "Semarang",
        address: "Jl. MT Haryono No. 123, Purwodinatan, Kec. Semarang Tengah, Kota Semarang, Jawa Tengah 50137",
        phone: "024 - 3545011",
        email: "smg.mitra@gramedia.com",
        coords: [-6.974012, 110.428131] as [number, number]
    },
    {
        city: "Bandung",
        address: "Jl. Merdeka No. 43, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40117",
        phone: "022 - 4230110",
        email: "bdg.mitra@gramedia.com",
        coords: [-6.914744, 107.609811] as [number, number]
    },
    {
        city: "Medan",
        address: "Jl. Gajah Mada No. 23, Petisah Hulu, Kec. Medan Baru, Kota Medan, Sumatera Utara 20153",
        phone: "061 - 4515011",
        email: "mdn.mitra@gramedia.com",
        coords: [3.595196, 98.667232] as [number, number]
    },
    {
        city: "Makassar",
        address: "Jl. Mall Panakkukang, Masale, Kec. Panakkukang, Kota Makassar, Sulawesi Selatan 90231",
        phone: "0411 - 431011",
        email: "mks.mitra@gramedia.com",
        coords: [-5.155412, 119.447541] as [number, number]
    }
];

export default function ContactPage() {
    const [activeTab, setActiveTab] = useState<"pusat" | "cabang">("pusat");
    const [mapState, setMapState] = useState<{ center: [number, number]; zoom: number }>({
        center: branches[0].coords,
        zoom: 15
    });

    const focusBranch = (coords: [number, number]) => {
        setMapState({ center: coords, zoom: 17 });
        // Optional: Scroll to map if needed on mobile
    };

    return (
        <div className="bg-white min-h-screen selection:bg-blue-100 pb-20">
            <style jsx global>{`
                .leaflet-container {
                    width: 100%;
                    height: 100%;
                    border-radius: 2.5rem;
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 1rem;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
                }
                .leaflet-popup-tip {
                    display: none;
                }
            `}</style>
            <section className="relative min-h-[50vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/Kontak/WhatsApp Image 2026-01-06 at 11.46.02.jpeg"
                        alt="Contact Hero"
                        fill
                        className="object-cover scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-800/40" />
                </div>

                <div className="relative container mx-auto px-6 py-20 md:py-32 z-10">
                    <div className="max-w-3xl space-y-6 text-white">
                        <span className="inline-block px-4 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-400 text-sm font-bold tracking-[0.2em] uppercase backdrop-blur-md">
                            Hubungi Kami
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                            Solusi Pendidikan <br />
                            <span className="text-blue-400">Dalam Jangkauan Anda</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed">
                            Kami siap melayani kebutuhan pendidikan dan instansi Anda di seluruh Indonesia dengan layanan yang responsif dan terpercaya.
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
            </section>

            {/* TAB SWITCHER */}
            <div className="container mx-auto px-6 -mt-8 relative z-20">
                <div className="max-w-md mx-auto bg-white/90 backdrop-blur-md p-1.5 rounded-full flex gap-1 shadow-2xl border border-white/20">
                    <button
                        onClick={() => setActiveTab("pusat")}
                        className={`flex-1 py-3 px-6 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === "pusat"
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Kantor Pusat
                    </button>
                    <button
                        onClick={() => setActiveTab("cabang")}
                        className={`flex-1 py-3 px-6 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === "cabang"
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Kantor Cabang
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-6xl py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* LEFT SIDE: LISTS */}
                    <div className="lg:col-span-12">
                        <AnimatePresence mode="wait">
                            {activeTab === "pusat" ? (
                                <motion.div
                                    key="pusat"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-12"
                                >
                                    <div className="text-center space-y-4">
                                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Kantor Pusat Jakarta</h2>
                                    </div>

                                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <Card className="rounded-3xl border-slate-100 bg-white shadow-lg hover:shadow-xl transition-shadow group cursor-pointer" onClick={() => focusBranch(branches[0].coords)}>
                                            <CardContent className="p-6 text-center space-y-4">
                                                <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-100">
                                                    <MapPin className="h-6 w-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-black text-slate-900">Alamat</h4>
                                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                                        Jl. Palmerah Selatan No. 22-28, Jakarta Pusat
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="rounded-3xl border-slate-100 bg-white shadow-lg hover:shadow-xl transition-shadow">
                                            <CardContent className="p-6 text-center space-y-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-100">
                                                    <Phone className="h-6 w-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-black text-slate-900">Telepon</h4>
                                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                                        021 - 5481487
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="rounded-3xl border-slate-100 bg-white shadow-lg hover:shadow-xl transition-shadow">
                                            <CardContent className="p-6 text-center space-y-4">
                                                <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-100">
                                                    <Mail className="h-6 w-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-black text-slate-900">Email</h4>
                                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                                        mitra@gramedia.com
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="rounded-3xl border-slate-100 bg-white shadow-lg hover:shadow-xl transition-shadow">
                                            <CardContent className="p-6 text-center space-y-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-100">
                                                    <Clock className="h-6 w-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-black text-slate-900">Operasional</h4>
                                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                                        Senin-Jum'at | 08.00-17.00
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="cabang"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-12"
                                >
                                    <div className="text-center space-y-4">
                                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Jaringan Cabang Seluruh Indonesia</h2>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {branches.map((branch) => (
                                            <Card
                                                key={branch.city}
                                                className="h-full rounded-3xl border-slate-100 bg-white hover:border-blue-200 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                                                onClick={() => focusBranch(branch.coords)}
                                            >
                                                <CardContent className="p-8 space-y-6">
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                                        <Building2 className="h-6 w-6" />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{branch.city}</h4>
                                                        <div className="space-y-3">
                                                            <div className="flex gap-3 text-sm text-slate-500 leading-relaxed font-medium">
                                                                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                                                                {branch.address}
                                                            </div>
                                                            <div className="flex gap-3 text-sm text-slate-500 font-medium">
                                                                <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                                                                {branch.phone}
                                                            </div>
                                                            <div className="flex gap-3 text-sm text-blue-600/60 font-medium italic">
                                                                <Mail className="h-4 w-4 shrink-0" />
                                                                {branch.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* MAP SECTION */}
                    <div className="lg:col-span-12 space-y-6 mt-12">
                        <div className="flex justify-between items-center px-4">
                            <h3 className="text-2xl font-black text-slate-900">Peta Lokasi</h3>
                            <Button
                                variant="outline"
                                className="rounded-full border-blue-100 text-blue-600 font-bold px-6 hover:bg-blue-50"
                                onClick={() => setMapState({ center: [-2.548926, 118.0148634], zoom: 5 })}
                            >
                                Lihat Seluruh Indonesia
                            </Button>
                        </div>
                        <Card className="rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-2xl h-[500px] relative z-0">
                            <BranchMap
                                branches={branches}
                                activeCenter={mapState.center}
                                zoom={mapState.zoom}
                            />
                        </Card>
                    </div>
                </div>
            </div>

            {/* FORM SECTION */}
            <div className="container mx-auto px-6 max-w-5xl mt-12 mb-20">
                <div className="grid lg:grid-cols-5 gap-16 items-start">
                    <div className="lg:col-span-2 space-y-8 h-full flex flex-col justify-center">
                        <div className="space-y-4">
                            <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em]">Hubungi Kami</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight italic">
                                Mari Berkolaborasi <br />Bersama GMEI
                            </h2>
                            <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                Siap melayani pengadaan buku dan fasilitas pendidikan Anda dengan standar kualitas Gramedia.
                            </p>
                        </div>

                        <div className="space-y-6 pt-8 border-t border-slate-100">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Waktu Operasional</p>
                                    <p className="text-slate-900 font-bold">Senin - Jumat: 08:00 - 17:00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
