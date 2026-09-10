'use client';

import { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';

export default function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success) {
        window.location.reload();
      } else {
        setError(data.error || 'Password admin salah!');
      }
    } catch (err: any) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#161B22] border border-[#374151] rounded-[12px] p-6 sm:p-8 shadow-2xl">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-[#1F2328] border border-[#374151] flex items-center justify-center mx-auto mb-3 text-[#5FED83]">
          <Lock className="w-6 h-6 text-[#5FED83]" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">Admin Authentication</h1>
        <p className="text-xs text-[#8B949E] mt-1">
          Masukkan Password Admin untuk mengakses Dashboard AstraMod.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-[6px] bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-xs font-medium text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-white mb-1.5 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[#5FED83]" /> Password Admin
          </label>
          <input
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            className="w-full bg-[#1F2328] text-white text-sm rounded-[6px] px-3.5 py-2.5 border border-[#374151] focus:outline-none focus:border-[#5FED83] transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full gh-btn-primary h-[40px] text-xs font-semibold flex items-center justify-center gap-2 justify-center"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#0D1117] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-[#0D1117]" />
              <span>Masuk Dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#0D1117]" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
