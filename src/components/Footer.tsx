import Link from 'next/link';
import { ShieldCheck, Download, Zap, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#374151] bg-[#0D1117] text-[#8B949E]">
      {/* Features Bar */}
      <div className="border-b border-[#374151] py-8 bg-[#161B22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-[#1F2328] border border-[#374151] flex items-center justify-center text-[#5FED83]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Terverifikasi Aman</h4>
              <p className="text-xs text-[#8B949E]">Semua MOD APK dipindai bebas dari malware.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-[#1F2328] border border-[#374151] flex items-center justify-center text-[#A2DAFF]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Unduhan Server Cepat</h4>
              <p className="text-xs text-[#8B949E]">Server unduhan tinggi bebas dari iklan berlebih.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-[#1F2328] border border-[#374151] flex items-center justify-center text-[#5FED83]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Scraper Dynamic Update</h4>
              <p className="text-xs text-[#8B949E]">Pembaruan otomatis dari AstraMod Engine secara berkala.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-[#5FED83] flex items-center justify-center text-[#0D1117] font-bold">
              <Download className="w-4 h-4 text-[#0D1117]" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">AstraMod</span>
            <span className="text-xs text-[#8B949E] ml-2">© {new Date().getFullYear()} AstraMod Store • GitHub Dark Horizon Edition</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium text-[#A2DAFF]">
            <Link href="/" className="hover:underline transition">Beranda</Link>
            <Link href="/?type=game" className="hover:underline transition">Game MOD</Link>
            <Link href="/?type=app" className="hover:underline transition">Aplikasi MOD</Link>
          </div>
        </div>
        <p className="text-[12px] text-[#8B949E] mt-6 text-center md:text-left">
          Disclaimer: AstraMod adalah platform direktori aplikasi dan game MOD untuk keperluan pengujian & edukasi. Semua hak cipta, merek dagang, dan nama milik pemiliknya masing-masing.
        </p>
      </div>
    </footer>
  );
}
