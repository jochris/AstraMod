import { getAppBySlug, getAllApps, getComments } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppCard from '@/components/AppCard';
import DownloadModal from '@/components/DownloadModal';
import CommentSection from './CommentSection';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Star, Download, ShieldCheck, Zap, ArrowLeft, CheckCircle, Package, Smartphone, Calendar } from 'lucide-react';

export const revalidate = 0;

interface DetailProps {
  params: { slug: string } | Promise<{ slug: string }>;
}

export default async function AppDetailPage({ params }: DetailProps) {
  let slug = '';
  try {
    const p = await Promise.resolve(params);
    if (p && typeof p.slug === 'string') {
      slug = p.slug;
    }
  } catch (e) {}

  let app: any = null;
  let comments: any[] = [];
  let relatedApps: any[] = [];

  try {
    if (slug) {
      app = await getAppBySlug(slug);
      if (app) {
        comments = (await getComments(app.id)) || [];
        relatedApps = ((await getAllApps({ category: app.category, limit: 5 })) || []).filter(a => a.id !== app.id).slice(0, 4);
      }
    }
  } catch (err) {
    console.error('AppDetailPage data fetch error:', err);
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto px-4 my-20">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Aplikasi Tidak Ditemukan</h1>
          <p className="text-slate-400 text-xs mb-6">Aplikasi MOD yang kamu cari tidak ditemukan atau telah diperbarui.</p>
          <Link href="/" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition">
            Kembali ke Katalog MOD
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDownloads = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K+';
    return num.toString();
  };

  let screenshots: string[] = [];
  try {
    if (app.screenshots) {
      screenshots = JSON.parse(app.screenshots);
    }
  } catch {}

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': app.title,
    'operatingSystem': 'ANDROID',
    'applicationCategory': app.appType === 'game' ? 'GameApplication' : 'MobileApplication',
    'softwareVersion': app.version,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': app.rating || '4.8',
      'ratingCount': app.downloadsCount || '1000',
    },
    'description': app.description || `Download ${app.title} MOD APK v${app.version}`,
    'image': app.iconUrl,
    'downloadUrl': app.downloadUrl,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 mb-6 transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </Link>

        {/* Top Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <img
                src={app.iconUrl}
                alt={app.title}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover bg-slate-800 border-2 border-slate-700 shadow-xl"
                onError={(e) => {
                  (e.target as HTMLElement).setAttribute('src', 'https://an1.com/templates/an1/images/logo.png');
                }}
              />

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-800/80 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> MOD UNLOCKED
                  </span>
                  <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                    {app.category}
                  </span>
                  <span className="text-xs font-medium text-cyan-400 bg-cyan-950/50 px-2.5 py-0.5 rounded-full border border-cyan-900">
                    Status: 100% Working
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                  {app.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Developer: <span className="text-slate-200 font-medium">{app.developer || 'Official Modder'}</span>
                </p>

                {/* Key Stats Row */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{Number(app.rating || 4.8).toFixed(1)}</span>
                    <span className="text-slate-400 text-xs font-normal">/ 5.0</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>{formatDownloads(Number(app.downloadsCount || 1000))} Unduhan</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <Package className="w-4 h-4 text-cyan-400" />
                    <span>Versi {app.version}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>{app.size || 'Variatif'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Jump to Download button */}
            <a
              href="#download-section"
              className="w-full md:w-auto py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Sekarang
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mod Info Box */}
            <div className="bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl p-6 relative overflow-hidden shadow-xl">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base mb-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Zap className="w-5 h-5" />
                </div>
                <span>Fitur Modifikasi (Mod Info):</span>
              </div>
              <p className="text-sm text-emerald-200 font-semibold leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-emerald-900/50">
                {app.modInfo}
              </p>
            </div>

            {/* Screenshots Gallery */}
            {screenshots.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-base font-bold text-slate-100 mb-4">
                  Tangkapan Layar (Screenshots)
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
                  {screenshots.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Screenshot ${idx + 1}`}
                      className="h-56 rounded-xl object-cover border border-slate-700 shadow-md flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Description & About */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h3 className="text-base font-bold text-slate-100 mb-4">
                Tentang {app.title} MOD APK
              </h3>
              <div className="text-slate-300 text-sm leading-relaxed space-y-3 whitespace-pre-line">
                {app.description || `Download ${app.title} MOD APK versi terbaru. Dapatkan fitur ${app.modInfo} gratis tanpa batasan.`}
              </div>

              {/* Specifications table */}
              <div className="mt-8 border-t border-slate-800 pt-6">
                <h4 className="text-sm font-bold text-slate-200 mb-3">Informasi Detail File</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Package Name</span>
                    <span className="font-semibold text-slate-200 truncate block mt-0.5">{app.packageName || 'com.mod.app'}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Sistem Operasi</span>
                    <span className="font-semibold text-slate-200 block mt-0.5">Android 5.0+</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Harga</span>
                    <span className="font-semibold text-emerald-400 block mt-0.5">Gratis (MOD)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Section Box */}
            <div id="download-section">
              <DownloadModal
                appTitle={app.title}
                version={app.version}
                modInfo={app.modInfo}
                size={app.size || 'Variatif'}
                downloadUrl={app.downloadUrl}
                slug={app.slug}
              />
            </div>

            {/* Comments & Rating Section */}
            <CommentSection appId={app.id} initialComments={comments} />
          </div>

          {/* Sidebar Column: Related Apps */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-slate-100 mb-4">
                MOD Lain di Kategori {app.category}
              </h3>
              <div className="space-y-4">
                {relatedApps.length === 0 ? (
                  <p className="text-xs text-slate-400">Belum ada game/aplikasi serupa.</p>
                ) : (
                  relatedApps.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/app/${rel.slug}`}
                      className="flex items-center gap-3 group p-2 rounded-xl hover:bg-slate-800/60 transition"
                    >
                      <img
                        src={rel.iconUrl}
                        alt={rel.title}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 truncate">
                          {rel.title}
                        </h4>
                        <p className="text-[11px] text-emerald-400 truncate mt-0.5">
                          {rel.modInfo}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
