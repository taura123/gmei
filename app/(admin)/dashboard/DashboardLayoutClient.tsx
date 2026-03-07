"use client";

import Link from "next/link";
import { Package, Calendar, FileText, LayoutDashboard, LogOut, Settings, Users, Bell, Mail, Menu, X } from "lucide-react";
import NotificationBadge from "@/components/ui/NotificationBadge";
import AdminNotifications from "@/components/ui/AdminNotifications";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardLayoutClientProps {
    children: React.ReactNode;
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | undefined;
}

interface SidebarContentProps {
    pathname: string;
    user: DashboardLayoutClientProps["user"];
    navLinks: any[];
    onSignOut: () => void;
}

const SidebarContent = ({ pathname, user, navLinks, onSignOut }: SidebarContentProps) => (
    <div className="flex flex-col h-full bg-[#1E293B]">
        {/* Branding */}
        <div className="p-8 mb-6">
            <div className="relative h-12 w-full">
                <Image
                    src="/images/LOGO/LOGO GMEI (1).png"
                    alt="GMEI Admin"
                    fill
                    className="object-contain filter brightness-0 invert"
                />
            </div>
            <div className="mt-4 flex items-center gap-2 px-1">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">SISTEM ADMINISTRASI</span>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
            <div className="pb-4 px-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Menu</span>
            </div>
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl group transition-all duration-300 ${pathname === link.href ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                >
                    <link.icon className={`h-5 w-5 transition-colors ${pathname === link.href ? "text-blue-400" : "text-slate-400 " + link.color}`} />
                    <span className="font-semibold text-[14px] flex-1">{link.label}</span>
                    {link.badge && <NotificationBadge />}
                </Link>
            ))}
        </nav>

        {/* User Profile / Logout */}
        <div className="p-6 mt-auto">
            <div className="bg-white/5 rounded-[2rem] p-4 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-black overflow-hidden relative">
                        {user?.image ? (
                            <img src={user.image} alt="" className="object-cover w-full h-full" />
                        ) : (
                            user?.name?.substring(0, 2).toUpperCase() || "AD"
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{user?.name || "Administrator"}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Super Admin</p>
                    </div>
                </div>
                <button
                    onClick={onSignOut}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-red-400 rounded-xl hover:bg-red-500 hover:text-white font-bold text-xs transition-all duration-300"
                >
                    <LogOut className="h-4 w-4" />
                    LOGOUT SESSION
                </button>
            </div>
        </div>
    </div>
);

export default function DashboardLayoutClient({
    children,
    user,
}: DashboardLayoutClientProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close menu on navigation
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard, color: "group-hover:text-blue-400" },
        { href: "/dashboard/products", label: "Kelola Produk", icon: Package, color: "group-hover:text-amber-400" },
        { href: "/dashboard/events", label: "Kelola Event", icon: Calendar, color: "group-hover:text-emerald-400" },
        { href: "/dashboard/news", label: "Kelola Berita", icon: FileText, color: "group-hover:text-purple-400" },
        { href: "/dashboard/inbox", label: "Inbox Pesan", icon: Mail, color: "group-hover:text-pink-400", badge: true },
        { href: "/dashboard/users", label: "Manajemen User", icon: Users, color: "group-hover:text-slate-200" },
    ];

    const handleSignOut = () => signOut({ callbackUrl: "/login" });

    return (
        <div className="flex min-h-screen bg-white font-sans overflow-hidden relative">
            {/* Desktop Sidebar */}
            <aside className="w-72 border-r border-slate-800 hidden lg:flex lg:flex-col sticky top-0 h-screen shadow-2xl z-40 bg-[#1E293B]">
                {mounted && (
                    <SidebarContent pathname={pathname} user={user} navLinks={navLinks} onSignOut={handleSignOut} />
                )}
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Dashboard Topbar */}
                {mounted ? (
                    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between z-30 shrink-0">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="lg:hidden p-2 text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-95 flex items-center justify-center"
                                aria-label="Open mobile menu"
                            >
                                <Menu className="h-6 w-6 pointer-events-none" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="relative h-8 w-28 sm:w-32 lg:hidden">
                                    <Image
                                        src="/images/LOGO/LOGO GMEI (1).png"
                                        alt="GMEI"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="hidden lg:block relative w-96 font-medium text-slate-400 text-sm">
                                    E-Commerce & Content Management System v2.0
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <AdminNotifications />
                            <div className="w-[1px] h-6 bg-slate-200 mx-1 sm:mx-2" />
                            <div className="flex items-center gap-3 pl-1 sm:pl-2">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-bold text-slate-900">{user?.name || "User"}</p>
                                    <p className="text-[10px] text-blue-600 font-black uppercase">Online</p>
                                </div>
                                <div className="h-10 w-10 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative transition-transform hover:scale-105">
                                    {user?.image ? (
                                        <img src={user.image} alt="" className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-600 font-black text-xs">
                                            {user?.name?.substring(0, 2).toUpperCase() || "JD"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>
                ) : (
                    <div className="h-20 bg-white/80 border-b border-slate-200 shrink-0" />
                )}

                <main className="flex-1 overflow-y-auto bg-[#F8FAFC] relative">
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Overlay - Placed at the end of root to ensure highest stack priority */}
            <AnimatePresence mode="wait">
                {isMobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-[100]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300, velocity: 1 }}
                            className="absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-[#1E293B] shadow-2xl overflow-hidden"
                        >
                            <SidebarContent pathname={pathname} user={user} navLinks={navLinks} onSignOut={handleSignOut} />
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="absolute top-6 -right-12 p-3 bg-white rounded-full text-slate-900 shadow-2xl active:scale-90 transition-transform flex items-center justify-center"
                                aria-label="Close mobile menu"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
