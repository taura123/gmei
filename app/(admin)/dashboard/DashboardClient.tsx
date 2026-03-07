"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Package, Calendar, Users, TrendingUp, Clock,
    ChevronRight, ChevronLeft, Calendar as CalendarIcon,
    RefreshCw, PieChart, Activity as ActivityIcon, CheckCircle2,
    BarChart3, MousePointer2, Layers, Mail, AlertCircle,
    Globe, Smartphone, Laptop, Monitor, Globe2
} from "lucide-react";
import axios from "axios";
import Link from "next/link";

interface StatGroup {
    products: number;
    news: number;
    events: number;
    total: number;
    unreadContacts?: number;
}

interface DashboardStats {
    filtered: StatGroup;
    absolute: StatGroup;
    insights: {
        categories: Array<{ category: string, _count: { _all: number } }>;
        growth7d: number;
    };
}

interface Activity {
    id: string;
    action: string;
    target: string;
    details: string;
    createdAt: string;
}

interface TimelineEvent {
    id: string;
    title: string;
    date: string;
}

const formatDate = (date: Date, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) => {
    return new Intl.DateTimeFormat('id-ID', options).format(date);
};

const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(date);
};

export default function DashboardClient() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [focusedChartItem, setFocusedChartItem] = useState<string | null>(null);

    // Analytics State
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);
    const [analyticsError, setAnalyticsError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchData = async (date: Date) => {
        try {
            setLoading(true);
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);

            const response = await axios.get(`/api/dashboard/stats?start=${start.toISOString()}&end=${end.toISOString()}`);
            setStats(response.data.stats);
            setActivities(response.data.activities || []);
            setTimeline(response.data.timeline || []);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            setAnalyticsLoading(true);
            setAnalyticsError(null);
            const response = await axios.get("/api/dashboard/analytics");
            if (response.data.error && !response.data.configured) {
                setAnalyticsError("Google Analytics not configured in .env");
            } else if (response.data.error) {
                setAnalyticsError(response.data.error);
            } else {
                setAnalyticsData(response.data);
            }
        } catch (error) {
            console.error("Analytics Fetch Error:", error);
            setAnalyticsError("Failed to connect to Google Analytics");
        } finally {
            setAnalyticsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(selectedDate);
        fetchAnalytics();
    }, [selectedDate]);

    const handlePrevDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - 1);
        setSelectedDate(d);
    };

    const handleNextDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + 1);
        setSelectedDate(d);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData(selectedDate);
        fetchAnalytics();
    };

    const statItems = stats?.absolute ? [
        { label: "Total Properti Produk", value: stats.absolute.products || 0, icon: <Package className="h-6 w-6" />, trend: "Terintegrasi", color: "text-blue-600", bg: "bg-blue-50", link: "/dashboard/products" },
        { label: "Total Berita GMEI", value: stats.absolute.news || 0, icon: <Users className="h-6 w-6" />, trend: "Aktual", color: "text-indigo-600", bg: "bg-indigo-50", link: "/dashboard/news" },
        { label: "Total Event Terdaftar", value: stats.absolute.events || 0, icon: <Calendar className="h-6 w-6" />, trend: "Sistem", color: "text-emerald-600", bg: "bg-emerald-50", link: "/dashboard/events" },
        {
            label: "Pesan Baru (Inbox)",
            value: stats.absolute.unreadContacts || 0,
            icon: <Mail className="h-6 w-6" />,
            trend: (stats.absolute.unreadContacts || 0) > 0 ? "Butuh Respon" : "Selesai",
            color: (stats.absolute.unreadContacts || 0) > 0 ? "text-pink-600" : "text-slate-400",
            bg: (stats.absolute.unreadContacts || 0) > 0 ? "bg-pink-50" : "bg-slate-50",
            link: "/dashboard/inbox"
        },
    ] : [];

    const distributionData = useMemo(() => {
        if (!stats?.filtered) return [
            { label: "Produk", value: 0, color: "#3B82F6", percent: 0 },
            { label: "Berita", value: 0, color: "#6366F1", percent: 0 },
            { label: "Event", value: 0, color: "#10B981", percent: 0 },
        ];

        const data = stats.filtered;
        const total = data.total || 1;

        return [
            { label: "Produk", value: data.products, color: "#3B82F6", percent: (data.products / total) * 100 },
            { label: "Berita", value: data.news, color: "#6366F1", percent: (data.news / total) * 100 },
            { label: "Event", value: data.events, color: "#10B981", percent: (data.events / total) * 100 },
        ];
    }, [stats]);

    const absoluteDistributionData = useMemo(() => {
        if (!stats?.absolute) return [
            { label: "Produk", value: 0, color: "#3B82F6", percent: 0 },
            { label: "Berita", value: 0, color: "#6366F1", percent: 0 },
            { label: "Event", value: 0, color: "#10B981", percent: 0 },
        ];

        const data = stats.absolute;
        const total = data.total || 1;

        return [
            { label: "Produk", value: data.products, color: "#3B82F6", percent: (data.products / total) * 100 },
            { label: "Berita", value: data.news, color: "#6366F1", percent: (data.news / total) * 100 },
            { label: "Event", value: data.events, color: "#10B981", percent: (data.events / total) * 100 },
        ];
    }, [stats]);

    return (
        <div className="p-4 sm:p-8 lg:p-12 space-y-8 lg:space-y-10 max-w-[1600px] mx-auto" suppressHydrationWarning>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-slate-500 font-medium">Monitoring Seluruh Aset & Konten Real-time.</p>
                    </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            className={`p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-all ${refreshing ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw className="h-5 w-5 text-slate-500" />
                        </button>
                    </div>

                    <div className="bg-white px-4 sm:px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-start">
                        <button onClick={handlePrevDay} className="p-1 hover:bg-slate-50 rounded-lg transition-colors">
                            <ChevronLeft className="h-5 w-5 text-slate-400" />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <CalendarIcon className="h-5 w-5" />
                            </div>
                            <div className="min-w-[150px]">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">DATA PER TANGGAL</p>
                                <p className="text-sm font-bold text-slate-900">
                                    {mounted ? formatDate(selectedDate, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : "..."}
                                </p>
                            </div>
                        </div>
                        <button onClick={handleNextDay} className="p-1 hover:bg-slate-50 rounded-lg transition-colors">
                            <ChevronRight className="h-5 w-5 text-slate-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid (Absolute Totals) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {loading && !stats ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className="h-44 bg-white rounded-[2.5rem] animate-pulse shadow-sm border border-slate-100" />
                    ))
                ) : (
                    statItems.map((stat, idx) => (
                        <Link href={stat.link} key={idx}>
                            <Card className="group rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden hover:scale-[1.02] transition-all duration-500 bg-white text-slate-900 h-full">
                                <CardContent className="p-8 relative">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className={`p-4 rounded-[1.5rem] ${stat.bg} ${stat.color} transition-transform group-hover:rotate-12 duration-500`}>
                                            {stat.icon}
                                        </div>
                                        <div className={`flex items-center text-[10px] font-black px-3 py-1 rounded-full ${stat.trend === 'Butuh Respon' ? 'bg-pink-100 text-pink-600 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                                            {stat.trend}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                                        <h3 className="text-4xl font-black text-slate-900 leading-none">{stat.value}</h3>
                                    </div>
                                    <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`} />
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>

            {/* Visual Analytics Row (Temporal) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Donut Chart Card */}
                <Card className="rounded-[2.5rem] sm:rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 p-6 sm:p-10 bg-white text-slate-900">
                    <CardHeader className="p-0 mb-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                                <PieChart className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Status Progres Aset</CardTitle>
                        </div>
                    </CardHeader>
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="relative w-48 h-48 flex-shrink-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                {distributionData.map((d, i) => {
                                    let offset = 0;
                                    for (let j = 0; j < i; j++) offset += distributionData[j].percent;
                                    return (
                                        <circle
                                            key={i}
                                            cx="50" cy="50" r="40"
                                            fill="transparent"
                                            stroke={d.color}
                                            strokeWidth="12"
                                            strokeDasharray={`${d.percent * 2.51} 251.2`}
                                            strokeDashoffset={`-${offset * 2.51}`}
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    );
                                })}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">TOTAL</p>
                                <p className="text-2xl font-black text-slate-900">
                                    {stats?.filtered?.total || 0}
                                </p>
                            </div>
                        </div>
                        <div className="flex-grow w-full space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">DISTRIBUSI PER {mounted ? formatDate(selectedDate, { month: 'short', day: 'numeric' }).toUpperCase() : "..."}</p>
                            {distributionData.map((d, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-lg hover:shadow-slate-100 transition-all group cursor-default">
                                    <div className="flex items-center gap-3">
                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                                        <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{d.label}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-slate-400">{d.percent.toFixed(1)}%</span>
                                        <span className="text-sm font-black text-slate-900">{d.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Content Pulse Comparison Bar Chart */}
                <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 p-10 bg-white text-slate-900 group/chart overflow-hidden relative">
                    <CardHeader className="p-0 mb-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <BarChart3 className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Total Distribusi Sistem</CardTitle>
                        </div>
                    </CardHeader>

                    <div className="space-y-10 relative z-10">
                        {absoluteDistributionData.map((d, i) => {
                            const isFocused = focusedChartItem === d.label;
                            const maxVal = Math.max(...absoluteDistributionData.map(item => item.value)) || 1;
                            const barWidth = (d.value / maxVal) * 100;

                            return (
                                <div
                                    key={i}
                                    className="space-y-3 cursor-pointer group"
                                    onMouseEnter={() => setFocusedChartItem(d.label)}
                                    onMouseLeave={() => setFocusedChartItem(null)}
                                    onClick={() => setFocusedChartItem(isFocused ? null : d.label)}
                                >
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isFocused ? 'text-slate-900' : 'text-slate-400'} transition-colors`}>{d.label}</span>
                                        </div>
                                        <span className={`text-lg font-black ${isFocused ? 'text-slate-900 scale-110' : 'text-slate-400'} transition-all duration-300`}>
                                            {d.value} <span className="text-[10px] font-bold">ENTRI</span>
                                        </span>
                                    </div>
                                    <div className="h-10 w-full bg-slate-50 rounded-2xl overflow-hidden relative p-1">
                                        <div
                                            className="h-full rounded-xl transition-all duration-1000 ease-out relative"
                                            style={{
                                                width: `${loading ? 0 : barWidth}%`,
                                                backgroundColor: d.color,
                                                opacity: focusedChartItem && !isFocused ? 0.3 : 1,
                                                boxShadow: isFocused ? `0 0 20px -5px ${d.color}` : 'none'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* Web Traffic Insights (Real-Time GA4) */}
            <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 p-10 bg-white text-slate-900 overflow-hidden relative">
                {analyticsLoading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center gap-4">
                        <div className="p-4 bg-blue-50 rounded-3xl animate-bounce">
                            <Globe className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Syncing GA4 Live Data...</p>
                    </div>
                )}

                <CardHeader className="p-0 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <Globe className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Real-Time Web Audience</CardTitle>
                            <div className="flex items-center gap-2">
                                <span className={`h-1.5 w-1.5 rounded-full ${analyticsError ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {analyticsError ? analyticsError : 'DATA TERHUBUNG KE GOOGLE ANALYTICS'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Weekly Views</p>
                            <p className="text-xl font-black text-emerald-600">{analyticsData?.totals?.pageViews || 0}</p>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-100 flex items-center">
                            <button className="px-4 py-2 bg-white shadow-sm rounded-xl text-[10px] font-black uppercase text-blue-600 ring-1 ring-slate-100">LAST 7 DAYS</button>
                        </div>
                    </div>
                </CardHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Traffic Source */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Traffic Sources</h4>
                        <div className="space-y-4">
                            {analyticsData?.sources ? (
                                Object.entries(analyticsData.sources).slice(0, 4).map(([label, value]: [string, any], i) => {
                                    const total = Object.values(analyticsData.sources).reduce((a: any, b: any) => a + b, 0) as number;
                                    const percent = ((value / total) * 100).toFixed(0);
                                    const colors = ["bg-blue-600", "bg-purple-500", "bg-emerald-500", "bg-orange-500"];
                                    return (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span className="text-slate-500 capitalize">{label.replace("(direct)", "Direct")}</span>
                                                <span className="text-slate-900">{percent}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                                <div className={`h-full ${colors[i % colors.length]} rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }} />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-slate-400 italic">Menunggu data GA4...</p>
                            )}
                        </div>
                    </div>

                    {/* Device Distribution */}
                    <div className="space-y-8 flex flex-col justify-center border-x border-slate-50 px-0 md:px-12">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Device Category</h4>
                        <div className="flex justify-around items-end h-32 gap-4">
                            {[
                                { key: "mobile", icon: <Smartphone />, label: "Mobile" },
                                { key: "desktop", icon: <Monitor />, label: "Desktop" },
                                { key: "tablet", icon: <Laptop />, label: "Tablet" }
                            ].map((dev, i) => {
                                const val = analyticsData?.devices?.[dev.key] || 0;
                                const total = analyticsData?.devices ?
                                    Object.values(analyticsData.devices).reduce((a: any, b: any) => a + b, 0) as number : 1;
                                const percent = (val / total) * 100;

                                return (
                                    <div key={i} className="flex flex-col items-center gap-3 flex-1 h-full justify-end">
                                        <div className="w-full bg-blue-50 rounded-t-2xl relative group overflow-hidden transition-all duration-1000" style={{ height: `${Math.max(percent, 5)}%` }}>
                                            <div className="absolute inset-0 bg-blue-600 opacity-20 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-600">{percent.toFixed(0)}%</div>
                                        </div>
                                        <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
                                            {dev.icon}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Geo Insights */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Top Cities (Activity)</h4>
                        <div className="space-y-4">
                            {analyticsData?.cities ? (
                                Object.entries(analyticsData.cities).slice(0, 3).map(([city, count]: [string, any], i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                                                <Globe2 className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{city}</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-400">{count} ACT.</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 opacity-30 italic flex flex-col items-center gap-2">
                                    <Globe2 className="h-8 w-8" />
                                    <p className="text-[10px] uppercase font-bold">No cities detected</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-sm font-black text-slate-900 leading-none">Status Koneksi Analitik Terverifikasi</p>
                            <p className="text-[11px] text-slate-400 font-medium">Data diperbarui secara real-time dari properti GA4 GMEI.</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchAnalytics}
                        disabled={analyticsLoading}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${analyticsLoading ? 'animate-spin' : ''}`} /> SINKRONISASI SEKARANG
                    </button>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 p-10 bg-white text-slate-900">
                    <CardHeader className="p-0 mb-10 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <Clock className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Log Aktivitas Terbaru</CardTitle>
                        </div>
                    </CardHeader>
                    <div className="space-y-8 max-h-[600px] overflow-y-auto pr-4 scrollbar-hide">
                        {loading && activities.length === 0 ? (
                            <div className="space-y-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex gap-6">
                                        <div className="h-4 w-4 rounded-full bg-slate-100 mt-1" />
                                        <div className="flex-grow space-y-2">
                                            <div className="h-4 w-1/3 bg-slate-50 rounded" />
                                            <div className="h-4 w-full bg-slate-50 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : activities.length > 0 ? (
                            activities.map((activity, idx) => (
                                <div key={activity.id} className="flex gap-6 items-start group">
                                    <div className="relative mt-1">
                                        <div className={`h-4 w-4 rounded-full ring-4 transition-all duration-500 group-hover:scale-125 ${activity.action === "DELETE" ? 'bg-red-500 ring-red-50' : activity.action === "CREATE" ? 'bg-emerald-500 ring-emerald-50' : 'bg-blue-600 ring-blue-50'}`} />
                                        {idx !== activities.length - 1 && (
                                            <div className="absolute top-4 left-1/2 -translate-x-1/2 h-16 w-0.5 bg-slate-100" />
                                        )}
                                    </div>
                                    <div className="flex-grow space-y-2 p-5 rounded-3xl bg-slate-50 group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-bold text-slate-900">{activity.details}</p>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                {mounted ? formatTime(new Date(activity.createdAt)) : "..."} WIB
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${activity.action === "DELETE" ? 'bg-red-50 text-red-600' : activity.action === "CREATE" ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {activity.action}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Sektor: {activity.target}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 opacity-30 italic flex flex-col items-center gap-4 border-2 border-dashed border-slate-100 rounded-[3rem]">
                                <Clock className="h-12 w-12" />
                                Tidak ada rekaman aktivitas untuk tanggal pemilihan.
                            </div>
                        )}
                    </div>
                </Card>

                {/* Smart Insights Panel */}
                <Card className="rounded-[3rem] bg-slate-900 p-10 text-white overflow-hidden relative group">
                    <div className="relative z-10 space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 text-blue-400 rounded-2xl">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight">Laporan Sistem</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Growth Insight */}
                            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <ActivityIcon className="h-5 w-5 text-emerald-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tren Pertumbuhan</span>
                                </div>
                                <p className="text-sm font-medium text-slate-300 leading-relaxed">
                                    Aset digital Anda meningkat sebanyak <span className="text-white font-bold">{stats?.insights?.growth7d || 0} item</span> dalam 7 hari terakhir. Performa sinkronisasi optimal.
                                </p>
                            </div>

                            {/* Category Focus */}
                            {stats?.insights?.categories && stats.insights.categories.length > 0 && (
                                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Layers className="h-5 w-5 text-blue-400" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fokus Konten</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-300 leading-relaxed">
                                        Kategori <span className="text-white font-bold">"{stats.insights.categories[0].category}"</span> memiliki aset terbanyak ({stats.insights.categories[0]._count._all} item). Pertimbangkan untuk diversifikasi ke kategori lain.
                                    </p>
                                </div>
                            )}

                            {/* Unread Messages Insight */}
                            {(stats?.absolute.unreadContacts || 0) > 0 && (
                                <div className="p-8 rounded-[2.5rem] bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <AlertCircle className="h-5 w-5 text-pink-400" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-300">Pesan Masuk Baru</span>
                                    </div>
                                    <p className="text-sm font-medium text-pink-50 leading-relaxed">
                                        Ada {stats?.absolute.unreadContacts} pesan baru yang membutuhkan tanggapan segera di Inbox.
                                    </p>
                                    <Link href="/dashboard/inbox" className="inline-block mt-4 text-xs font-black uppercase tracking-widest text-pink-400 hover:text-white transition-colors">
                                        Lihat Inbox &rarr;
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Rekomendasi Konten</p>
                                <p className="text-lg font-bold leading-relaxed">
                                    {stats?.insights?.growth7d && stats.insights.growth7d > 10
                                        ? "Kecepatan update data sangat baik. Semua aset digital Anda dalam kondisi up-to-date."
                                        : "Tingkatkan variasi konten pendidikan untuk menjaga keterikatan pengguna bulan ini."}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
