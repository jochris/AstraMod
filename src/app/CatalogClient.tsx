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
    <div className="min-h-screen bg-[#0D1117] text-white flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* GitHub Dark Horizon Hero Section */}
        {!search && (
          <section className="relative rounded-[12px] bg-[#161B22] border border-[#374151] p-8 sm:p-12 mb-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#5FED83]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F2328] border border-[#374151] text-[#5FED83] text-xs font-medium mb-4">
                <ShieldCheck className="w-4 h-4 text-[#5FED83]" /> AstraMod Direct Stream • GitHub Dark Horizon
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.1] mb-4">
                Catalog <span className="text-[#5FED83]">MOD APK</span> Direct Stream & Verified Apps
              </h1>
              <p className="text-base sm:text-lg text-[#8B949E] leading-relaxed max-w-2xl">
                Direktori game Android dan aplikasi premium versi modifikasi (Unlocked Pro, Unlimited Money, Zero Ads) dengan server unduhan langsung tanpa pengalihan external.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-[#8B949E] border-t border-[#374151] pt-5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5FED83]" />
                  <span className="font-semibold text-white">Direct File Stream Enabled</span>
                </div>
                <div>⚡ High-Speed Direct CDN</div>
                <div>🛡️ 100% Malware Free</div>
              </div>
            </div>
          </section>
        )}

        {/* Featured Section */}
        {!search && !categoryParam && activeType === 'all' && featuredApps.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" /> Featured MOD Applications
              </h2>
              <span className="text-xs text-[#8B949E] font-mono">100% Direct MODs</span>
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
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                {search ? (
                  <>Hasil Pencarian: &ldquo;{search}&rdquo;</>
                ) : activeType === 'game' ? (
                  <><Gamepad2 className="w-5 h-5 text-[#A2DAFF]" /> Katalog Game MOD</>
                ) : activeType === 'app' ? (
                  <><Smartphone className="w-5 h-5 text-[#5FED83]" /> Katalog Aplikasi Premium</>
                ) : (
                  <><Zap className="w-5 h-5 text-[#5FED83]" /> Semua MOD Terkini</>
                )}
              </h2>
              <p className="text-xs text-[#8B949E] mt-1">
                Menampilkan {apps.length} aplikasi modifikasi siap diunduh secara langsung.
              </p>
            </div>

            {/* Type Switcher Tabs */}
            <div className="flex items-center bg-[#161B22] p-1 rounded-[6px] border border-[#374151] text-xs font-medium">
              <Link
                href="/"
                className={`px-3.5 py-1.5 rounded-[4px] transition ${
                  activeType === 'all' ? 'bg-[#5FED83] text-[#0D1117] font-semibold' : 'text-[#8B949E] hover:text-white'
                }`}
              >
                Semua
              </Link>
              <Link
                href="/?type=game"
                className={`px-3.5 py-1.5 rounded-[4px] transition flex items-center gap-1 ${
                  activeType === 'game' ? 'bg-[#5FED83] text-[#0D1117] font-semibold' : 'text-[#8B949E] hover:text-white'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" /> Games
              </Link>
              <Link
                href="/?type=app"
                className={`px-3.5 py-1.5 rounded-[4px] transition flex items-center gap-1 ${
                  activeType === 'app' ? 'bg-[#5FED83] text-[#0D1117] font-semibold' : 'text-[#8B949E] hover:text-white'
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
                  ? 'bg-[#5FED83] text-[#0D1117] border-[#31C55B] font-semibold'
                  : 'bg-[#161B22] text-[#8B949E] border-[#374151] hover:text-white'
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
                    ? 'bg-[#5FED83] text-[#0D1117] border-[#31C55B] font-semibold'
                    : 'bg-[#161B22] text-[#8B949E] border-[#374151] hover:text-white hover:border-[#8B949E]'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-80 px-1.5 py-0.2 rounded-full bg-[#1F2328]">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>

          {/* App Cards Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-[#5FED83] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-[#8B949E] text-xs">Memuat katalog AstraMod...</p>
            </div>
          ) : apps.length === 0 ? (
            <div className="text-center py-16 bg-[#161B22] rounded-[8px] border border-[#374151]">
              <p className="text-[#8B949E] text-sm">Tidak ada aplikasi yang cocok dengan kriteria ini.</p>
              <Link
                href="/"
                className="mt-4 inline-block text-xs text-[#A2DAFF] hover:underline font-medium"
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
