import React from 'react';
import BookCard from './BookCard';
import { BookX, Loader2 } from 'lucide-react';

export default function BookGrid({ books, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Đang tải danh sách sách...</p>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 space-y-3">
        <BookX className="w-12 h-12 text-slate-600" />
        <h4 className="text-base font-bold text-slate-300">Không tìm thấy tựa sách nào</h4>
        <p className="text-xs text-slate-500 max-w-sm">
          Thử tìm kiếm với từ khóa khác hoặc chọn thể loại sách tương ứng.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}