import Link from 'next/link';
import { ShieldCheck, Download, Zap, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 text-slate-400">
      {/* Features Bar */}
      <div className="border-b border-slate-800/60 py-8 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">100% Aman & Teruji</h4>
              <p className="text-xs text-slate-400">Semua MOD APK dipindai bebas dari malware.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Kecepatan Tinggi</h4>
              <p className="text-xs text-slate-400">Server unduhan cepat tanpa batasan kuota.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Update Otomatis</h4>
              <p className="text-xs text-slate-400">Pembaruan rutin dari sumber HappyMod & AN1.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <Download className="w-4 h-4 text-slate-950" />
            </div>
            <span className="text-lg font-bold text-slate-100">AstraMod</span>
            <span className="text-xs text-slate-400 ml-2">© {new Date().getFullYear()} AstraMod Store. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium">
            <Link href="/" className="hover:text-emerald-400 transition">Beranda</Link>
            <Link href="/?type=game" className="hover:text-emerald-400 transition">Game MOD</Link>
            <Link href="/?type=app" className="hover:text-emerald-400 transition">Aplikasi MOD</Link>
            <Link href="/admin" className="hover:text-emerald-400 transition">Scraper Admin</Link>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-6 text-center md:text-left">
          Disclaimer: AstraMod adalah platform direktori aplikasi dan game MOD untuk keperluan pengujian & edukasi. Semua hak cipta, merek dagang, dan nama milik pemiliknya masing-masing.
        </p>
      </div>
    </footer>
  );
}
