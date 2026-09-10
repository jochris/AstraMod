'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Download, ShieldCheck, Gamepad2, Smartphone, Sparkles, Menu, X, Database } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Download className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-300 to-white bg-clip-text text-transparent">
                AstraMod
              </span>
              <span className="hidden sm:inline-block ml-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                100% MODS
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Cari Game MOD, Aplikasi Premium..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-400 text-sm rounded-full pl-10 pr-4 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link href="/" className="px-3 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-900 transition flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Beranda</span>
            </Link>
            <Link href="/?type=game" className="px-3 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-900 transition flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span>Games</span>
            </Link>
            <Link href="/?type=app" className="px-3 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-900 transition flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Aplikasi</span>
            </Link>
            <Link href="/admin" className="ml-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition flex items-center gap-1.5 font-semibold text-xs">
              <Database className="w-3.5 h-3.5" />
              <span>Dashboard Admin</span>
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Cari Game MOD..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 text-slate-100 placeholder-slate-400 text-sm rounded-lg pl-9 pr-4 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <div className="flex flex-col gap-1 pt-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" /> Beranda
            </Link>
            <Link
              href="/?type=game"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900 flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4 text-cyan-400" /> Game MOD
            </Link>
            <Link
              href="/?type=app"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900 flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" /> Aplikasi Premium
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 flex items-center gap-2 font-medium"
            >
              <Database className="w-4 h-4" /> Dashboard Admin & Scraper
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
