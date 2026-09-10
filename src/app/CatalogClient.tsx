'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppCard from '@/components/AppCard';
import Link from 'next/link';
import { Sparkles, Gamepad2, Smartphone, ShieldCheck, Flame, Zap } from 'lucide-react';
import { AppItem } from '@/lib/db';

interface CatalogClientProps {
  initialApps: AppItem[];
  initialCategories: { name: string; count: number }[];
  searchParam?: string;
  categoryParam?: string;
  typeParam?: string;
}

export default function CatalogClient({
  initialApps,
  initialCategories,
  searchParam,
  categoryParam,
  typeParam,
}: CatalogClientProps) {
  const [apps, setApps] = useState<AppItem[]>(initialApps);
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);

  const activeCategory = categoryParam || 'All';
  const activeType = typeParam || 'all';
  const search = searchParam || '';

  useEffect(() => {
    async function fetchApps() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (categoryParam) params.set('category', categoryParam);
        if (typeParam) params.set('type', typeParam);

        const res = await fetch(`/api/apps?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setApps(data.data || []);
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
  }, [searchParam, categoryParam, typeParam]);

  const featuredApps = apps.filter(a => a.isFeatured === 1).slice(0, 4);

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'AstraMod',
    'url': 'https://mod.astralune.cfd',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://mod.astralune.cfd/?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* Hero Section */}
        {!search && (
          <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 sm:p-10 mb-10 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-semibold mb-4">
                <ShieldCheck className="w-4 h-4" /> AstraMod Store • Direct Fast Server
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Download <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">MOD APK</span> Game & Aplikasi Terlengkap
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                Ribuan game Android dan aplikasi premium versi modifikasi (Unlimited Money, Unlocked Pro, No Ads) dengan kecepatan unduh server tinggi & teruji aman.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-semibold text-slate-200">100% Free & Working</span>
                </div>
                <div>⚡ Fast Direct Server</div>
                <div>🛡️ Clean & Safe Files</div>
              </div>
            </div>
          </section>
        )}

        {/* Featured Section */}
        {!search && !categoryParam && activeType === 'all' && featuredApps.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" /> Game & App Paling Populer
              </h2>
              <span className="text-xs text-slate-400">Featured MODS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </section>
        )}

        {/* Main Content Area */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                {search ? (
                  <>Hasil Pencarian untuk &ldquo;{search}&rdquo;</>
                ) : activeType === 'game' ? (
                  <><Gamepad2 className="w-5 h-5 text-cyan-400" /> Katalog Game MOD</>
                ) : activeType === 'app' ? (
                  <><Smartphone className="w-5 h-5 text-emerald-400" /> Katalog Aplikasi Premium</>
                ) : (
                  <><Zap className="w-5 h-5 text-emerald-400" /> Semua MOD Terkini</>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Menampilkan {apps.length} aplikasi modifikasi siap diunduh.
              </p>
            </div>

            {/* Type Switcher Tabs */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeType === 'all' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua
              </Link>
              <Link
                href="/?type=game"
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                  activeType === 'game' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" /> Games
              </Link>
              <Link
                href="/?type=app"
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                  activeType === 'app' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Apps
              </Link>
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none text-xs">
            <Link
              href={typeParam ? `/?type=${typeParam}` : '/'}
              className={`px-3 py-1.5 rounded-full border whitespace-nowrap transition ${
                activeCategory === 'All'
                  ? 'bg-slate-100 text-slate-950 border-white font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Semua Kategori
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/?category=${encodeURIComponent(cat.name)}${typeParam ? `&type=${typeParam}` : ''}`}
                className={`px-3 py-1.5 rounded-full border whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75 px-1 py-0.2 rounded-full bg-slate-800/80">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>

          {/* App Cards Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-400 text-xs">Memuat MOD APK...</p>
            </div>
          ) : apps.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
              <p className="text-slate-400 text-sm">Tidak ada aplikasi yang cocok dengan pencarian ini.</p>
              <Link
                href="/"
                className="mt-4 inline-block text-xs text-emerald-400 hover:underline font-semibold"
              >
                Lihat Semua Aplikasi
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {apps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
