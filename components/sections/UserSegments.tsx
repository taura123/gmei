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
        <section className="py-12 md:py-20 bg-background transition-colors duration-300">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight px-2">
                        Solusi untuk Setiap Kebutuhan
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed px-4">
                        Kami melayani berbagai segmen dalam ekosistem pendidikan dan dunia kerja.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 max-w-7xl mx-auto">
                    {segments.map((segment, index) => (
                        <div
                            key={index}
                            className={`group flex flex-col items-center text-center py-8 px-6 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-card text-card-foreground min-h-[220px] sm:min-h-[320px] md:min-h-[340px]`}
                        >
                            <div className="mb-4 md:mb-6 relative h-12 w-16 md:h-16 md:w-20 overflow-hidden transition-transform duration-500 group-hover:scale-110">
                                <Image src={segment.icon} alt={segment.title} fill className="object-contain" />
                            </div>
                            <h3 className="text-base md:text-lg font-black text-slate-900 mb-2 md:mb-3 leading-tight uppercase tracking-tight">{segment.title}</h3>
                            <p className="text-[12px] md:text-[13px] text-muted-foreground font-medium mb-5 md:mb-6 leading-relaxed line-clamp-2 md:line-clamp-none">
                                {segment.description}
                            </p>
                            <Link href={segment.link} className="mt-auto">
                                <span className="text-orange-500 font-black text-[10px] md:text-[11px] uppercase tracking-widest border-b-2 border-orange-500/30 hover:border-orange-500 transition-all pb-1">
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
