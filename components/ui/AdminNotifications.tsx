"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Bell, Mail, Clock, RefreshCw, ChevronRight, MessageSquare, AlertCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import NotificationBadge from "./NotificationBadge";

interface NotificationItem {
    id: string;
    type: "MESSAGE" | "ACTIVITY";
    title: string;
    description: string;
    time: string;
    link: string;
    isUnread: boolean;
}

export default function AdminNotifications() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastSeenTimestamp, setLastSeenTimestamp] = useState<number>(0);
    const [isMarkingAll, setIsMarkingAll] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const unreadMessagesCount = useMemo(() => {
        return notifications.filter(n => n.type === "MESSAGE" && n.isUnread).length;
    }, [notifications]);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const [contactsRes, statsRes] = await Promise.all([
                axios.get("/api/contact"),
                axios.get("/api/dashboard/stats")
            ]);

            const unreadMessages: NotificationItem[] = contactsRes.data
                .filter((m: any) => m.status === "UNREAD")
                .slice(0, 10)
                .map((m: any) => ({
                    id: m.id,
                    type: "MESSAGE",
                    title: `Pesan Baru: ${m.name}`,
                    description: m.subject,
                    time: m.createdAt,
                    link: "/dashboard/inbox",
                    isUnread: true
                }));

            const recentActivities: NotificationItem[] = statsRes.data.activities
                .slice(0, 5)
                .map((a: any) => ({
                    id: a.id,
                    type: "ACTIVITY",
                    title: a.action === "CREATE" ? "Data Baru Dibuat" : a.action === "DELETE" ? "Data Dihapus" : "Aktivitas Sistem",
                    description: a.details,
                    time: a.createdAt,
                    link: "/dashboard",
                    isUnread: false
                }));

            const combined = [...unreadMessages, ...recentActivities].sort(
                (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
            );

            setNotifications(combined.slice(0, 8));
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        window.addEventListener("unread-updated", fetchNotifications);
        return () => {
            clearInterval(interval);
            window.removeEventListener("unread-updated", fetchNotifications);
        };
    }, [fetchNotifications]);

    // Handle Open - Mark as seen locally
    const handleToggle = () => {
        if (!isOpen) {
            setLastSeenTimestamp(Date.now());
        }
        setIsOpen(!isOpen);
    };

    const handleMarkAllRead = async () => {
        try {
            setIsMarkingAll(true);
            const unreadIds = notifications
                .filter(n => n.type === "MESSAGE" && n.isUnread)
                .map(n => n.id);

            if (unreadIds.length === 0) return;

            // Batch update via API (assuming API supports it or we loop)
            await Promise.all(unreadIds.map(id => axios.patch(`/api/contact/${id}`, { status: "READ" })));

            await fetchNotifications();
            window.dispatchEvent(new CustomEvent("unread-updated"));
        } catch (error) {
            console.error("Error marking all read:", error);
        } finally {
            setIsMarkingAll(false);
        }
    };

    // Show badge only if there are unread messages AND they are "new" since last open OR it's been closed
    // Optimization: If it's OPEN, we don't show the badge (per user request: "setelah dipencet hilang")
    const shouldShowBadge = unreadMessagesCount > 0 && !isOpen && lastSeenTimestamp === 0;

    return (
        <div className="relative">
            <button
                onClick={handleToggle}
                className={`p-2.5 rounded-full transition-all relative ${isOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
            >
                <Bell className="h-5 w-5" />
                {unreadMessagesCount > 0 && !isOpen && (
                    <NotificationBadge className="absolute -top-1 -right-1 border-2 border-white" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] border border-slate-100 z-50 overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                <div className="space-y-0.5">
                                    <h3 className="font-black text-slate-900 tracking-tight">Notifikasi</h3>
                                    {unreadMessagesCount > 0 && (
                                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{unreadMessagesCount} Pesan Baru</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    {unreadMessagesCount > 0 && (
                                        <button
                                            onClick={handleMarkAllRead}
                                            disabled={isMarkingAll}
                                            className="text-emerald-600 text-[9px] font-black uppercase tracking-widest hover:underline flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md"
                                        >
                                            {isMarkingAll ? '...' : <><Check className="h-3 w-3" /> Tandai Semua Dibaca</>}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => fetchNotifications()}
                                        className="text-slate-400 hover:text-blue-600 transition-colors"
                                    >
                                        <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                                {notifications.length === 0 && !loading ? (
                                    <div className="p-12 text-center space-y-4">
                                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                            <Bell className="h-8 w-8 text-slate-200" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-400">Belum ada notifikasi baru.</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <Link
                                            key={notif.id}
                                            href={notif.link}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex gap-4 p-5 border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${notif.isUnread ? 'bg-blue-50/20' : ''}`}
                                        >
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${notif.type === 'MESSAGE' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'}`}>
                                                {notif.type === 'MESSAGE' ? <Mail className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <p className={`text-xs font-black truncate ${notif.isUnread ? 'text-slate-900' : 'text-slate-500'}`}>
                                                        {notif.title}
                                                    </p>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase shrink-0">
                                                        {mounted ? format(new Date(notif.time), "HH:mm") : "..."}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 line-clamp-2 font-medium">
                                                    {notif.description}
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>

                            <div className="p-4 bg-slate-50/50 text-center">
                                <Link
                                    href="/dashboard/inbox"
                                    onClick={() => setIsOpen(false)}
                                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                                >
                                    Lihat Semua Pesan <ChevronRight className="inline h-3 w-3 ml-1" />
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
