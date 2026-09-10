'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Download, TrendingUp, Gamepad2, Smartphone, Home, Menu, X, Database, Tag } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`, { scroll: false });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0D1117]/95 backdrop-blur-md border-b border-[#374151]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[64px]">
          {/* Brand Logo */}
          <Link href="/" scroll={false} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-[6px] bg-[#5FED83] flex items-center justify-center text-[#0D1117] font-bold shadow-sm transition-transform group-hover:scale-105">
              <Download className="w-5 h-5 text-[#0D1117] stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-tight">
                AstraMod
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-[#0D1117] bg-[#5FED83] px-2 py-0.5 rounded-full border border-[#31C55B]">
                MOD STORE
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-6 relative">
            <input
              type="text"
              placeholder="Cari Game MOD, App Premium..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1F2328] text-white placeholder-[#8B949E] text-sm rounded-[6px] pl-10 pr-4 py-2 border border-[#374151] focus:outline-none focus:border-[#5FED83] transition"
            />
            <Search className="w-4 h-4 text-[#8B949E] absolute left-3.5 top-2.5" />
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium">
            <Link href="/" scroll={false} className="px-2.5 py-1.5 rounded-[6px] text-slate-200 hover:text-[#5FED83] hover:bg-[#161B22] transition flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-[#5FED83]" />
              <span>Beranda</span>
            </Link>
            <Link href="/?tab=popular" scroll={false} className="px-2.5 py-1.5 rounded-[6px] text-slate-200 hover:text-[#5FED83] hover:bg-[#161B22] transition flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Populer</span>
            </Link>
            <Link href="/?tab=categories" scroll={false} className="px-2.5 py-1.5 rounded-[6px] text-slate-200 hover:text-[#5FED83] hover:bg-[#161B22] transition flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#A2DAFF]" />
              <span>Kategori</span>
            </Link>
            <Link href="/?type=game" scroll={false} className="px-2.5 py-1.5 rounded-[6px] text-slate-200 hover:text-[#5FED83] hover:bg-[#161B22] transition flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-[#5FED83]" />
              <span>Game MOD</span>
            </Link>
            <Link href="/?type=app" scroll={false} className="px-2.5 py-1.5 rounded-[6px] text-slate-200 hover:text-[#5FED83] hover:bg-[#161B22] transition flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#A2DAFF]" />
              <span>Aplikasi</span>
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-[6px] text-[#8B949E] hover:text-white hover:bg-[#161B22] focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#374151] bg-[#161B22] px-4 pt-3 pb-5 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Cari Game MOD..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1F2328] text-white placeholder-[#8B949E] text-sm rounded-[6px] pl-9 pr-4 py-2 border border-[#374151] focus:outline-none focus:border-[#5FED83]"
            />
            <Search className="w-4 h-4 text-[#8B949E] absolute left-3 top-2.5" />
          </form>

          <div className="flex flex-col gap-1 pt-1 text-xs">
            <Link
              href="/"
              scroll={false}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-[6px] text-white hover:bg-[#1F2328] flex items-center gap-2"
            >
              <Home className="w-4 h-4 text-[#5FED83]" /> Beranda
            </Link>
            <Link
              href="/?tab=popular"
              scroll={false}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-[6px] text-white hover:bg-[#1F2328] flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-amber-400" /> Populer
            </Link>
            <Link
              href="/?tab=categories"
              scroll={false}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-[6px] text-white hover:bg-[#1F2328] flex items-center gap-2"
            >
              <Tag className="w-4 h-4 text-[#A2DAFF]" /> Kategori
            </Link>
            <Link
              href="/?type=game"
              scroll={false}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-[6px] text-white hover:bg-[#1F2328] flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4 text-[#5FED83]" /> Game MOD
            </Link>
            <Link
              href="/?type=app"
              scroll={false}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-[6px] text-white hover:bg-[#1F2328] flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-[#A2DAFF]" /> Aplikasi Premium
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
