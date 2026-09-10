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
      className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/50 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-semibold tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60 uppercase flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> MOD
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            v{app.version}
          </span>
        </div>

        {/* Icon + Title */}
        <div className="flex gap-3 items-start">
          <img
            src={app.iconUrl}
            alt={app.title}
            className="w-16 h-16 rounded-xl object-cover bg-slate-800 border border-slate-700 shadow-md group-hover:scale-105 transition-transform flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).setAttribute('src', 'https://an1.com/templates/an1/images/logo.png');
            }}
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition truncate leading-snug">
              {app.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {app.developer || app.category}
            </p>
            {/* Rating & Downloads */}
            <div className="flex items-center gap-3 mt-1.5 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{app.rating.toFixed(1)}</span>
              </div>
              <div className="text-slate-400 flex items-center gap-1">
                <Download className="w-3 h-3 text-slate-400" />
                <span>{formatDownloads(app.downloadsCount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mod Info Feature Pill */}
        <div className="mt-3 bg-slate-950/80 border border-slate-800/90 rounded-xl p-2.5">
          <p className="text-xs font-medium text-emerald-300 line-clamp-2 leading-relaxed">
            ✨ <span className="font-semibold">Mod Info:</span> {app.modInfo}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">
          {app.size || 'Variatif'} • AstraMod Direct
        </span>
        <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-0.5 transition flex items-center gap-1">
          Unduh <Download className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
