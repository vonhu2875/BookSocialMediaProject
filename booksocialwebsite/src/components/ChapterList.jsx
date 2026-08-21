import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../services/apiServices';
import { BookOpen, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ChapterList({ bookId }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      try {
        const res = await bookService.getChapters(bookId, page, 20);
        setChapters(res?.content || []);
        setTotalPages(res?.totalPages || 0);
      } catch (error) {
        console.error('Lỗi tải danh sách chương:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) fetchChapters();
  }, [bookId, page]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
        <span className="text-sm">Đang tải danh sách chương...</span>
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-sm bg-slate-900/40 rounded-2xl border border-slate-800">
        Chưa có chương nào được đăng.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {chapters.map((chap) => (
          <Link
            key={chap.id}
            to={`/chapters/${chap.id}`}
            className="flex items-center justify-between p-3.5 bg-slate-900/70 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 rounded-xl transition duration-200 group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-sm font-medium text-slate-200 group-hover:text-indigo-300 truncate">
                Chương {chap.chapterNumber}: {chap.title}
              </span>
            </div>
            <span className="text-xs text-indigo-400 font-semibold group-hover:translate-x-1 transition">Đọc →</span>
          </Link>
        ))}
      </div>

      {/* Phân trang danh sách chương */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-slate-400">
            Trang {page + 1} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}