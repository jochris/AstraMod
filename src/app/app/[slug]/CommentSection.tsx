'use client';

import { useState } from 'react';
import { CommentItem } from '@/lib/db';
import { Star, MessageSquare, Send, User } from 'lucide-react';

interface CommentSectionProps {
  appId: number;
  initialComments: CommentItem[];
}

export default function CommentSection({ appId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [username, setUsername] = useState('');
  const [rating, setRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId,
          username: username.trim() || 'Pengguna MOD',
          rating,
          comment: commentText.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setComments([data.data, ...comments]);
        setCommentText('');
        setMessage('Ulasan Anda telah dipublikasikan!');
      } else {
        setMessage('Gagal mengirim ulasan.');
      }
    } catch {
      setMessage('Terjadi kesalahan koneksi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
      <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-emerald-400" /> Ulasan & Komentar Pengguna ({comments.length})
      </h3>

      {/* Write Comment Form */}
      <form onSubmit={handleSubmit} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8">
        <h4 className="text-sm font-semibold text-slate-200 mb-3">Tulis Ulasan Anda</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Nama Anda (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: Budi Gamer"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-900 text-slate-100 placeholder-slate-400 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Rating MOD</label>
            <div className="flex items-center gap-1 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-slate-300 ml-2 font-semibold">{rating}.0 / 5.0</span>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <textarea
            placeholder="Bagikan pengalaman Anda menggunakan MOD ini..."
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full bg-slate-900 text-slate-100 placeholder-slate-400 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-emerald-400 font-medium">{message}</span>
          <button
            type="submit"
            disabled={isSubmitting || !commentText.trim()}
            className="py-2 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}</span>
          </button>
        </div>
      </form>

      {/* List of Comments */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">Belum ada ulasan. Jadilah yang pertama memberikan ulasan!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">{c.username}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{c.rating}.0</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-9">{c.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
