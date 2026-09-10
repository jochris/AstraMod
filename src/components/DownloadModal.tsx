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
  const [countdown, setCountdown] = useState(3);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, [countdown]);

  const handleDownloadClick = () => {
    if (onDownloadStarted) onDownloadStarted();
    window.location.href = `/api/apps/${slug}/file`;
  };

  return (
    <div className="bg-[#161B22] border border-[#374151] rounded-[8px] p-6 text-white relative">
      <div className="flex items-center justify-between border-b border-[#374151] pb-4 mb-5">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-[#5FED83]" /> Unduh APK MOD
          </h3>
          <p className="text-xs text-[#8B949E] mt-0.5">
            {appTitle} (v{version}) • {size}
          </p>
        </div>
        <span className="text-xs font-medium text-[#0D1117] bg-[#5FED83] px-2.5 py-1 rounded-full border border-[#31C55B]">
          Server Cepat
        </span>
      </div>

      {/* Mod Summary Box */}
      <div className="bg-[#0D1117] border border-[#374151] rounded-[6px] p-4 mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5FED83] mb-1">
          <Zap className="w-4 h-4" /> Mod Features:
        </div>
        <p className="text-sm text-slate-200 font-medium">{modInfo}</p>
      </div>

      {/* Download Status & Button */}
      {!isReady ? (
        <div className="text-center py-6 bg-[#0D1117] rounded-[6px] border border-[#374151] mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#161B22] text-[#5FED83] mb-3 border border-[#374151]">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
          <p className="text-sm font-medium text-slate-200">
            Menyiapkan link unduhan aman...
          </p>
          <p className="text-2xl font-bold text-[#5FED83] mt-1">
            {countdown} Detik
          </p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          <button
            onClick={handleDownloadClick}
            className="w-full h-[48px] rounded-[6px] bg-[#5FED83] hover:bg-[#31C55B] text-[#0D1117] font-semibold text-base transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5 text-[#0D1117]" />
            <span>Download APK (Server Utama High-Speed)</span>
          </button>

          <button
            onClick={handleDownloadClick}
            className="w-full h-[43px] rounded-[6px] bg-[#1F2328] hover:bg-[#374151] text-white font-medium text-xs border border-[#374151] transition-colors flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#A2DAFF]" />
            <span>Link Mirror Alternative (Server 2)</span>
          </button>
        </div>
      )}

      {/* Safety Badges */}
      <div className="grid grid-cols-2 gap-3 text-[12px] text-[#8B949E] pt-3 border-t border-[#374151]">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#5FED83]" />
          <span>Bebas Virus & Malware</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#A2DAFF]" />
          <span>Terverifikasi 100% Work</span>
        </div>
      </div>
    </div>
  );
}
