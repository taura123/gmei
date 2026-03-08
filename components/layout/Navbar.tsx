"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, Lock, Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

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

  const navLinks = useMemo(() => [
    { name: "Home", href: "/" },
    { name: "Tentang Kami", href: "/about" },
    { name: "Produk", href: "/products" },
    { name: "Event & Berita", href: "/events" },
    { name: "Kontak", href: "/contact" },
  ], []);

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Menu Overlay - Pure CSS + Fixed Position for 100% Reliability */}
      <div
        id="mobile-menu-overlay"
        className="fixed inset-0 lg:hidden"
        style={{
          display: isMenuOpen ? 'flex' : 'none',
          zIndex: 999999,
          backgroundColor: '#FFFFFF',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw'
        }}
      >
        {/* Mobile Menu Header */}
        <div className="flex h-16 md:h-20 items-center justify-between px-4 md:px-6 border-b bg-white shrink-0">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <div className="relative h-10 w-32 md:h-12 md:w-40">
              <Image src="/images/LOGO/LOGO GMEI (1).png" alt="Logo" fill className="object-contain" priority />
            </div>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-[#2D3181] bg-slate-50 rounded-xl active:scale-90 transition-transform"
            aria-label="Close Menu"
          >
            <X className="h-8 w-8" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-10 bg-white">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative w-full group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Cari produk atau informasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-14 pr-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#1E4198] focus:bg-white transition-all text-lg shadow-sm"
            />
          </form>

          {/* Navigation Links */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Menu Navigasi</p>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-between p-5 rounded-2xl transition-all ${pathname === link.href
                    ? "bg-[#1E4198] text-white shadow-lg"
                    : "text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                  }`}
              >
                <span className="text-xl font-bold">{link.name}</span>
                <ChevronRight className={`h-5 w-5 ${pathname === link.href ? "text-white" : "text-slate-300"}`} />
              </Link>
            ))}
          </div>

          {/* Admin Login */}
          <div className="pt-8 border-t border-slate-100 mt-auto">
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#1E4198] to-[#2D3181] text-white font-bold text-lg flex items-center justify-center gap-4 shadow-xl active:scale-[0.98] transition-all border-none">
                <Lock className="h-6 w-6" />
                ADMIN DASHBOARD
              </Button>
            </Link>
          </div>

          {/* Footer Info */}
          <div className="text-center py-6">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Gramedia Mitra Edukasi Indonesia</p>
            <p className="text-[9px] text-slate-300 mt-1">© 2026 • v2.0.14 Final Fix</p>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] w-full border-b bg-white shadow-sm h-16 md:h-20 flex items-center">
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between px-4 md:px-6 lg:px-12">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <div className="relative h-10 w-32 md:h-14 md:w-48">
              <Image src="/images/LOGO/LOGO GMEI (1).png" alt="Logo" fill className="object-contain" priority />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center px-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] font-semibold transition-colors hover:text-blue-600 ${pathname === link.href ? "text-blue-600" : "text-[#4A4A8E]"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Search & Login */}
            <div className="hidden lg:flex items-center gap-6">
              <form onSubmit={handleSearch} className="relative w-44 xl:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D3181]" />
                <input
                  type="text"
                  placeholder="Cari..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-4 rounded-full border-2 border-[#2D3181] focus:outline-none focus:border-[#F58220] transition-colors text-sm"
                />
              </form>
              <Link href="/login">
                <Button className="rounded-xl bg-[#1E4198] hover:bg-[#163073] px-5 h-10 flex items-center gap-3 text-white font-bold text-[13px] shadow-lg active:scale-95 transition-all outline-none border-none">
                  <Lock className="h-4 w-4" />
                  LOGIN
                </Button>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-[#2D3181] hover:bg-slate-50 rounded-xl transition-all active:scale-90 relative z-[110]"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8 text-[#2D3181]" />}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
