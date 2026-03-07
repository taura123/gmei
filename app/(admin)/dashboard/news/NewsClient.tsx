"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Plus, Search, Edit2, Trash2, FileText, Filter, User, X,
    ImageIcon, Type, AlignLeft, Tags, Loader2, Upload
} from "lucide-react";

export default function NewsClient() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Upload State
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        category: "Info Pendidikan",
        description: "",
        content: "",
        image: ""
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/news");
            const data = await res.json();
            setNews(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setNews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Client-side validation
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            alert("❌ Tipe file tidak didukung. Gunakan PNG, JPG, WEBP, atau GIF.");
            e.target.value = "";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert(`❌ Ukuran file terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maksimum 5MB.`);
            e.target.value = "";
            return;
        }

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: uploadData
            });
            const data = await res.json();
            if (!res.ok) {
                alert(`❌ ${data.error || "Gagal mengunggah gambar."}`);
                return;
            }
            if (data.url) {
                setFormData(prev => ({ ...prev, image: data.url }));
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Gagal mengunggah gambar.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus berita ini?")) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchNews();
            } else {
                alert("Gagal menghapus berita.");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat menghapus.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = editingId ? `/api/news/${editingId}` : "/api/news";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setEditingId(null);
                setFormData({
                    title: "",
                    category: "Info Pendidikan",
                    description: "",
                    content: "",
                    image: ""
                });
                fetchNews();
            } else {
                const data = await res.json();
                alert(`Gagal: ${data.error || "Terjadi kesalahan"}`);
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (article: any) => {
        setFormData({
            title: article.title || "",
            category: article.category || "Info Pendidikan",
            description: article.description || "",
            content: article.content || "",
            image: article.image || ""
        });
        setEditingId(article.id);
        setIsModalOpen(true);
    };

    const filteredNews = news.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 lg:p-12 space-y-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <FileText className="h-6 w-6 text-purple-600" />
                        Kelola Berita & Artikel
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">Manajemen artikel, press release, dan publikasi perusahaan secara real-time.</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({
                            title: "",
                            category: "Info Pendidikan",
                            description: "",
                            content: "",
                            image: ""
                        });
                        setIsModalOpen(true);
                    }}
                    className="rounded-2xl bg-purple-600 hover:bg-purple-700 h-12 px-6 font-bold shadow-xl shadow-purple-500/20 transition-all active:scale-95 text-white border-none"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    WRITE ARTICLE
                </Button>
            </div>

            {/* List Control */}
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 overflow-hidden bg-white">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                        <div className="relative flex-1 w-full max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder="Cari judul berita atau kategori..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-purple-500/20 text-slate-700 font-medium placeholder:text-slate-400 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button variant="outline" className="h-14 px-6 rounded-2xl border-slate-100 text-slate-600 font-bold flex items-center gap-2 hover:bg-slate-50">
                                <Filter className="h-4 w-4" />
                                CATEGORY
                            </Button>
                            <div className="h-10 w-[1px] bg-slate-100 mx-2 hidden md:block" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
                                TOTAL: <span className="text-slate-900">{filteredNews.length} ARTIKEL</span>
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-3xl border border-slate-100">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 text-slate-500">
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Informasi Berita</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Author & Tanggal</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Status</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-right">Manajemen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="h-8 w-8 border-4 border-purple-600/20 border-t-purple-600 rounded-full animate-spin" />
                                                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Menyusun Data Pintar...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredNews.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-40">
                                                <FileText className="h-12 w-12 text-slate-300" />
                                                <span className="text-slate-500 font-medium text-lg">Tidak ada berita ditemukan.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredNews.map((article) => (
                                        <tr key={article.id} className="hover:bg-purple-50/30 transition-all duration-300 group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-14 w-14 rounded-2xl bg-slate-100 flex-shrink-0 relative overflow-hidden ring-1 ring-slate-100 group-hover:ring-purple-100 transition-all">
                                                        {article.image ? (
                                                            <img src={article.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-black text-xs uppercase">
                                                                NEWS
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-black text-slate-900 truncate group-hover:text-purple-700 transition-colors uppercase tracking-tight">{article.title}</span>
                                                            {article.isExternal && (
                                                                <span className="bg-blue-50 text-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded-md border border-blue-100">EXTERNAL</span>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{article.category || 'PRESS RELEASE'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-slate-700 flex items-center gap-2">
                                                        <User className="h-3 w-3 text-slate-400" />
                                                        {article.author || 'Super Admin'}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                        {new Date(article.date).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-emerald-100 shadow-sm shadow-emerald-100/50 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                                                    PUBLISHED
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-100 transition-all duration-300">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleEdit(article)}
                                                        className="h-10 w-10 rounded-xl border-slate-200 text-slate-500 hover:text-purple-600 hover:bg-white hover:shadow-lg transition-all"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        disabled={deletingId === article.id}
                                                        onClick={() => handleDelete(article.id)}
                                                        className="h-10 w-10 rounded-xl border-slate-200 text-rose-500 hover:text-white hover:bg-rose-600 hover:border-rose-600 hover:shadow-lg hover:shadow-rose-200 transition-all"
                                                    >
                                                        {deletingId === article.id ? (
                                                            <div className="h-4 w-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* WRITE ARTICLE MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-2xl rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white max-h-[90vh] flex flex-col">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                                    <Plus className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                    {editingId ? 'Edit Artikel' : 'Tulis Artikel Baru'}
                                </h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                            <Type className="h-3 w-3" /> Judul Artikel
                                        </label>
                                        <Input
                                            required
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Masukkan judul menarik..."
                                            className="h-12 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-purple-500/20 font-bold text-slate-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                            <Tags className="h-3 w-3" /> Kategori
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full h-12 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-purple-500/20 font-bold text-slate-700 px-4 appearance-none"
                                        >
                                            <option>Info Pendidikan</option>
                                            <option>Press Release</option>
                                            <option>Eksplorasi</option>
                                            <option>Berita Perusahaan</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                        <ImageIcon className="h-3 w-3" /> Gambar Cover Artikel
                                    </label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative h-40 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-purple-300 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group"
                                    >
                                        {formData.image ? (
                                            <>
                                                <img src={formData.image} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white font-black text-xs uppercase tracking-widest">Ganti Gambar</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-purple-500 transition-colors">
                                                {uploading ? (
                                                    <Loader2 className="h-8 w-8 animate-spin" />
                                                ) : (
                                                    <Upload className="h-8 w-8" />
                                                )}
                                                <span className="text-[10px] font-black uppercase tracking-widest">
                                                    {uploading ? 'Mengunggah...' : 'Klik untuk Unggah Foto'}
                                                </span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                        <AlignLeft className="h-3 w-3" /> Deskripsi Singkat
                                    </label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        rows={2}
                                        placeholder="Tulis ringkasan isi artikel..."
                                        className="w-full rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-purple-500/20 font-medium text-slate-700 p-4 min-h-[80px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                        <FileText className="h-3 w-3" /> Konten Lengkap
                                    </label>
                                    <textarea
                                        required
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        rows={6}
                                        placeholder="Tuliskan isi artikel Anda secara lengkap di sini..."
                                        className="w-full rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-purple-500/20 font-medium text-slate-700 p-4 min-h-[160px]"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 h-14 rounded-2xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50"
                                >
                                    BATAL
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || uploading}
                                    className="flex-[2] h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black shadow-xl shadow-purple-500/20 border-none"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    ) : (
                                        editingId ? <Edit2 className="h-4 w-4 mr-2" /> : <Plus className="h-5 w-5 mr-2" />
                                    )}
                                    {editingId ? 'SIMPAN PERUBAHAN' : 'PUBLIKASIKAN ARTIKEL'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
