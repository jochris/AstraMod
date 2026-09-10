'use client';

import { useState } from 'react';
import { AppItem } from '@/lib/db';
import { Database, Download, RefreshCw, Plus, Trash2, Edit3, ShieldCheck, Search, Sparkles, Layers, CheckCircle } from 'lucide-react';

interface AdminClientProps {
  initialApps: AppItem[];
  categories: { name: string; count: number }[];
}

export default function AdminDashboardClient({ initialApps, categories }: AdminClientProps) {
  const [apps, setApps] = useState<AppItem[]>(initialApps);
  const [activeTab, setActiveTab] = useState<'scraper' | 'apps' | 'add'>('scraper');

  // Scraper Form State
  const [scrapeSource, setScrapeSource] = useState<'happymod' | 'an1'>('happymod');
  const [scrapeKeyword, setScrapeKeyword] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeLog, setScrapeLog] = useState<string | null>(null);

  // New App Form State
  const [newTitle, setNewTitle] = useState('');
  const [newModInfo, setNewModInfo] = useState('');
  const [newVersion, setNewVersion] = useState('');
  const [newCategory, setNewCategory] = useState('Action');
  const [newAppType, setNewAppType] = useState<'game' | 'app'>('game');
  const [newDownloadUrl, setNewDownloadUrl] = useState('');
  const [newIconUrl, setNewIconUrl] = useState('');
  const [newSize, setNewSize] = useState('100 MB');
  const [newDeveloper, setNewDeveloper] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addMessage, setAddMessage] = useState('');

  // Stats
  const totalApps = apps.length;
  const totalDownloads = apps.reduce((acc, curr) => acc + (curr.downloadsCount || 0), 0);
  const totalScraped = apps.filter(a => a.source === 'HappyMod' || a.source === 'AN1').length;

  const handleRunScraper = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScraping(true);
    setScrapeLog('Menghubungkan ke server ' + (scrapeSource === 'happymod' ? 'HappyMod' : 'AN1') + '...');

    try {
      const res = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: scrapeSource, keyword: scrapeKeyword.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setScrapeLog(`✅ Success! ${data.message}`);
        // Refresh app list
        const appsRes = await fetch('/api/apps');
        const appsData = await appsRes.json();
        if (appsData.success) {
          setApps(appsData.data);
        }
      } else {
        setScrapeLog(`❌ Gagal: ${data.error || data.message}`);
      }
    } catch (err: any) {
      setScrapeLog(`❌ Error koneksi: ${err.message}`);
    } finally {
      setIsScraping(false);
    }
  };

  const handleAddApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDownloadUrl || !newModInfo) return;

    setIsAdding(true);
    setAddMessage('');

    try {
      const res = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          modInfo: newModInfo,
          version: newVersion || '1.0.0',
          category: newCategory,
          appType: newAppType,
          downloadUrl: newDownloadUrl,
          iconUrl: newIconUrl || 'https://an1.com/templates/an1/images/logo.png',
          size: newSize,
          developer: newDeveloper || 'Independent Modder',
          source: 'Manual',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAddMessage('Aplikasi berhasil ditambahkan!');
        setNewTitle('');
        setNewModInfo('');
        setNewDownloadUrl('');
        setNewIconUrl('');
        // Refresh apps list
        const appsRes = await fetch('/api/apps');
        const appsData = await appsRes.json();
        if (appsData.success) setApps(appsData.data);
      } else {
        setAddMessage(`Gagal: ${data.error}`);
      }
    } catch (err: any) {
      setAddMessage(`Error: ${err.message}`);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteApp = async (slug: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus aplikasi ini?')) return;
    try {
      const res = await fetch(`/api/apps/${slug}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setApps(apps.filter(a => a.slug !== slug));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePingIndexNow = async () => {
    try {
      setScrapeLog('Mengirimkan URL ke Bing & Yandex via IndexNow API...');
      const res = await fetch('/api/admin/indexnow', { method: 'POST' });
      const data = await res.json();
      setScrapeLog(data.message || (data.success ? 'Berhasil mengindeks instan!' : 'Gagal mengindeks'));
    } catch (e: any) {
      setScrapeLog(`Error IndexNow: ${e.message}`);
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/80 mb-2">
            <Database className="w-3.5 h-3.5" /> Dashboard Control Panel
          </div>
          <h1 className="text-2xl font-bold text-white">Kelola MOD & Auto Scraper</h1>
          <p className="text-xs text-slate-400 mt-1">
            Impor data otomatis dari HappyMod / AN1 atau tambah MOD buatan sendiri.
          </p>
        </div>

        {/* Action Tabs & IndexNow Instant Ping */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePingIndexNow}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5"
            title="Kirim URL ke Bing/Yandex untuk diindeks instan"
          >
            <Sparkles className="w-3.5 h-3.5" /> Instant Index (IndexNow)
          </button>

          <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('scraper')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'scraper' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Auto Scraper
          </button>
          <button
            onClick={() => setActiveTab('apps')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'apps' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Daftar Application ({totalApps})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'add' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Manual
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400 block">Total Aplikasi/Game</span>
          <span className="text-2xl font-black text-white mt-1 block">{totalApps}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400 block">Hasil Auto Scrape</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">{totalScraped}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400 block">Total Kategori</span>
          <span className="text-2xl font-black text-cyan-400 mt-1 block">{categories.length}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400 block">Total Unduhan</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">{(totalDownloads / 1000).toFixed(0)}K+</span>
        </div>
      </div>

      {/* Tab 1: Auto Scraper Tool */}
      {activeTab === 'scraper' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-emerald-400" /> Tool Impor / Scraper MOD APK
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Script scraper ini akan otomatis mengambil judul, versi, deskripsi mod, gambar icon, screenshot, dan link download langsung ke database SQLite website kita.
            </p>

            <form onSubmit={handleRunScraper} className="space-y-5 bg-slate-950 border border-slate-800/80 p-5 rounded-2xl">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Pilih Sumber Scraping:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setScrapeSource('happymod')}
                    className={`p-3.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                      scrapeSource === 'happymod'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>HappyMod.to</span>
                    {scrapeSource === 'happymod' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setScrapeSource('an1')}
                    className={`p-3.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                      scrapeSource === 'an1'
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-400 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>AN1.com</span>
                    {scrapeSource === 'an1' && <CheckCircle className="w-4 h-4 text-cyan-400" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kata Kunci Pencarian (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="Kosongkan untuk trending, atau ketik nama game (contoh: GTA, Roblox, Minecraft)..."
                  value={scrapeKeyword}
                  onChange={(e) => setScrapeKeyword(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 placeholder-slate-400 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isScraping}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isScraping ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sedang Mengambil Data Dari {scrapeSource.toUpperCase()}...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Jalankan Auto Scraper Sekarang</span>
                  </>
                )}
              </button>
            </form>

            {/* Log / Status box */}
            {scrapeLog && (
              <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                <span className="text-slate-400 block mb-1 font-sans font-semibold">Status Scraper:</span>
                <p>{scrapeLog}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Manage Apps Table */}
      {activeTab === 'apps' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-x-auto">
          <h2 className="text-lg font-bold text-slate-100 mb-4">Daftar MOD APK Terdaftar ({apps.length})</h2>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">App</th>
                <th className="pb-3">Kategori</th>
                <th className="pb-3">Fitur Mod</th>
                <th className="pb-3">Versi</th>
                <th className="pb-3">Sumber</th>
                <th className="pb-3">Unduhan</th>
                <th className="pb-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {apps.map((a) => (
                <tr key={a.id} className="hover:bg-slate-950/40 transition">
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-3">
                      <img src={a.iconUrl} alt={a.title} className="w-10 h-10 rounded-lg object-cover bg-slate-800" />
                      <div>
                        <a href={`/app/${a.slug}`} target="_blank" className="font-bold text-slate-200 hover:text-emerald-400">
                          {a.title}
                        </a>
                        <span className="text-[10px] text-slate-400 block">{a.packageName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 font-medium text-slate-300">{a.category}</td>
                  <td className="py-3 px-2 max-w-xs truncate text-emerald-400">{a.modInfo}</td>
                  <td className="py-3 px-2 text-slate-300 font-mono">v{a.version}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                      {a.source || 'Manual'}
                    </span>
                  </td>
                  <td className="py-3 px-2 font-semibold text-slate-200">{a.downloadsCount.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDeleteApp(a.slug)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 transition"
                      title="Hapus MOD"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Manual Add */}
      {activeTab === 'add' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl">
          <h2 className="text-lg font-bold text-slate-100 mb-6">Tambah MOD APK Manual</h2>

          <form onSubmit={handleAddApp} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judul Aplikasi / Game *</label>
                <input
                  type="text"
                  placeholder="Contoh: Mobile Legends MOD"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Versi *</label>
                <input
                  type="text"
                  placeholder="Contoh: 1.8.90"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Detail Fitur MOD *</label>
              <input
                type="text"
                placeholder="Contoh: Unlimited Diamonds, Map Hack, Skin Unlocked"
                value={newModInfo}
                onChange={(e) => setNewModInfo(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Link Unduhan APK (Direct / Mirror) *</label>
                <input
                  type="text"
                  placeholder="https://files.domain.com/app.apk"
                  value={newDownloadUrl}
                  onChange={(e) => setNewDownloadUrl(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">URL Gambar Icon</label>
                <input
                  type="text"
                  placeholder="https://domain.com/icon.png"
                  value={newIconUrl}
                  onChange={(e) => setNewIconUrl(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kategori</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Action">Action</option>
                  <option value="Arcade">Arcade</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Simulation">Simulation</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Puzzle">Puzzle</option>
                  <option value="Music & Audio">Music & Audio</option>
                  <option value="Video Players & Editors">Video Players & Editors</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tipe</label>
                <select
                  value={newAppType}
                  onChange={(e) => setNewAppType(e.target.value as any)}
                  className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="game">Game</option>
                  <option value="app">Aplikasi</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Ukuran File</label>
                <input
                  type="text"
                  placeholder="120 MB"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {addMessage && (
              <p className="text-xs font-semibold text-emerald-400 pt-2">{addMessage}</p>
            )}

            <button
              type="submit"
              disabled={isAdding}
              className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              {isAdding ? 'Menyimpan...' : 'Simpan MOD Baru'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
