import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, Eye, Bookmark, Loader2 } from 'lucide-react';
import { bookService } from '../services/apiServices';

export default function BookCard({ book, initialSaved = false, onBookshelfUpdated }) {
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(initialSaved);

  return (
    <Link
      to={`/books/${book.id}`}
      className="group relative bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden transition duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-lg hover:shadow-indigo-500/10"
    >
      <div>
        {/* Ảnh Bìa Sách & Tag Lượt Xem + Nút Lưu */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover object-center object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-slate-600 bg-slate-900">
              <BookOpen className="w-12 h-12 mb-2" />
              <span className="text-xs text-center">Chưa có ảnh bìa</span>
            </div>
          )}

          {/* Số Lượt Xem (viewCount từ BookListResponse) */}
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-700/50 rounded-xl flex items-center gap-1.5 text-[11px] font-bold text-slate-200 shadow-md">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            {book.viewCount.toLocaleString()}
          </div>
        </div>

        {/* Thông Tin Sách */}
        <div className="p-4 space-y-2">
          {/* Tên Sách */}
          <h3 className="font-bold text-sm sm:text-base text-slate-100 group-hover:text-indigo-400 transition line-clamp-2 leading-snug">
            {book.title}
          </h3>

          {/* Tên Tác Giả (authorUsername từ BookListResponse) */}
          <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 truncate">
            <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            {book.authorUsername || 'Chưa cập nhật'}
          </p>
        </div>
      </div>

      {/* Footer Card: Tổng số chương (totalChapters từ BookListResponse) */}
      <div className="px-4 pb-4 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>{book.totalChapters} chương</span>
        <span className="text-indigo-400 font-semibold group-hover:underline">Đọc ngay →</span>
      </div>
    </Link>
  );
}