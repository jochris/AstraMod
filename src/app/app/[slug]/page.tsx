import { getAppBySlug, getAllApps, getComments } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppCard from '@/components/AppCard';
import DownloadModal from '@/components/DownloadModal';
import CommentSection from './CommentSection';
import Link from 'next/link';
import { Star, Download, ShieldCheck, Zap, ArrowLeft, Package, Smartphone } from 'lucide-react';

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
      <div className="min-h-screen bg-[#0D1117] text-white flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto px-4 my-20">
          <h1 className="text-2xl font-semibold text-white mb-2">Aplikasi Tidak Ditemukan</h1>
          <p className="text-[#8B949E] text-xs mb-6">Aplikasi MOD yang kamu cari tidak ditemukan atau telah diperbarui.</p>
          <Link href="/" className="gh-btn-secondary text-xs">
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
    <div className="min-h-screen bg-[#0D1117] text-white flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#A2DAFF] hover:underline mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </Link>

        {/* Top Header Card */}
        <div className="bg-[#161B22] border border-[#374151] rounded-[8px] p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <img
                src={app.iconUrl || 'https://an1.com/templates/an1/images/logo.png'}
                alt={app.title}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-[8px] object-cover bg-[#0D1117] border border-[#374151] flex-shrink-0"
              />

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-[#0D1117] bg-[#5FED83] px-2.5 py-0.5 rounded-full border border-[#31C55B] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> MOD UNLOCKED
                  </span>
                  <span className="text-xs font-medium text-white bg-[#1F2328] px-2.5 py-0.5 rounded-full border border-[#374151]">
                    {app.category}
                  </span>
                  <span className="text-xs font-medium text-[#A2DAFF] bg-[#1F2328] px-2.5 py-0.5 rounded-full border border-[#374151]">
                    Status: Direct Stream Working
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-semibold text-white leading-snug">
                  {app.title}
                </h1>
                <p className="text-xs sm:text-sm text-[#8B949E] mt-1">
                  Developer: <span className="text-white font-medium">{app.developer || 'Official Modder'}</span>
                </p>

                {/* Key Stats Row */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-medium text-sm">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{Number(app.rating || 4.8).toFixed(1)}</span>
                    <span className="text-[#8B949E] text-xs font-normal">/ 5.0</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                    <Download className="w-4 h-4 text-[#5FED83]" />
                    <span>{formatDownloads(Number(app.downloadsCount || 1000))} Unduhan</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                    <Package className="w-4 h-4 text-[#A2DAFF]" />
                    <span>Versi {app.version}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                    <Smartphone className="w-4 h-4 text-[#5FED83]" />
                    <span>{app.size || 'Variatif'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Jump to Download button */}
            <a
              href="#download-section"
              className="w-full md:w-auto h-[43px] px-6 rounded-[6px] bg-[#5FED83] hover:bg-[#31C55B] text-[#0D1117] font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-[#0D1117]" /> Download Sekarang
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mod Info Box */}
            <div className="bg-[#161B22] border border-[#5FED83]/40 rounded-[8px] p-6 relative overflow-hidden">
              <div className="flex items-center gap-2.5 text-[#5FED83] font-semibold text-base mb-3">
                <div className="p-1.5 rounded-[6px] bg-[#0D1117] border border-[#374151] text-[#5FED83]">
                  <Zap className="w-5 h-5" />
                </div>
                <span>Fitur Modifikasi (Mod Info):</span>
              </div>
              <p className="text-sm text-white font-medium leading-relaxed bg-[#0D1117] p-4 rounded-[6px] border border-[#374151]">
                {app.modInfo}
              </p>
            </div>

            {/* Screenshots Gallery */}
            {screenshots.length > 0 && (
              <div className="bg-[#161B22] border border-[#374151] rounded-[8px] p-6">
                <h3 className="text-base font-semibold text-white mb-4">
                  Tangkapan Layar (Screenshots)
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#374151]">
                  {screenshots.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Screenshot ${idx + 1}`}
                      className="h-56 rounded-[6px] object-cover border border-[#374151] flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Description & About */}
            <div className="bg-[#161B22] border border-[#374151] rounded-[8px] p-6 sm:p-8">
              <h3 className="text-base font-semibold text-white mb-4">
                Tentang {app.title} MOD APK
              </h3>
              <div className="text-[#8B949E] text-sm leading-relaxed space-y-3 whitespace-pre-line">
                {app.description || `Download ${app.title} MOD APK versi terbaru. Dapatkan fitur ${app.modInfo} gratis tanpa batasan.`}
              </div>

              {/* Specifications table */}
              <div className="mt-8 border-t border-[#374151] pt-6">
                <h4 className="text-sm font-semibold text-white mb-3">Informasi Detail File</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#0D1117] p-3 rounded-[6px] border border-[#374151]">
                    <span className="text-[#8B949E] block">Package Name</span>
                    <span className="font-semibold text-white truncate block mt-0.5">{app.packageName || 'com.mod.app'}</span>
                  </div>
                  <div className="bg-[#0D1117] p-3 rounded-[6px] border border-[#374151]">
                    <span className="text-[#8B949E] block">Sistem Operasi</span>
                    <span className="font-semibold text-white block mt-0.5">Android 5.0+</span>
                  </div>
                  <div className="bg-[#0D1117] p-3 rounded-[6px] border border-[#374151]">
                    <span className="text-[#8B949E] block">Harga</span>
                    <span className="font-semibold text-[#5FED83] block mt-0.5">Gratis (MOD)</span>
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
            <div className="bg-[#161B22] border border-[#374151] rounded-[8px] p-6">
              <h3 className="text-sm font-semibold text-white mb-4">
                MOD Lain di Kategori {app.category}
              </h3>
              <div className="space-y-3">
                {relatedApps.length === 0 ? (
                  <p className="text-xs text-[#8B949E]">Belum ada game/aplikasi serupa.</p>
                ) : (
                  relatedApps.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/app/${rel.slug}`}
                      className="flex items-center gap-3 group p-2 rounded-[6px] hover:bg-[#1F2328] transition border border-transparent hover:border-[#374151]"
                    >
                      <img
                        src={rel.iconUrl || 'https://an1.com/templates/an1/images/logo.png'}
                        alt={rel.title}
                        className="w-12 h-12 rounded-[6px] object-cover bg-[#0D1117] border border-[#374151] flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-white group-hover:text-[#5FED83] truncate">
                          {rel.title}
                        </h4>
                        <p className="text-[11px] text-[#5FED83] truncate mt-0.5">
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
