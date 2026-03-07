"use client";

import { useState, useEffect } from "react";
import {
    Mail,
    Search,
    Filter,
    Trash2,
    CheckCircle,
    Clock,
    User,
    MessageSquare,
    ChevronRight,
    MoreHorizontal,
    AlertCircle,
    Loader2,
    RefreshCw,
    X as XMark,
    FileSpreadsheet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { exportData, ExportFormat } from "@/lib/export-utils";
import { logActivity } from "@/lib/activity-client";

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: "UNREAD" | "READ" | "REPLIED";
    createdAt: string;
}

export default function InboxClient() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [refreshing, setRefreshing] = useState(false);
    const [exportFormat, setExportFormat] = useState<ExportFormat>("CSV");

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/contact");
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await axios.patch(`/api/contact/${id}`, { status: "READ" });
            setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "READ" as const } : m));
            if (selectedMessage?.id === id) {
                setSelectedMessage(prev => prev ? { ...prev, status: "READ" as const } : null);
            }
            // Trigger update event for notification counters in other components
            window.dispatchEvent(new CustomEvent("unread-updated"));
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus pesan ini permanen?")) return;
        try {
            await axios.delete(`/api/contact/${id}`);
            setMessages(prev => prev.filter(m => m.id !== id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
            // Trigger update event
            window.dispatchEvent(new CustomEvent("unread-updated"));
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    const filteredMessages = messages.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "ALL" || m.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const unreadCount = messages.filter(m => m.status === "UNREAD").length;

    const handleExport = () => {
        const headers = [
            { key: "name", label: "Nama Pengirim" },
            { key: "email", label: "Email" },
            { key: "subject", label: "Subjek" },
            { key: "message", label: "Pesan" },
            { key: "status", label: "Status" },
            { key: "createdAt", label: "Tanggal Masuk" },
        ];
        exportData(filteredMessages, headers, "Inbox_Pesan_GMEI", exportFormat);

        // Log activity
        logActivity(
            "EXPORT",
            "INBOX",
            `mengekspor ${filteredMessages.length} pesan di inbox ke format ${exportFormat}.`
        );
    };

    return (
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Mail className="h-8 w-8 text-blue-600" />
                        Inbox Pesan
                    </h1>
                    <p className="text-slate-500 font-medium">Kelola pesan dan pertanyaan dari pelanggan.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl font-black text-sm border border-blue-100 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {unreadCount} Pesan Belum Dibaca
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => { setRefreshing(true); fetchMessages(); }}
                        disabled={refreshing}
                        className="rounded-xl border-slate-200"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </Button>
                    <div className="flex items-center bg-emerald-50 rounded-2xl p-1 border border-emerald-100 h-10 shadow-sm">
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value as any)}
                            className="bg-transparent border-none text-emerald-700 font-bold text-[10px] uppercase tracking-wider px-3 focus:ring-0 outline-none cursor-pointer"
                        >
                            <option value="CSV">CSV</option>
                            <option value="XLSX">EXCEL (.xlsx)</option>
                            <option value="PDF">PDF REPORT</option>
                        </select>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-bold text-xs h-8 shadow-lg shadow-emerald-100"
                        >
                            <FileSpreadsheet className="h-4 w-4" />
                            EKSPOR
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* LIST */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden bg-white">
                        <CardHeader className="border-b border-slate-50 p-6">
                            <div className="flex flex-col md:flex-row gap-4 justify-between">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Cari nama, email, atau subjek..."
                                        className="pl-11 h-12 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-600/20 font-medium"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={filterStatus === "ALL" ? "default" : "outline"}
                                        onClick={() => setFilterStatus("ALL")}
                                        className="rounded-xl font-bold h-11 px-4"
                                    >
                                        Semua
                                    </Button>
                                    <Button
                                        variant={filterStatus === "UNREAD" ? "default" : "outline"}
                                        onClick={() => setFilterStatus("UNREAD")}
                                        className={`rounded-xl font-bold h-11 px-4 ${filterStatus === "UNREAD" ? 'bg-blue-600' : 'text-slate-600'}`}
                                    >
                                        Belum Dibaca
                                    </Button>
                                    <Button
                                        variant={filterStatus === "READ" ? "default" : "outline"}
                                        onClick={() => setFilterStatus("READ")}
                                        className="rounded-xl font-bold h-11 px-4"
                                    >
                                        Dibaca
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading && (
                                <div className="p-20 text-center space-y-4">
                                    <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Memuat Pesan...</p>
                                </div>
                            )}

                            {!loading && filteredMessages.length === 0 && (
                                <div className="p-20 text-center space-y-6">
                                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                        <Mail className="h-10 w-10 text-slate-200" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-slate-900">Inbox Kosong</h3>
                                        <p className="text-slate-400 font-medium italic">Tidak ada pesan yang sesuai dengan kriteria.</p>
                                    </div>
                                </div>
                            )}

                            {!loading && filteredMessages.map((m) => (
                                <div
                                    key={m.id}
                                    onClick={() => {
                                        setSelectedMessage(m);
                                        if (m.status === "UNREAD") handleMarkAsRead(m.id);
                                    }}
                                    className={`group flex items-center gap-3 sm:gap-6 p-4 sm:p-6 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50/50 ${selectedMessage?.id === m.id ? 'bg-blue-50/30' : ''}`}
                                >
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all ${m.status === 'UNREAD' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                        <User className="h-5 w-5" />
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className={`font-black truncate ${m.status === 'UNREAD' ? 'text-slate-900' : 'text-slate-500'}`}>
                                                {m.name}
                                            </h4>
                                            <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
                                                {format(new Date(m.createdAt), "dd MMM yyyy", { locale: id })}
                                            </span>
                                        </div>
                                        <p className={`text-sm truncate ${m.status === 'UNREAD' ? 'text-slate-800 font-bold' : 'text-slate-500 font-medium'}`}>
                                            {m.subject}
                                        </p>
                                        <p className="text-xs text-slate-400 line-clamp-1 italic font-medium">
                                            {m.message}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <ChevronRight className="h-4 w-4 text-slate-300" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* DETAIL */}
                <div className="lg:col-span-12 xl:col-span-5">
                    <AnimatePresence mode="wait">
                        {selectedMessage ? (
                            <motion.div
                                key={selectedMessage.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <Card className="rounded-[2rem] sm:rounded-[2.5rem] border-slate-100 shadow-2xl overflow-hidden bg-white sticky top-6">
                                    <div className="h-2 bg-blue-600 w-full" />
                                    <CardHeader className="p-8 pb-4">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="space-y-1">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase ${selectedMessage.status === 'UNREAD' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400'}`}>
                                                    {selectedMessage.status === 'UNREAD' ? 'BELUM DIBACA' : 'DIBACA'}
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-slate-400 hover:bg-slate-50 rounded-full h-8 w-8"
                                                onClick={() => setSelectedMessage(null)}
                                            >
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2 italic">
                                            {selectedMessage.subject}
                                        </h2>
                                        <div className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                                            <Clock className="h-4 w-4 text-blue-500" />
                                            {format(new Date(selectedMessage.createdAt), "eeee, dd MMMM yyyy (HH:mm)", { locale: id })}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-6 space-y-10">
                                        <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 border border-slate-100">
                                            <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                                                <User className="h-7 w-7" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <h4 className="font-black text-slate-900">{selectedMessage.name}</h4>
                                                <p className="text-sm text-slate-500 font-bold underline decoration-blue-200 underline-offset-4">{selectedMessage.email}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                <MessageSquare className="h-3 w-3" /> ISI PESAN
                                            </div>
                                            <div className="p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 text-slate-700 leading-relaxed font-medium">
                                                {selectedMessage.message}
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-6 border-t border-slate-50">
                                            <a
                                                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                                className="flex-1"
                                            >
                                                <Button className="w-full h-14 rounded-2xl bg-[#1E4198] hover:bg-[#F58220] transition-all font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-100">
                                                    Balas via Email
                                                </Button>
                                            </a>
                                            <Button
                                                variant="outline"
                                                className="h-14 rounded-2xl border-slate-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-black uppercase text-xs tracking-widest flex items-center gap-2"
                                                onClick={() => handleDelete(selectedMessage.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-6 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                                <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                                    <MessageSquare className="h-10 w-10 text-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-bold text-slate-400">Pilih Pesan</h4>
                                    <p className="text-sm text-slate-300 font-medium">Klik salah satu pesan di daftar untuk melihat detail lengkap.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
