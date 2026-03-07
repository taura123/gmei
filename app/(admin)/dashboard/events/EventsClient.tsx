"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Plus, Search, Edit2, Trash2, Calendar, Filter, MapPin,
    CheckCircle2, Clock, X, ImageIcon, Type, Link as LinkIcon,
    AlignLeft, Loader2, Upload
} from "lucide-react";

export default function EventsClient() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Upcoming" | "Past">("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Upload State
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        location: "",
        description: "",
        content: "",
        image: "",
        link: ""
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/events");
            const data = await res.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setEvents([]);
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
        if (!confirm("Apakah Anda yakin ingin menghapus event ini?")) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchEvents();
            } else {
                alert("Gagal menghapus event.");
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
            const url = editingId ? `/api/events/${editingId}` : "/api/events";
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
                    date: "",
                    location: "",
                    description: "",
                    content: "",
                    image: "",
                    link: ""
                });
                fetchEvents();
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

    const handleEdit = (event: any) => {
        // Format ISO date to YYYY-MM-DD for input[type="date"]
        const formattedDate = event.date ? new Date(event.date).toISOString().split('T')[0] : "";

        setFormData({
            title: event.title || "",
            date: formattedDate,
            location: event.location || "",
            description: event.description || "",
            content: event.content || "",
            image: event.image || "",
            link: event.link || ""
        });
        setEditingId(event.id);
        setIsModalOpen(true);
    };

    const filteredEvents = events.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.location?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || e.type === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-8 lg:p-12 space-y-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-emerald-600" />
                        Kelola Event & Agenda
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">Manajemen sinkronisasi dan status agenda pendidikan GMEI.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={fetchEvents}
                        variant="outline"
                        className="rounded-2xl border-slate-200 h-12 px-6 font-bold hover:bg-slate-50 transition-all active:scale-95"
                    >
                        REFRESH SYNC
                    </Button>
                    <Button
                        onClick={() => {
                            setEditingId(null);
                            setFormData({
                                title: "", date: "", location: "", description: "", content: "", image: "", link: ""
                            });
                            setIsModalOpen(true);
                        }}
                        className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 h-12 px-6 font-bold shadow-xl shadow-emerald-500/20 transition-all active:scale-95 text-white border-none"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        CREATE EVENT
                    </Button>
                </div>
            </div>

            {/* List Control */}
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 overflow-hidden bg-white">
                <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6">
                        <div className="relative flex-1 w-full max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder="Cari nama event atau lokasi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700 font-medium placeholder:text-slate-400 transition-all"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto bg-slate-50/50 p-2 rounded-[1.5rem] border border-slate-100">
                            {(["All", "Upcoming", "Past"] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter === status
                                        ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100'
                                        : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {status === "All" ? "SEMUA" : status === "Upcoming" ? "MENDATANG" : "BERLALU"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-3xl border border-slate-100">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 text-slate-500">
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Detail Event</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Waktu & Lokasi</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Status Tipe</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="h-8 w-8 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin" />
                                                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Menyinkronkan Data Terkini...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredEvents.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-40">
                                                <Calendar className="h-12 w-12 text-slate-300" />
                                                <span className="text-slate-500 font-medium text-lg">Tidak ada event yang sesuai filter.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEvents.map((event) => (
                                        <tr key={event.id} className={`hover:bg-slate-50/30 transition-all duration-300 group ${event.type === 'Past' ? 'opacity-80' : ''}`}>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-14 w-14 rounded-2xl flex-shrink-0 relative overflow-hidden ring-1 transition-all ${event.type === "Upcoming" ? 'bg-slate-100 ring-slate-100 group-hover:ring-emerald-100' : 'bg-slate-50 ring-slate-100 grayscale opacity-60'
                                                        }`}>
                                                        {event.image ? (
                                                            <img src={event.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-black text-xs uppercase">
                                                                EVNT
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`font-black uppercase tracking-tight transition-colors ${event.type === 'Upcoming' ? 'text-slate-900 group-hover:text-emerald-700' : 'text-slate-500'
                                                                }`}>{event.title}</span>
                                                            {event.isExternal && (
                                                                <span className="bg-blue-50 text-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded-md border border-blue-100">EXTERNAL</span>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {event.id.slice(0, 8)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`font-bold flex items-center gap-2 ${event.type === 'Upcoming' ? 'text-slate-700' : 'text-slate-400'}`}>
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(event.date).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                                                    </span>
                                                    <span className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                                                        <MapPin className="h-3 w-3 opacity-40" />
                                                        {event.location || 'Online / Nasional'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all inline-block w-max ${event.type === 'Upcoming'
                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                        : 'bg-slate-100 text-slate-500 border-slate-200'
                                                        }`}>
                                                        {event.type === 'Upcoming' ? 'UPCOMING' : 'PAST EVENT'}
                                                    </span>
                                                    {event.type === 'Upcoming' ? (
                                                        <span className="text-[8px] font-black text-emerald-500/60 uppercase tracking-widest ml-1 flex items-center gap-1">
                                                            <Clock className="h-2 w-2" /> AKTIF
                                                        </span>
                                                    ) : (
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                                            <CheckCircle2 className="h-2 w-2" /> SELESAI
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleEdit(event)}
                                                        className="h-10 w-10 rounded-xl border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-white transition-all"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        disabled={deletingId === event.id}
                                                        onClick={() => handleDelete(event.id)}
                                                        className="h-10 w-10 rounded-xl border-slate-200 text-rose-500 hover:text-white hover:bg-rose-600 hover:border-rose-600 transition-all"
                                                    >
                                                        {deletingId === event.id ? (
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

            {/* CREATE EVENT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-2xl rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white max-h-[90vh] flex flex-col">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                    {editingId ? 'Edit Event' : 'Buat Event Baru'}
                                </h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                        <Type className="h-3 w-3" /> Nama / Judul Event
                                    </label>
                                    <Input
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Contoh: Webinar Kurikulum Merdeka 2026"
                                        className="h-12 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                            <Clock className="h-3 w-3" /> Tanggal Pelaksanaan
                                        </label>
                                        <Input
                                            required
                                            type="date"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            className="h-12 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                            <MapPin className="h-3 w-3" /> Lokasi / Platform
                                        </label>
                                        <Input
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="Contoh: Zoom Meeting / Jakarta"
                                            className="h-12 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                        <ImageIcon className="h-3 w-3" /> Gambar Cover Event
                                    </label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative h-40 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-emerald-300 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group"
                                    >
                                        {formData.image ? (
                                            <>
                                                <img src={formData.image} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white font-black text-xs uppercase tracking-widest">Ganti Gambar</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-emerald-500 transition-colors">
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
                                        <LinkIcon className="h-3 w-3" /> Link Registrasi (Eksternal)
                                    </label>
                                    <Input
                                        value={formData.link}
                                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                                        placeholder="https://link-registrasi.id"
                                        className="h-12 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                        <AlignLeft className="h-3 w-3" /> Deskripsi Singkat
                                    </label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        placeholder="Berikan ringkasan singkat mengenai event ini..."
                                        className="w-full rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-700 p-4 min-h-[100px]"
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
                                    className="flex-[2] h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xl shadow-emerald-500/20 border-none"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    ) : (
                                        editingId ? <Edit2 className="h-4 w-4 mr-2" /> : <Plus className="h-5 w-5 mr-2" />
                                    )}
                                    {editingId ? 'SIMPAN PERUBAHAN' : 'SIMPAN & AKTIFKAN EVENT'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
