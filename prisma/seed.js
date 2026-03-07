const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    // Seed admin user (for dashboard login)
    const adminEmail = "admin@gramedia-mitra.co.id";
    const adminPlainPassword = "Admin123!";

    const adminPasswordHash = await bcrypt.hash(adminPlainPassword, 10);

    await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            name: "Administrator",
            email: adminEmail,
            password: adminPasswordHash,
            image: null,
        },
    });

    // Clear existing data
    await prisma.news.deleteMany({});
    await prisma.event.deleteMany({});

    // Seed News
    const news = [
        {
            title: "Gramedia Rayakan HUT ke-55 dengan Semangat Transformasi Digital",
            description: "Memasuki usia ke-55, Gramedia berkomitmen terus menghadirkan inovasi literasi bagi masyarakat Indonesia.",
            content: "Jakarta, 2 Februari 2025 - Gramedia merayakan hari jadinya yang ke-55 dengan tema 'Inspirasi Tak Terbatas'. Dalam perayaan ini, Gramedia menegaskan komitmennya untuk melakukan transformasi digital melalui platform Gramedia Digital dan pengembangan ekosistem SmartLib untuk sekolah dan institusi. CEO Gramedia menyatakan bahwa literasi harus tetap relevan dengan perkembangan teknologi masa kini.",
            image: "/images/ASET HOME/WhatsApp Image 2026-01-23 at 15.33.43 (1).jpeg",
            category: "Korporat",
            author: "Humas Gramedia",
            date: new Date('2025-02-02'),
        },
        {
            title: "Kolaborasi Gramedia dan Sekolah untuk Peningkatan Literasi Nasional",
            description: "Program kemitraan strategis Gramedia Academy dalam mendukung kurikulum merdeka di berbagai sekolah.",
            content: "Gramedia terus memperluas jangkauan kerja samanya dengan lembaga pendidikan di seluruh Indonesia. Melalui Gramedia Academy, para guru diberikan pelatihan intensif untuk memanfaatkan alat peraga edukasi dan teknologi SmartLib dalam proses belajar mengajar. Hal ini selaras dengan visi pemerintah dalam memperkuat literasi dan numerasi di tingkat sekolah dasar hingga menengah.",
            image: "/images/ASET HOME/WhatsApp Image 2026-01-23 at 15.33.43.jpeg",
            category: "Edukasi",
            author: "Admin Gramedia",
            date: new Date('2025-02-15'),
        },
        {
            title: "Gramedia Writers & Readers Festival Kembali Hadir Tahun Ini",
            description: "Ajang pertemuan penulis dan pembaca terbesar di Indonesia akan diselenggarakan di Jakarta.",
            content: "Festival yang paling ditunggu-tunggu oleh para pencinta buku, Gramedia Writers & Readers Festival (GWRF), akan kembali digelar pada pertengahan tahun ini. Menghadirkan puluhan penulis nasional dan internasional, festival ini bertujuan untuk membangun komunitas literasi yang lebih aktif dan dinamis.",
            image: "/images/ASET HOME/WhatsApp Image 2026-01-23 at 15.33.43 (1).jpeg",
            category: "Event",
            author: "Tim GWRF",
            date: new Date('2025-03-01'),
        }
    ];

    for (const n of news) {
        await prisma.news.create({ data: n });
    }

    // Seed Events
    const events = [
        {
            title: "Webinar Sapa Sekolah Eps. Januari 2026",
            description: "Webinar pendidikan untuk meningkatkan kompetensi guru dan tenaga pendidik di seluruh Indonesia.",
            content: "Webinar ini merupakan bagian dari rangkaian inisiatif Sapa Sekolah yang diadakan secara rutin. Fokus utama bulan ini adalah implementasi metode pembelajaran inovatif menggunakan media digital. Peserta akan mendapatkan e-sertifikat dan akses ke materi eksklusif dari pakar pendidikan Gramedia.",
            image: "/images/ASET HOME/WhatsApp Image 2026-01-23 at 15.33.40.jpeg",
            date: new Date('2026-01-23'),
            location: "Zoom Meeting / Online",
            type: "Past",
            link: "https://gramedia.id/events/sapasekolah",
        },
        {
            title: "Liga Matematika Season III 2026",
            description: "Kompetisi Matematika tingkat nasional untuk siswa SD hingga SMA/MA",
            content: "Liga Matematika Gramedia kembali hadir di tahun 2026 untuk mencari talenta-talenta terbaik di bidang sains. Kompetisi ini diadakan secara berjenjang dari babak penyisihan wilayah hingga final nasional di Jakarta. Total hadiah mencapai ratusan juta rupiah beserta beasiswa pendidikan.",
            image: "/images/ASET HOME/WhatsApp Image 2026-01-06 at 16.47.12.jpeg",
            date: new Date('2026-02-15'),
            location: "Gedung Kompas Gramedia, Jakarta",
            type: "Upcoming",
            link: "https://gramedia.id/events/ligamatematika",
        }
    ];

    for (const e of events) {
        await prisma.event.create({ data: e });
    }

    console.log("Seeding finished. Admin login:");
    console.log(`Email   : ${adminEmail}`);
    console.log(`Password: ${adminPlainPassword}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
