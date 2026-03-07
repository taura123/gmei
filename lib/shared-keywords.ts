// Shared GMEI keyword filtering — used by both news.ts and sync-service.ts

export const GMEI_KEYWORDS = [
    // Core Education
    "pendidikan", "kurikulum", "asesmen", "sekolah", "guru", "siswa", "murid", "belajar",
    "edukasi", "literasi", "akademik", "kbm", "pengajaran", "anbk", "merdeka", "pembelajaran",
    // Higher Ed & Careers
    "universitas", "kampus", "mahasiswa", "dosen", "beasiswa", "kelulusan", "wisuda", "pelajar",
    // Digital & Tech
    "basis", "btp", "btu", "modul", "perpustakaan", "ebook", "eperpus", "digital", "gadget",
    "teknologi", "edutech", "platform", "online", "daring", "lms", "aplikasi",
    // Events & Skills
    "webinar", "workshop", "seminar", "pelatihan", "diklat", "lomba", "kompetisi",
    "try out", "olimpiade", "pameran", "bedah buku", "guru penggerak", "unbk", "akm",
    "peluncuran buku", "penulis", "cerdas cermat", "bakat", "prestasi", "pengembangan",
    "festival", "diskusi", "temu", "pesta literasi", "gathering", "konferensi",
    "talkshow", "sharing session", "bimbingan teknis", "bimtek",
    // Institutional
    "kemendikbud", "kemenristek", "nadiem", "dinas pendidikan", "yayasan", "paud", "tk", "sd", "smp", "sma", "smk", "madrasah"
];

export function isRelevant(title: string, content: string): boolean {
    const text = (title + " " + content).toLowerCase();
    return GMEI_KEYWORDS.some(keyword => text.includes(keyword));
}
