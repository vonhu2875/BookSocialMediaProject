import { useState, useEffect } from 'react';
import { bookService, authService } from '../services/apiServices';
import { Star, MessageSquare, Send, Loader2, User, Edit3, X, Check, Trash2 } from 'lucide-react';

export default function RatingSection({ bookId }) {
  const [summary, setSummary] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [star, setStar] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingRatingId, setEditingRatingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, listRes, myInfoRes] = await Promise.all([
        bookService.getRatingSummary(bookId),
        bookService.getRatings(bookId),
        authService.getMyInfo().catch(() => null),
      ]);

      const sumData = sumRes;
      const rawList = listRes;
      const myInfo = myInfoRes;

      setSummary(sumData);
      setRatings(rawList);
      if (myInfo?.id) setCurrentUserId(myInfo.id);
    } catch (error) {
      console.error('Lỗi tải đánh giá:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) fetchData();
  }, [bookId]);

  const handleStartEdit = (item) => {
    setEditingRatingId(item.id);
    setStar(item.star);
    setReview(item.review);
    window.scrollTo({ top: document.getElementById('rating-form')?.offsetTop - 100, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingRatingId(null);
    setStar(0);
    setReview('');
  };

  // Xóa Đánh giá
  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài đánh giá này?')) return;
    try {
      await bookService.deleteRating(ratingId); // Gọi hàm xóa từ apiServices
      if (editingRatingId === ratingId) handleCancelEdit();
      fetchData();
    } catch (error) {
      console.error('Lỗi xóa đánh giá:', error);
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (star === 0 || !review.trim()) return;

    setSubmitting(true);
    try {
      if (editingRatingId) {
        await bookService.updateRating(editingRatingId, { star, review });
      } else {
        await bookService.addRating(bookId, { star, review });
      }

      handleCancelEdit();
      fetchData();
    } catch (error) {
      console.error('Lỗi gửi/sửa đánh giá:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
        <span className="text-sm">Đang tải đánh giá...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Summary */}
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="text-center md:border-r md:border-slate-800 md:pr-8 shrink-0">
          <div className="text-4xl font-extrabold text-white">
            {summary?.averageStar ? summary.averageStar.toFixed(1) : '0.0'}
          </div>
          <div className="flex justify-center gap-1 my-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(summary?.averageStar || 0) ? 'fill-amber-400' : 'text-slate-700'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">{summary?.totalRatings || 0} lượt đánh giá</span>
        </div>

        <div className="w-full space-y-1.5 flex-1">
          {[5, 4, 3, 2, 1].map((s) => {
            const count = summary?.[`star${s}`] || 0;
            const percent = summary?.totalRatings ? (count / summary.totalRatings) * 100 : 0;
            return (
              <div key={s} className="flex items-center gap-3 text-xs">
                <span className="w-3 font-semibold text-slate-400">{s}</span>
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
                <span className="w-8 text-right text-slate-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Form Gửi / Sửa */}
      <form
        id="rating-form"
        onSubmit={handleSubmitRating}
        className={`p-5 rounded-2xl space-y-4 transition-all duration-300 border ${
          editingRatingId
            ? 'bg-indigo-950/30 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
            : 'bg-slate-900/40 border-slate-800/80'
        }`}
      >
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            {editingRatingId ? (
              <>
                <Edit3 className="w-4 h-4 text-amber-400" /> Chỉnh sửa đánh giá của bạn
              </>
            ) : (
              'Viết đánh giá của bạn'
            )}
          </h4>

          {editingRatingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition"
            >
              <X className="w-3.5 h-3.5" /> Hủy sửa
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-400">Đánh giá của bạn:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setStar(s)}
                onMouseEnter={() => setHoverStar(s)}
                onMouseLeave={() => setHoverStar(0)}
                className="p-1 hover:scale-125 transition focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    s <= (hoverStar || star) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs text-amber-400 font-bold ml-1">
            {(hoverStar || star) > 0 ? `${hoverStar || star} sao` : '(Chưa chọn sao)'}
          </span>
        </div>

        <div className="relative">
          <textarea
            rows="3"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Cảm nhận của bạn về cuốn sách..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition"
          />
          <button
            type="submit"
            disabled={submitting || star === 0 || !review.trim()}
            className={`absolute bottom-3.5 right-3.5 px-4 py-2 text-white rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition ${
              editingRatingId
                ? 'bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30'
            }`}
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : editingRatingId ? (
              <>
                <Check className="w-3.5 h-3.5" /> Cập nhật
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Gửi đánh giá
              </>
            )}
          </button>
        </div>
      </form>

      {/* 3. Danh sách Đánh giá */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" /> BÌNH LUẬN ĐÁNH GIÁ ({ratings.length})
        </h4>

        {ratings.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">Chưa có đánh giá nào cho sách này.</p>
        ) : (
          ratings.map((item) => {
            const isMyRating = currentUserId && item.userId === currentUserId;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl space-y-2 border transition ${
                  isMyRating
                    ? 'bg-indigo-950/20 border-indigo-500/30'
                    : 'bg-slate-900/50 border-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.username} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <span className="text-xs font-bold text-slate-200">
                      {item.username} {isMyRating && <span className="text-[10px] text-indigo-400 font-normal">(Bạn)</span>}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Thao tác Sửa & Xóa nếu là Review của chính User */}
                    {isMyRating && (
                      <div className="flex items-center gap-2 mr-2">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold transition"
                          title="Sửa"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRating(item.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold transition"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= item.star ? 'fill-amber-400' : 'text-slate-800'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 pl-9">{item.review}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}