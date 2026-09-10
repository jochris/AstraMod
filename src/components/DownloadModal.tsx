'use client';

import { useState, useEffect } from 'react';
import { Download, ShieldCheck, CheckCircle2, Zap, ExternalLink, RefreshCw } from 'lucide-react';

interface DownloadModalProps {
  appTitle: string;
  version: string;
  modInfo: string;
  size: string;
  downloadUrl: string;
  slug: string;
  onDownloadStarted?: () => void;
}

export default function DownloadModal({
  appTitle,
  version,
  modInfo,
  size,
  downloadUrl,
  slug,
  onDownloadStarted,
}: DownloadModalProps) {
  const [countdown, setCountdown] = useState(4);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, [countdown]);

  const handleDownloadClick = async () => {
    try {
      await fetch(`/api/apps/${slug}/download`, { method: 'POST' });
      if (onDownloadStarted) onDownloadStarted();
    } catch (e) {
      console.error(e);
    }
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400" /> Unduh APK MOD
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {appTitle} (v{version}) • {size}
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
          Fast Server
        </span>
      </div>

      {/* Mod Summary Box */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
          <Zap className="w-4 h-4" /> Mod Features:
        </div>
        <p className="text-sm text-slate-200 font-medium">{modInfo}</p>
      </div>

      {/* Download Status & Button */}
      {!isReady ? (
        <div className="text-center py-6 bg-slate-950/50 rounded-2xl border border-slate-800/60 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 mb-3 border border-emerald-500/30 animate-pulse">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-200">
            Menyiapkan link unduhan aman...
          </p>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {countdown} Detik
          </p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          <button
            onClick={handleDownloadClick}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 group"
          >
            <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Download APK (Server Utama - High Speed)</span>
          </button>

          <button
            onClick={handleDownloadClick}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Link Mirror Alternative (Server 2)</span>
          </button>
        </div>
      )}

      {/* Safety Badges */}
      <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Bebas Virus & Malware</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Terverifikasi 100% Work</span>
        </div>
      </div>
    </div>
  );
}
