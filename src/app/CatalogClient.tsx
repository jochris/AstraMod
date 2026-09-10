'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppCard from '@/components/AppCard';
import Link from 'next/link';
import {
  Home,
  TrendingUp,
  LayoutGrid,
  Cpu,
  Gamepad2,
  Smartphone,
  ShieldCheck,
  Zap,
  Tag,
  Search,
  CheckCircle2,
  HelpCircle,
  Database,
  ArrowRight,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { AppItem } from '@/lib/db';

interface CatalogClientProps {
  initialApps: AppItem[];
  initialCategories: { name: string; count: number }[];
  searchParam?: string;
  categoryParam?: string;
  typeParam?: string;
  tabParam?: string;
}

export default function CatalogClient({
  initialApps,
  initialCategories,
  searchParam,
  categoryParam,
  typeParam,
  tabParam,
}: CatalogClientProps) {
  const [allApps, setAllApps] = useState<AppItem[]>(initialApps);
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // In-memory tab/filter state (prevents viewport scroll-jump on click)
  const [activeTab, setActiveTab] = useState<string>(
    tabParam || (categoryParam ? 'categories' : searchParam ? 'search' : 'home')
  );
  const [activeType, setActiveType] = useState<string>(typeParam || 'all');
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || 'All');

  // Sync state if URL searchParam changes
  useEffect(() => {
    if (searchParam) {
      setActiveTab('search');
    }
  }, [searchParam]);

  useEffect(() => {
    async function fetchApps() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchParam) params.set('search', searchParam);

        const res = await fetch(`/api/apps?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setAllApps(data.data || []);
          if (data.categories) {
            setCategories(data.categories);
          }
        }
      } catch (err) {
        console.error('Failed to fetch catalog apps:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, [searchParam]);

  // In-memory smooth tab / filter handler (No scroll jump)
  const handleTabSelect = (tab: string, type: string = 'all', cat: string = 'All') => {
    setActiveTab(tab);
    setActiveType(type);
    setActiveCategory(cat);

    const params = new URLSearchParams();
    if (tab && tab !== 'home' && tab !== 'search') params.set('tab', tab);
    if (type && type !== 'all') params.set('type', type);
    if (cat && cat !== 'All') params.set('category', cat);

    const queryStr = params.toString();
    const newUrl = queryStr ? `/?${queryStr}` : '/';
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', newUrl);
    }
  };

  // Compute filtered apps dynamically in-memory
  const getFilteredApps = () => {
    let list = [...allApps];

    if (activeCategory !== 'All') {
      list = list.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (activeType !== 'all') {
      list = list.filter(a => a.appType === activeType);
    }

    if (activeTab === 'popular') {
      list.sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0));
    }

    return list;
  };

  const filteredApps = getFilteredApps();
  const featuredApps = allApps.filter(a => a.isFeatured === 1).slice(0, 4);
  const popularApps = [...allApps].sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0)).slice(0, 8);
  const gameApps = allApps.filter(a => a.appType === 'game').slice(0, 8);
  const appPremium = allApps.filter(a => a.appType === 'app').slice(0, 8);

  const faqs = [
    {
      q: 'Apa itu AstraMod Store?',
      a: 'AstraMod adalah platform penyedia file MOD APK terverifikasi 100% working dengan server cepat terpercaya. Anda dapat mendownload file APK langsung dari server kami tanpa iklan pop-up atau pengalihan external.',
    },
    {
      q: 'Apakah semua file MOD APK di AstraMod aman dari virus?',
      a: 'Ya! Setiap file yang disajikan melalui AstraMod dipindai terlebih dahulu menggunakan scanner antivirus multi-engine. File disajikan secara bersih tanpa modifikasi iklan jahat.',
    },
    {
      q: 'Mengapa unduhan di AstraMod langsung tanpa redirect?',
      a: 'AstraMod menggunakan rute streaming proxy internal yang secara otomatis menamai file dengan format [AstraMod]_[NamaApp]_v[Versi].apk dan mengirimkannya langsung ke browser Anda.',
    },
    {
      q: 'Bagaimana cara memasang (install) file APK MOD di HP Android?',
      a: 'Download file APK dari AstraMod, buka file manager di Android, izinkan "Install dari Sumber Tidak Dikenal" (Unknown Sources) pada pengaturan keamanan HP Anda, lalu tekan install hingga selesai.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* LANDING PAGE HERO SECTION */}
        {!searchParam && activeCategory === 'All' && activeTab === 'home' && (
          <section className="relative rounded-[12px] bg-[#161B22] border border-[#374151] p-8 sm:p-12 mb-10 overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-3xl">
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F2328] border border-[#374151] text-[#5FED83] text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#5FED83]" /> 100% Working MODs
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F2328] border border-[#374151] text-[#A2DAFF] text-xs font-semibold">
                  <Zap className="w-4 h-4 text-[#A2DAFF]" /> Server Cepat Teruji
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F2328] border border-[#374151] text-amber-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> Tanpa Pengalihan Iklan
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.1] mb-4">
                AstraMod Store — <span className="text-[#5FED83]">MOD APK</span> Catalog & Server Cepat
              </h1>
              <p className="text-base sm:text-lg text-[#8B949E] leading-relaxed max-w-2xl">
                Platform resmi penyedia game MOD dan aplikasi premium gratis terlengkap dengan server unduhan langsung berkecepatan tinggi tanpa batasan kuota.
              </p>

              {/* Quick Hero Search Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="mt-6 flex items-center max-w-lg relative"
              >
                <input
                  type="text"
                  placeholder="Ketik nama game atau app (contoh: Minecraft, GTA, Spotify)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1F2328] text-white placeholder-[#8B949E] text-sm rounded-[6px] pl-10 pr-28 py-3.5 border border-[#374151] focus:outline-none focus:border-[#5FED83]"
                />
                <Search className="w-4 h-4 text-[#8B949E] absolute left-3.5 top-4" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 h-[38px] px-4 rounded-[4px] bg-[#5FED83] hover:bg-[#31C55B] text-[#0D1117] font-semibold text-xs transition"
                >
                  Cari MOD
                </button>
              </form>

              {/* Stats Bar */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#374151] text-xs">
                <div>
                  <span className="text-[#8B949E] block">Total Application</span>
                  <span className="text-xl font-bold text-white mt-0.5 block">{allApps.length}+ MODs</span>
                </div>
                <div>
                  <span className="text-[#8B949E] block">Status Keamanan</span>
                  <span className="text-xl font-bold text-[#5FED83] mt-0.5 block flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-[#5FED83]" /> Verified
                  </span>
                </div>
                <div>
                  <span className="text-[#8B949E] block">Kecepatan Unduh</span>
                  <span className="text-xl font-bold text-[#A2DAFF] mt-0.5 block">High Speed</span>
                </div>
                <div>
                  <span className="text-[#8B949E] block">Pembaruan</span>
                  <span className="text-xl font-bold text-amber-400 mt-0.5 block">Harian (Auto)</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* IN-PAGE SMOOTH NAVIGATION TABS (No viewport jump) */}
        <section id="catalog-section" className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#374151] text-sm font-medium">
            <button
              onClick={() => handleTabSelect('home', 'all', 'All')}
              className={`px-4 py-2.5 rounded-t-[6px] border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'home' && activeType === 'all' && activeCategory === 'All'
                  ? 'border-[#5FED83] text-[#5FED83] bg-[#161B22]'
                  : 'border-transparent text-[#8B949E] hover:text-white'
              }`}
            >
              <Home className="w-4 h-4 text-[#5FED83]" /> Beranda
            </button>

            <button
              onClick={() => handleTabSelect('popular', 'all', 'All')}
              className={`px-4 py-2.5 rounded-t-[6px] border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'popular'
                  ? 'border-[#5FED83] text-[#5FED83] bg-[#161B22]'
                  : 'border-transparent text-[#8B949E] hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-amber-400" /> Populer
            </button>

            <button
              onClick={() => handleTabSelect('games', 'game', 'All')}
              className={`px-4 py-2.5 rounded-t-[6px] border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeType === 'game'
                  ? 'border-[#5FED83] text-[#5FED83] bg-[#161B22]'
                  : 'border-transparent text-[#8B949E] hover:text-white'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-[#5FED83]" /> Game MOD
            </button>

            <button
              onClick={() => handleTabSelect('apps', 'app', 'All')}
              className={`px-4 py-2.5 rounded-t-[6px] border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeType === 'app'
                  ? 'border-[#5FED83] text-[#5FED83] bg-[#161B22]'
                  : 'border-transparent text-[#8B949E] hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#A2DAFF]" /> Aplikasi Premium
            </button>

            <button
              onClick={() => handleTabSelect('categories', 'all', 'All')}
              className={`px-4 py-2.5 rounded-t-[6px] border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'border-[#5FED83] text-[#5FED83] bg-[#161B22]'
                  : 'border-transparent text-[#8B949E] hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4 text-[#A2DAFF]" /> Kategori ({categories.length})
            </button>
          </div>
        </section>

        {/* CATEGORIES GRID VIEW (If activeTab === 'categories') */}
        {activeTab === 'categories' && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#A2DAFF]" /> Semua Kategori MOD
              </h2>
              <span className="text-xs text-[#8B949E]">Pilih kategori untuk memfilter</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleTabSelect('categories', activeType, cat.name)}
                  className={`border rounded-[8px] p-4 transition flex items-center justify-between group text-left ${
                    activeCategory.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-[#1F2328] border-[#5FED83] text-[#5FED83]'
                      : 'bg-[#161B22] border-[#374151] hover:border-[#5FED83]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[6px] bg-[#0D1117] border border-[#374151] flex items-center justify-center text-[#5FED83]">
                      <Layers className="w-4 h-4 text-[#5FED83]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-[#5FED83] transition">
                        {cat.name}
                      </h4>
                      <span className="text-[11px] text-[#8B949E]">{cat.count} Aplikasi</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8B949E] group-hover:text-[#5FED83] transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* CATEGORIES PILLS BAR */}
        <section className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            <button
              onClick={() => handleTabSelect(activeTab, activeType, 'All')}
              className={`px-3 py-1.5 rounded-full border whitespace-nowrap transition ${
                activeCategory === 'All'
                  ? 'bg-[#5FED83] text-[#0D1117] border-[#31C55B] font-semibold'
                  : 'bg-[#161B22] text-[#8B949E] border-[#374151] hover:text-white'
              }`}
            >
              Semua Kategori
            </button>

            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleTabSelect(activeTab, activeType, cat.name)}
                className={`px-3 py-1.5 rounded-full border whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-[#5FED83] text-[#0D1117] border-[#31C55B] font-semibold'
                    : 'bg-[#161B22] text-[#8B949E] border-[#374151] hover:text-white hover:border-[#8B949E]'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-80 px-1.5 py-0.2 rounded-full bg-[#1F2328]">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* DYNAMIC CATALOG GRID */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                {searchParam ? (
                  <>Hasil Pencarian: &ldquo;{searchParam}&rdquo;</>
                ) : activeTab === 'popular' ? (
                  <><TrendingUp className="w-5 h-5 text-amber-400" /> MOD Paling Populer</>
                ) : activeType === 'game' ? (
                  <><Gamepad2 className="w-5 h-5 text-[#5FED83]" /> Game MOD Terpopuler</>
                ) : activeType === 'app' ? (
                  <><Smartphone className="w-5 h-5 text-[#A2DAFF]" /> Aplikasi Premium Unlocked</>
                ) : activeCategory !== 'All' ? (
                  <><Tag className="w-5 h-5 text-[#A2DAFF]" /> Kategori: {activeCategory}</>
                ) : (
                  <><LayoutGrid className="w-5 h-5 text-[#5FED83]" /> Katalog Utama MOD</>
                )}
              </h2>
              <p className="text-xs text-[#8B949E] mt-1">
                Menampilkan {filteredApps.length} aplikasi modifikasi.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-[#5FED83] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-[#8B949E] text-xs">Memuat katalog AstraMod...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-16 bg-[#161B22] rounded-[8px] border border-[#374151]">
              <p className="text-[#8B949E] text-sm">Tidak ada aplikasi yang cocok dengan kriteria ini.</p>
              <button
                onClick={() => handleTabSelect('home', 'all', 'All')}
                className="mt-4 inline-block text-xs text-[#A2DAFF] hover:underline font-medium"
              >
                Tampilkan Semua Aplikasi
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </section>

        {/* WHY ASTRAMOD / FEATURES SHOWCASE */}
        {!searchParam && activeCategory === 'All' && activeTab === 'home' && (
          <section className="mb-16">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl font-semibold text-white">Mengapa Memilih AstraMod Store?</h2>
              <p className="text-xs text-[#8B949E] mt-1">
                Platform penyedia MOD APK modern dengan standar keamanan dan kenyamanan unduhan tertinggi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#161B22] border border-[#374151] p-5 rounded-[8px]">
                <div className="w-10 h-10 rounded-[6px] bg-[#0D1117] border border-[#374151] flex items-center justify-center text-[#5FED83] mb-3">
                  <ShieldCheck className="w-5 h-5 text-[#5FED83]" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">100% Bebas Virus</h3>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  Semua file APK dipindai oleh sistem pemindai malware multi-engine sebelum dipublikasikan.
                </p>
              </div>

              <div className="bg-[#161B22] border border-[#374151] p-5 rounded-[8px]">
                <div className="w-10 h-10 rounded-[6px] bg-[#0D1117] border border-[#374151] flex items-center justify-center text-[#A2DAFF] mb-3">
                  <Zap className="w-5 h-5 text-[#A2DAFF]" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Unduhan Server Cepat</h3>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  File diunduh secara langsung tanpa iklan pop-up atau pengalihan ke situs luar.
                </p>
              </div>

              <div className="bg-[#161B22] border border-[#374151] p-5 rounded-[8px]">
                <div className="w-10 h-10 rounded-[6px] bg-[#0D1117] border border-[#374151] flex items-center justify-center text-[#5FED83] mb-3">
                  <Database className="w-5 h-5 text-[#5FED83]" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Cloud NeonDB Postgres</h3>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  Database berbasis Cloud Postgres NeonDB untuk akses data instan dan terpusat.
                </p>
              </div>

              <div className="bg-[#161B22] border border-[#374151] p-5 rounded-[8px]">
                <div className="w-10 h-10 rounded-[6px] bg-[#0D1117] border border-[#374151] flex items-center justify-center text-amber-400 mb-3">
                  <Cpu className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Auto Scraper & IndexNow</h3>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  Pembaruan data otomatis dari AstraMod Engine serta pengindeksan instan Bing/Yandex.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* FAQ ACCORDION SECTION */}
        {!searchParam && activeCategory === 'All' && activeTab === 'home' && (
          <section className="mb-12 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-white flex items-center justify-center gap-2">
                <HelpCircle className="w-6 h-6 text-[#5FED83]" /> Pertanyaan Sering Diajukan (FAQ)
              </h2>
              <p className="text-xs text-[#8B949E] mt-1">
                Informasi seputar penggunaan, keamanan, dan unduhan MOD APK di AstraMod.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-[#161B22] border border-[#374151] rounded-[8px] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-[#5FED83] transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8B949E] transition-transform ${
                        openFaq === idx ? 'rotate-180 text-[#5FED83]' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#8B949E] leading-relaxed border-t border-[#374151]/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
