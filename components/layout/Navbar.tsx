"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Lock, Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const rawPathname = usePathname();
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setMounted(true);
    setPathname(rawPathname || "");
  }, [rawPathname]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Tentang Kami", href: "/about" },
    { name: "Produk", href: "/products" },
    { name: "Event & Berita", href: "/events" },
    { name: "Kontak", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-[1440px] mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 mr-4">
          <div className="relative h-12 w-40 md:h-14 md:w-48">
            <Image
              src="/images/LOGO/LOGO GMEI (1).png"
              alt="Gramedia Mitra Edukasi Indonesia"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-6 xl:gap-12 lg:flex flex-1 justify-center px-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[15px] font-semibold transition-colors whitespace-nowrap ${pathname === link.href ? "text-blue-600" : "text-[#4A4A8E] hover:text-blue-600"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Search & Login */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 shrink-0 ml-4">
          <form onSubmit={handleSearch} className="relative w-44 xl:w-64" suppressHydrationWarning>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="h-4 w-4 text-[#2D3181]" />
            </div>
            <input
              type="text"
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-full border-2 border-[#2D3181] bg-white text-slate-900 focus:outline-none focus:border-[#F58220] transition-colors text-sm"
              suppressHydrationWarning
            />
          </form>
          <Link href="/login">
            <Button className="rounded-xl bg-[#1E4198] hover:bg-[#163073] px-5 h-10 flex items-center gap-2 shadow-[0_2px_10px_rgba(30,65,152,0.3)] transition-all active:scale-95 border-b-2 border-[#0D2154] shrink-0">
              <div className="bg-white/20 p-1 rounded-md">
                <Lock className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold tracking-wider text-[13px]">LOGIN</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-[#2D3181] hover:bg-slate-50 rounded-xl transition-colors active:scale-90"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-20 z-40 bg-white lg:hidden overflow-y-auto"
          >
            <div className="p-6 space-y-8 flex flex-col h-[calc(100vh-80px)]">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative w-full" suppressHydrationWarning>
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari produk atau informasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-base"
                  suppressHydrationWarning
                />
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Navigasi Utama</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${pathname === link.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    <span className="text-base font-bold">{link.name}</span>
                    <ChevronRight className={`h-5 w-5 ${pathname === link.href ? "text-blue-600" : "text-slate-300"}`} />
                  </Link>
                ))}
              </div>

              {/* Mobile Login Button */}
              <div className="mt-auto pt-6 border-t border-slate-100">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full rounded-2xl bg-[#1E4198] hover:bg-[#163073] h-14 flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98] border-b-4 border-[#0D2154]">
                    <div className="bg-white/20 p-1.5 rounded-lg">
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold tracking-widest text-base">MASUK KE DASHBOARD</span>
                  </Button>
                </Link>
                <p className="text-center text-slate-400 text-xs mt-6 font-medium">
                  © 2026 Gramedia Mitra Edukasi Indonesia
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav >
  );
};

export default Navbar;
