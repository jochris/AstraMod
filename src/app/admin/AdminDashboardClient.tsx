'use client';

import { useState } from 'react';
import { AppItem } from '@/lib/db';
import { Database, Download, RefreshCw, Plus, Trash2, ShieldCheck, Send, Cpu, Layers, CheckCircle } from 'lucide-react';

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
  const totalScraped = apps.filter(a => a.source === 'AstraMod' || a.source === 'HappyMod' || a.source === 'AN1').length;

  const handleRunScraper = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScraping(true);
    setScrapeLog('Menghubungkan ke AstraMod Scraper Engine...');

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
          source: 'AstraMod Store',
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
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161B22] border border-[#374151] p-6 rounded-[8px]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D1117] bg-[#5FED83] px-2.5 py-0.5 rounded-full border border-[#31C55B] mb-2">
            <Database className="w-3.5 h-3.5" /> Dashboard Control Panel
          </div>
          <h1 className="text-2xl font-semibold text-white">Kelola MOD & Auto Scraper</h1>
          <p className="text-xs text-[#8B949E] mt-1">
            Impor data otomatis dari AstraMod Scraper Engine atau tambah MOD buatan sendiri.
          </p>
        </div>

        {/* Action Tabs & IndexNow Instant Ping */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePingIndexNow}
            className="h-[36px] px-3.5 rounded-[6px] bg-[#1F2328] hover:bg-[#374151] text-[#A2DAFF] border border-[#374151] text-xs font-medium transition flex items-center gap-1.5"
            title="Kirim URL ke Bing/Yandex untuk diindeks instan"
          >
            <Send className="w-3.5 h-3.5 text-[#5FED83]" /> Instant Index (IndexNow)
          </button>

          <div className="flex items-center bg-[#0D1117] p-1 rounded-[6px] border border-[#374151] text-xs font-medium">
            <button
              onClick={() => setActiveTab('scraper')}
              className={`px-3.5 py-1.5 rounded-[4px] transition flex items-center gap-1.5 ${
                activeTab === 'scraper' ? 'bg-[#5FED83] text-[#0D1117] font-semibold' : 'text-[#8B949E] hover:text-white'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Auto Scraper
            </button>
            <button
              onClick={() => setActiveTab('apps')}
              className={`px-3.5 py-1.5 rounded-[4px] transition flex items-center gap-1.5 ${
                activeTab === 'apps' ? 'bg-[#5FED83] text-[#0D1117] font-semibold' : 'text-[#8B949E] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Daftar App ({totalApps})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-3.5 py-1.5 rounded-[4px] transition flex items-center gap-1.5 ${
                activeTab === 'add' ? 'bg-[#5FED83] text-[#0D1117] font-semibold' : 'text-[#8B949E] hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Manual
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#161B22] border border-[#374151] p-4 rounded-[8px]">
          <span className="text-xs text-[#8B949E] block">Total Aplikasi/Game</span>
          <span className="text-2xl font-bold text-white mt-1 block">{totalApps}</span>
        </div>
        <div className="bg-[#161B22] border border-[#374151] p-4 rounded-[8px]">
          <span className="text-xs text-[#8B949E] block">Hasil Auto Scrape</span>
          <span className="text-2xl font-bold text-[#5FED83] mt-1 block">{totalScraped}</span>
        </div>
        <div className="bg-[#161B22] border border-[#374151] p-4 rounded-[8px]">
          <span className="text-xs text-[#8B949E] block">Total Kategori</span>
          <span className="text-2xl font-bold text-[#A2DAFF] mt-1 block">{categories.length}</span>
        </div>
        <div className="bg-[#161B22] border border-[#374151] p-4 rounded-[8px]">
          <span className="text-xs text-[#8B949E] block">Total Unduhan</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 block">{(totalDownloads / 1000).toFixed(0)}K+</span>
        </div>
      </div>

      {/* Tab 1: Auto Scraper Tool */}
      {activeTab === 'scraper' && (
        <div className="bg-[#161B22] border border-[#374151] rounded-[8px] p-6 sm:p-8">
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-[#5FED83]" /> Tool Impor / AstraMod Scraper Engine
            </h2>
            <p className="text-xs text-[#8B949E] mb-6">
              Script scraper ini akan otomatis mengambil judul, versi, deskripsi mod, gambar icon, screenshot, dan link download langsung ke database NeonDB website kita.
            </p>

            <form onSubmit={handleRunScraper} className="space-y-5 bg-[#0D1117] border border-[#374151] p-5 rounded-[6px]">
              <div>
                <label className="block text-xs font-semibold text-white mb-2">Pilih Server Engine Scraping:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setScrapeSource('happymod')}
                    className={`p-3.5 rounded-[6px] border text-left text-xs font-semibold transition flex items-center justify-between ${
                      scrapeSource === 'happymod'
                        ? 'bg-[#1F2328] border-[#5FED83] text-[#5FED83]'
                        : 'bg-[#161B22] border-[#374151] text-[#8B949E] hover:text-white'
                    }`}
                  >
                    <span>AstraMod Engine Server 1</span>
                    {scrapeSource === 'happymod' && <CheckCircle className="w-4 h-4 text-[#5FED83]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setScrapeSource('an1')}
                    className={`p-3.5 rounded-[6px] border text-left text-xs font-semibold transition flex items-center justify-between ${
                      scrapeSource === 'an1'
                        ? 'bg-[#1F2328] border-[#A2DAFF] text-[#A2DAFF]'
                        : 'bg-[#161B22] border-[#374151] text-[#8B949E] hover:text-white'
                    }`}
                  >
                    <span>AstraMod Engine Server 2</span>
                    {scrapeSource === 'an1' && <CheckCircle className="w-4 h-4 text-[#A2DAFF]" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Kata Kunci Pencarian (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="Kosongkan untuk trending, atau ketik nama game (contoh: GTA, Roblox, Minecraft)..."
                  value={scrapeKeyword}
                  onChange={(e) => setScrapeKeyword(e.target.value)}
                  className="w-full bg-[#1F2328] text-white placeholder-[#8B949E] text-xs rounded-[6px] p-3 border border-[#374151] focus:outline-none focus:border-[#5FED83]"
                />
              </div>

              <button
                type="submit"
                disabled={isScraping}
                className="w-full h-[43px] rounded-[6px] bg-[#5FED83] hover:bg-[#31C55B] text-[#0D1117] font-semibold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isScraping ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#0D1117]" />
                    <span>Sedang Mengambil Data AstraMod Engine...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 text-[#0D1117]" />
                    <span>Jalankan Auto Scraper Sekarang</span>
                  </>
                )}
              </button>
            </form>

            {/* Log / Status box */}
            {scrapeLog && (
              <div className="mt-6 p-4 rounded-[6px] bg-[#0D1117] border border-[#374151] text-xs font-mono text-white">
                <span className="text-[#8B949E] block mb-1 font-sans font-semibold">Status Scraper:</span>
                <p>{scrapeLog}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Manage Apps Table */}
      {activeTab === 'apps' && (
        <div className="bg-[#161B22] border border-[#374151] rounded-[8px] p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Daftar MOD APK Terdaftar ({apps.length})</h2>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#374151] text-[#8B949E] font-semibold">
                <th className="pb-3">App</th>
                <th className="pb-3">Kategori</th>
                <th className="pb-3">Fitur Mod</th>
                <th className="pb-3">Versi</th>
                <th className="pb-3">Sumber</th>
                <th className="pb-3">Unduhan</th>
                <th className="pb-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#374151]">
              {apps.map((a) => (
                <tr key={a.id} className="hover:bg-[#1F2328] transition">
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-3">
                      <img src={a.iconUrl || 'https://an1.com/templates/an1/images/logo.png'} alt={a.title} className="w-10 h-10 rounded-[6px] object-cover bg-[#0D1117] border border-[#374151]" />
                      <div>
                        <a href={`/app/${a.slug}`} target="_blank" className="font-semibold text-white hover:text-[#5FED83]">
                          {a.title}
                        </a>
                        <span className="text-[10px] text-[#8B949E] block">{a.packageName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 font-medium text-slate-200">{a.category}</td>
                  <td className="py-3 px-2 max-w-xs truncate text-[#5FED83]">{a.modInfo}</td>
                  <td className="py-3 px-2 text-slate-200 font-mono">v{a.version}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#0D1117] border border-[#374151] text-[#5FED83] font-medium text-[10px]">
                      AstraMod Store
                    </span>
                  </td>
                  <td className="py-3 px-2 font-semibold text-white">{a.downloadsCount.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDeleteApp(a.slug)}
                      className="p-1.5 rounded-[4px] text-[#F85149] hover:bg-[#1F2328] transition"
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
        <div className="bg-[#161B22] border border-[#374151] rounded-[8px] p-6 sm:p-8 max-w-3xl">
          <h2 className="text-lg font-semibold text-white mb-6">Tambah MOD APK Manual</h2>

          <form onSubmit={handleAddApp} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-1">Judul Aplikasi / Game *</label>
                <input
                  type="text"
                  placeholder="Contoh: Mobile Legends MOD"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#1F2328] text-white p-3 rounded-[6px] border border-[#374151] focus:outline-none focus:border-[#5FED83]"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-1">Versi *</label>
                <input
                  type="text"
                  placeholder="Contoh: 1.8.90"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  className="w-full bg-[#1F2328] text-white p-3 rounded-[6px] border border-[#374151] focus:outline-none focus:border-[#5FED83]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-1">Detail Fitur MOD *</label>
              <input
                type="text"
                placeholder="Contoh: Unlimited Diamonds, Map Hack, Skin Unlocked"
                value={newModInfo}
                onChange={(e) => setNewModInfo(e.target.value)}
                className="w-full bg-[#1F2328] text-white p-3 rounded-[6px] border border-[#374151] focus:outline-none focus:border-[#5FED83]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-1">Link Unduhan APK (Server / Mirror) *</label>
                <input
                  type="text"
                  placeholder="https://files.domain.com/app.apk"
                  value={newDownloadUrl}
                  onChange={(e) => setNewDownloadUrl(e.target.value)}
                  className="w-full bg-[#1F2328] text-white p-3 rounded-[6px] border border-[#374151] focus:outline-none focus:border-[#5FED83]"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-1">URL Gambar Icon</label>
                <input
                  type="text"
                  placeholder="https://domain.com/icon.png"
                  value={newIconUrl}
                  onChange={(e) => setNewIconUrl(e.target.value)}
                  className="w-full bg-[#1F2328] text-white p-3 rounded-[6px] border border-[#374151] focus:outline-none focus:border-[#5FED83]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-white font-semibold mb-1">Kategori</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#1F2328] text-white p-3 rounded-[6px] border border-[#374151] focus:outline-none focus:border-[#5FED83]"
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
                <label className="block text-white font-semibold mb-1">Tipe</label>
                <select
                  value={newAppType}
                  onChange={(e) => setNewAppType(e.target.value as any)}
                  className="w-full bg-[#1F2328] text-white p-3 rounded-[6px] border border-[#374151] focus:outline-none focus:border-[#5FED83]"
                >
                  <option value="game">Game</option>
                  <option value="app">Aplikasi</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-1">Ukuran File</label>
                <input
                  type="text"
                  placeholder="120 MB"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  className="w-full bg-[#1F2328] text-white p-3 rounded-[6px] border border-[#374151] focus:outline-none focus:border-[#5FED83]"
                />
              </div>
            </div>

            {addMessage && (
              <p className="text-xs font-semibold text-[#5FED83] pt-2">{addMessage}</p>
            )}

            <button
              type="submit"
              disabled={isAdding}
              className="h-[43px] px-6 rounded-[6px] bg-[#5FED83] hover:bg-[#31C55B] text-[#0D1117] font-semibold text-xs transition disabled:opacity-50"
            >
              {isAdding ? 'Menyimpan...' : 'Simpan MOD Baru'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
