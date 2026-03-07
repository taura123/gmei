import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const segments = [
    {
        title: "Kepala Sekolah",
        description: "Kebutuhan barang dan perlengkapan sekolah lengkap.",
        icon: "/images/ASET HOME/JPG untuk Website/HOME_SUB MENU ICON-01.jpg",
        link: "/products",
        color: "bg-blue-50"
    },
    {
        title: "Guru",
        description: "Bahan ajar dan pelatihan pengembangan kompetensi.",
        icon: "/images/ASET HOME/JPG untuk Website/HOME_SUB MENU ICON-02.jpg",
        link: "/products",
        color: "bg-orange-50"
    },
    {
        title: "Siswa / Siswi",
        description: "Event, kompetisi, dan kegiatan edukatif menarik.",
        icon: "/images/ASET HOME/JPG untuk Website/HOME_SUB MENU ICON-03.jpg",
        link: "/products",
        color: "bg-green-50"
    },
    {
        title: "Mitra Penjualan",
        description: "Peluang bisnis dan kerjasama distribusi.",
        icon: "/images/ASET HOME/JPG untuk Website/HOME_SUB MENU ICON-04.jpg",
        link: "/contact",
        color: "bg-purple-50"
    },
    {
        title: "KLDI",
        description: "Kebutuhan barang dan perlengkapan institusi.",
        icon: "/images/ASET HOME/JPG untuk Website/HOME_SUB MENU ICON-05.jpg",
        link: "/products",
        color: "bg-slate-50"
    }
];

const UserSegments = () => {
    return (
        <section className="py-12 bg-background transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-4xl mx-auto mb-10 space-y-4">
                    <h2 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">Solusi untuk Setiap Kebutuhan</h2>
                    <p className="text-lg text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
                        Kami melayani berbagai segmen dalam ekosistem pendidikan dan dunia kerja, dengan produk serta layanan yang relevan dan adaptif terhadap kebutuhan Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
                    {segments.map((segment, index) => (
                        <div
                            key={index}
                            className={`group flex flex-col items-center text-center py-8 px-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card text-card-foreground min-h-[340px]`}
                        >
                            <div className="mb-6 relative h-16 w-20 overflow-hidden transition-transform group-hover:scale-105">
                                <Image src={segment.icon} alt={segment.title} fill className="object-contain" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-3 leading-tight">{segment.title}</h3>
                            <p className="text-[13px] text-muted-foreground font-medium mb-6 leading-relaxed">
                                {segment.description}
                            </p>
                            <Link href={segment.link} className="mt-auto">
                                <span className="text-orange-500 font-black text-[11px] uppercase tracking-wider underline underline-offset-[10px] decoration-1 hover:text-orange-600 transition-colors">
                                    Lihat Produk
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UserSegments;
