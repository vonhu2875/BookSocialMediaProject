import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookService, authService } from '../services/apiServices';
import ChapterList from '../components/ChapterList';
import RatingSection from '../components/RatingSection';
import {
  BookOpen,
  User,
  Eye,
  Bookmark,
  BookmarkCheck,
  BookmarkX,
  Globe,
  Loader2,
  Star,
  Share2,
  Check,
  Play,
} from 'lucide-react';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('chapters');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBookDetailData = async () => {
      setLoading(true);
      try {
        const [bookRes, summaryRes] = await Promise.all([
          bookService.getBookDetail(id),
          bookService.getRatingSummary(id).catch(() => null),
        ]);

        const bookData = bookRes?.data?.result || bookRes?.result || bookRes;
        const sumData = summaryRes?.data?.result || summaryRes?.result || summaryRes;

        setBook(bookData);
        setRatingSummary(sumData);

        try {
          const shelfRes = await authService.getMyBookshelf();
          const shelfData = shelfRes?.data?.result || shelfRes?.result || shelfRes;
          if (Array.isArray(shelfData)) {
            const found = shelfData.some((item) => item.bookId === Number(id) || item.id === Number(id));
            setIsSaved(found);
          }
        } catch {
          // Bỏ qua nếu chưa đăng nhập
        }
      } catch (error) {
        console.error('Lỗi lấy chi tiết sách:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBookDetailData();
  }, [id]);

  const handleToggleBookshelf = async () => {
    setSaving(true);
    try {
      if (isSaved) {
        await bookService.removeFromBookshelf(id);
        setIsSaved(false);
      } else {
        await bookService.addToBookshelf(id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Lỗi thao tác tủ sách:', error);
    } finally {
      setSaving(false);
    }
  };

  // Thao tác Copy Link Chia sẻ
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="text-sm">Đang tải thông tin sách...</span>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20 text-slate-400 space-y-3">
        <p className="text-lg font-semibold">Không tìm thấy thông tin cuốn sách này.</p>
        <Link to="/" className="text-xs text-indigo-400 hover:underline">Về trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 sm:p-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 shadow-2xl">
        {/* Ảnh Bìa */}
        <div className="relative aspect-[3/4] w-48 sm:w-60 shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 shadow-2xl shadow-indigo-500/10">
          {book.coverImage ? (
            <>
              <img src={book.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110 pointer-events-none" />
              <img src={book.coverImage} alt={book.title} className="relative z-10 w-full h-full object-contain p-1.5" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              <BookOpen className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Thông tin Chi tiết */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          {/* Thể loại & Trạng thái */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {book.categories?.map((cat) => (
              <span key={cat.id} className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md">
                {cat.name}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">{book.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-400" /> {book.authorUsername || 'Chưa cập nhật'}
            </span>

            <span className="flex items-center gap-1.5 text-amber-400 font-bold bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-lg">
              <Star className="w-4 h-4 fill-amber-400" /> 
              {ratingSummary?.averageStar ? ratingSummary.averageStar.toFixed(1) : '0.0'}
              <span className="text-slate-400 font-normal">({ratingSummary?.totalRatings || 0})</span>
            </span>

            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-indigo-400" /> {book.viewCount?.toLocaleString() || 0} Lượt xem
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-400" /> Ngôn ngữ: {book.language || 'Tiếng Việt'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-4 md:line-clamp-none bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
            {book.description || 'Chưa có mô tả cho cuốn sách này.'}
          </p>

          {/* Cụm Nút Thao Tác */}
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            {/* Nút Đọc từ đầu */}
            <Link
              to={`/books/${id}/chapters/${book.firstChapterId || 1}`}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition duration-300 hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" /> Đọc từ đầu
            </Link>

            {/* Nút Thêm / Bỏ lưu Tủ sách */}
            <button
              onClick={handleToggleBookshelf}
              disabled={saving}
              className={`group relative px-6 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition duration-300 shadow-lg ${
                isSaved
                  ? 'bg-emerald-600 hover:bg-rose-600 text-white shadow-emerald-600/20 hover:shadow-rose-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 group-hover:hidden" />
                  <BookmarkX className="w-4 h-4 hidden group-hover:block" />
                  <span className="group-hover:hidden">Đã lưu Tủ sách</span>
                  <span className="hidden group-hover:inline">Bỏ lưu Tủ sách</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Thêm vào Tủ sách</span>
                </>
              )}
            </button>

            {/* Nút Chia sẻ */}
            <button
              onClick={handleShare}
              className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl transition duration-300"
              title="Chia sẻ liên kết"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('chapters')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition ${
              activeTab === 'chapters'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            MỤC LỤC CHƯƠNG ({book.totalChapters || 0})
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition ${
              activeTab === 'ratings'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ĐÁNH GIÁ & REVIEW ({ratingSummary?.totalRatings || 0})
          </button>
        </div>

        {activeTab === 'chapters' ? (
          <ChapterList bookId={id} />
        ) : (
          <RatingSection bookId={id} />
        )}
      </div>
    </div>
  );
}