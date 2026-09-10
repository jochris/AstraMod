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
    <div className="bg-[#161B22] border border-[#374151] rounded-[8px] p-6 sm:p-8">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-[#5FED83]" /> Ulasan & Komentar Pengguna ({comments.length})
      </h3>

      {/* Write Comment Form */}
      <form onSubmit={handleSubmit} className="bg-[#0D1117] border border-[#374151] rounded-[6px] p-4 sm:p-5 mb-8">
        <h4 className="text-sm font-semibold text-white mb-3">Tulis Ulasan Anda</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-xs text-[#8B949E] mb-1">Nama Anda (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: Budi Gamer"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1F2328] text-white placeholder-[#8B949E] text-xs rounded-[6px] px-3 py-2 border border-[#374151] focus:outline-none focus:border-[#5FED83]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#8B949E] mb-1">Rating MOD</label>
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
              <span className="text-xs text-white ml-2 font-semibold">{rating}.0 / 5.0</span>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <textarea
            placeholder="Bagikan pengalaman Anda menggunakan MOD ini..."
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full bg-[#1F2328] text-white placeholder-[#8B949E] text-xs rounded-[6px] p-3 border border-[#374151] focus:outline-none focus:border-[#5FED83]"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-[#5FED83] font-medium">{message}</span>
          <button
            type="submit"
            disabled={isSubmitting || !commentText.trim()}
            className="py-2 px-5 rounded-[6px] bg-[#5FED83] hover:bg-[#31C55B] text-[#0D1117] font-semibold text-xs transition disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}</span>
          </button>
        </div>
      </form>

      {/* List of Comments */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-xs text-[#8B949E] text-center py-4">Belum ada ulasan. Jadilah yang pertama memberikan ulasan!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="bg-[#0D1117] border border-[#374151] rounded-[6px] p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1F2328] border border-[#374151] flex items-center justify-center text-[#5FED83] text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-white">{c.username}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{c.rating}.0</span>
                </div>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed pl-9">{c.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
