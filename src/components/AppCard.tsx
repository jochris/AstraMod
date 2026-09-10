import Link from 'next/link';
import { Star, Download, ShieldCheck } from 'lucide-react';
import { AppItem } from '@/lib/db';

export default function AppCard({ app }: { app: AppItem }) {
  const formatDownloads = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K+';
    return num.toString();
  };

  return (
    <Link
      href={`/app/${app.slug}`}
      className="group relative bg-[#161B22] hover:bg-[#1F2328] border border-[#374151] hover:border-[#5FED83] rounded-[8px] p-4 transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-medium tracking-wide text-[#5FED83] bg-[#0D1117] px-2.5 py-0.5 rounded-full border border-[#374151] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5FED83]" /> MOD UNLOCKED
          </span>
          <span className="text-[12px] font-medium text-[#8B949E]">
            v{app.version}
          </span>
        </div>

        {/* Icon + Title */}
        <div className="flex gap-3 items-start">
          <img
            src={app.iconUrl || 'https://an1.com/templates/an1/images/logo.png'}
            alt={app.title}
            className="w-14 h-14 rounded-[6px] object-cover bg-[#0D1117] border border-[#374151] flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-white group-hover:text-[#5FED83] transition truncate leading-snug">
              {app.title}
            </h3>
            <p className="text-xs text-[#8B949E] mt-0.5 truncate">
              {app.developer || app.category}
            </p>
            {/* Rating & Downloads */}
            <div className="flex items-center gap-3 mt-1.5 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{Number(app.rating || 4.5).toFixed(1)}</span>
              </div>
              <div className="text-[#8B949E] flex items-center gap-1">
                <Download className="w-3 h-3 text-[#8B949E]" />
                <span>{formatDownloads(Number(app.downloadsCount || 1000))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mod Info Box */}
        <div className="mt-3 bg-[#0D1117] border border-[#374151] rounded-[6px] p-2.5">
          <p className="text-xs font-medium text-slate-200 line-clamp-2 leading-relaxed">
            <span className="text-[#5FED83] font-semibold">MOD Info:</span> {app.modInfo}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-[#374151] flex items-center justify-between">
        <span className="text-[12px] text-[#8B949E] font-medium">
          {app.size || 'Variatif'} • AstraMod Direct
        </span>
        <span className="text-xs font-medium text-[#5FED83] group-hover:underline flex items-center gap-1">
          Unduh APK <Download className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
