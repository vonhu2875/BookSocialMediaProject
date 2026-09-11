import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, bookService } from '../../services/apiServices';
import { 
  Bookmark, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  PlayCircle, 
  Search, 
  ArrowRight,
  BookMarked,
  Loader2,
  Heart,
  HeartOff,
} from 'lucide-react';

const getListFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  return response?.content || response?.items || [];
};

const getBookId = (item) => item.bookId || item.book?.id || item.id;
const getBookTitle = (item) => item.title || item.book?.title || 'Sách không tên';
const getBookCover = (item) => item.coverImage || item.book?.coverImage;
const getBookAuthor = (item) => item.authorName || item.authorUsername || item.book?.authorUsername;

export default function Bookshelfs() {
  const navigate = useNavigate();
  const [bookshelfItems, setBookshelfItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'READING' | 'COMPLETED' | 'FAVORITES'
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Gọi API Lấy Danh Sách Tủ Sách Thực Tế: GET /users/bookshelfs
  useEffect(() => {
    const fetchBookshelf = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [bookshelfResponse, favoriteResponse] = await Promise.all([
          authService.getMyBookshelf(),
          authService.getMyBookshelfFavorite().catch(() => []),
        ]);

        setBookshelfItems(getListFromResponse(bookshelfResponse));
        setFavoriteItems(getListFromResponse(favoriteResponse));
      } catch (err) {
        console.error('Lỗi khi tải tủ sách:', err);
        setError('Không thể tải danh sách tủ sách. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookshelf();
  }, []);

  // 2. Gọi API Xóa Sách Khỏi Tủ Thực Tế: DELETE /books/{bookId}/bookshelfs
  const handleRemoveFromShelf = async (bookId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Bạn có chắc muốn xóa sách này khỏi tủ sách?')) return;

    try {
      await bookService.removeFromBookshelf(bookId);
      // Cập nhật lại UI sau khi xóa thành công
      setBookshelfItems(prev => prev.filter(item => item.bookId !== bookId));
    } catch (err) {
      console.error('Lỗi khi xóa khỏi tủ sách:', err);
      alert('Xóa khỏi tủ sách thất bại!');
    }
  };

  const handleToggleFavorite = async (bookId, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await bookService.updateBookshelfFavorite(bookId);
      setFavoriteItems((prev) => prev.filter((item) => getBookId(item) !== bookId));
    } catch (err) {
      console.error('Lỗi cập nhật sách yêu thích:', err);
      alert('Cập nhật sách yêu thích thất bại!');
    }
  };

  // Lọc danh sách theo từ khóa & trạng thái
  const filteredBooks = bookshelfItems.filter(item => {
    const title = item.title || '';
    const isCompleted = item.status === 'COMPLETED' || item.completed === true;

    const matchStatus = 
      filterStatus === 'ALL' || 
      (filterStatus === 'COMPLETED' && isCompleted) || 
      (filterStatus === 'READING' && !isCompleted);

    const matchQuery = title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchQuery;
  });

  const filteredFavoriteItems = favoriteItems.filter((item) =>
    getBookTitle(item).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Thống kê
  const totalBooks = bookshelfItems.length;
  const completedCount = bookshelfItems.filter(i => i.status === 'COMPLETED' || i.completed === true).length;
  const readingCount = totalBooks - completedCount;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-2" />
        <span>Đang tải tủ sách...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-indigo-500 fill-indigo-500/20" />
              Tủ Sách Cá Nhân
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Quản lý tiến độ đọc và tiếp tục những chương sách còn dang dở.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Lọc sách trong tủ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Thống Kê Nhanh */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Tổng Số Sách</p>
              <p className="text-2xl font-bold text-white">{totalBooks}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Đang Đọc</p>
              <p className="text-2xl font-bold text-white">{readingCount}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Đã Hoàn Thành</p>
              <p className="text-2xl font-bold text-white">{completedCount}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Heart className="w-6 h-6 fill-rose-400/20" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Đã Thích</p>
              <p className="text-2xl font-bold text-white">{favoriteItems.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs Filter */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              filterStatus === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Tất cả ({totalBooks})
          </button>
          <button
            onClick={() => setFilterStatus('READING')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              filterStatus === 'READING'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Đang đọc ({readingCount})
          </button>
          <button
            onClick={() => setFilterStatus('COMPLETED')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              filterStatus === 'COMPLETED'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Đã xong ({completedCount})
          </button>
          <button
            onClick={() => setFilterStatus('FAVORITES')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              filterStatus === 'FAVORITES'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            Đã thích ({favoriteItems.length})
          </button>
        </div>

        {/* Grid Danh Sách Sách */}
        {filterStatus === 'FAVORITES' ? (
          filteredFavoriteItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavoriteItems.map((item) => {
                const bookId = getBookId(item);
                const title = getBookTitle(item);
                const authorName = getBookAuthor(item);
                const coverUrl = getBookCover(item);
                const lastChapterId = item.lastReadChapterId;
                const isCompleted = item.status === 'COMPLETED' || item.completed === true;

                return (
                  <div
                    key={bookId}
                    className="group relative bg-slate-900 border border-slate-800/80 hover:border-rose-500/50 rounded-2xl p-4 flex gap-4 transition duration-300 shadow-lg"
                  >
                    <Link to={`/books/${bookId}`} className="shrink-0 overflow-hidden rounded-xl">
                      {coverUrl ? (
                        <img src={coverUrl} alt={title} className="w-24 h-36 object-cover rounded-xl group-hover:scale-105 transition duration-300" />
                      ) : (
                        <div className="w-24 h-36 flex items-center justify-center text-slate-600 bg-slate-950 rounded-xl">
                          <BookOpen className="w-10 h-10" />
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link to={`/books/${bookId}`}>
                            <h3 className="font-bold text-slate-100 hover:text-rose-300 transition line-clamp-1 text-base">{title}</h3>
                          </Link>
                          <button
                            onClick={(e) => handleToggleFavorite(bookId, e)}
                            title="Bỏ lưu sách yêu thích"
                            className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-500/10 transition"
                          >
                            <HeartOff className="w-4 h-4" />
                          </button>
                        </div>
                        {authorName && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                            Tác giả: <span className="text-slate-300">{authorName}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 my-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Tiến độ:</span>
                          <span className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {isCompleted ? 'Đã hoàn thành' : 'Đang đọc'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'} h-2 rounded-full transition-all duration-500`}
                            style={{ width: isCompleted ? '100%' : '0%' }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (lastChapterId) {
                            navigate(`/chapters/${lastChapterId}`);
                          } else {
                            navigate(`/books/${bookId}`);
                          }
                        }}
                        className="w-full mt-1 px-3 py-2 bg-rose-600/10 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 hover:border-transparent rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition duration-200"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>{isCompleted ? 'Đọc lại' : 'Đọc tiếp'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center bg-slate-900/40 border border-slate-800/60 rounded-3xl text-sm text-slate-400">
              Chưa có sách yêu thích. Hãy nhấn biểu tượng trái tim ở trang chi tiết sách.
            </div>
          )
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((item) => {
              const bookId = item.bookId;
              const title = item.title || 'Sách không tên';
              const authorName = item.authorName;
              const coverUrl = item.coverImage;
              const lastChapterId = item.lastReadChapterId;
              const isCompleted = item.status === 'COMPLETED' || item.completed === true;

              return (
                <div
                  key={item.id || bookId}
                  className="group relative bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl p-4 flex gap-4 transition duration-300 shadow-lg hover:shadow-indigo-500/5"
                >
                  <Link to={`/books/${bookId}`} className="shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={coverUrl || undefined}
                      alt={title}
                      className="w-24 h-36 object-cover rounded-xl group-hover:scale-105 transition duration-300"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link to={`/books/${bookId}`}>
                          <h3 className="font-bold text-slate-100 hover:text-indigo-400 transition line-clamp-1 text-base">
                            {title}
                          </h3>
                        </Link>
                        <button
                          onClick={(e) => handleRemoveFromShelf(bookId, e)}
                          title="Xóa khỏi tủ sách"
                          className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {authorName && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                          Tác giả: <span className="text-slate-300">{authorName}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 my-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Tiến độ:</span>
                        <span className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {isCompleted ? 'Đã hoàn thành' : 'Đang đọc'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'} h-2 rounded-full transition-all duration-500`}
                          style={{ width: isCompleted ? '100%' : '0%' }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (lastChapterId) {
                          navigate(`/chapters/${lastChapterId}`);
                        } else {
                          navigate(`/books/${bookId}`);
                        }
                      }}
                      className="w-full mt-1 px-3 py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-transparent rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition duration-200"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{isCompleted ? 'Đọc lại' : 'Đọc tiếp'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800/60 rounded-3xl space-y-4">
            <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto text-slate-500">
              <BookMarked className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-200">Chưa có sách trong tủ</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery
                  ? 'Không tìm thấy sách phù hợp với từ khóa.'
                  : 'Hãy khám phá và thêm những cuốn sách yêu thích vào tủ sách của bạn.'}
              </p>
            </div>
            {!searchQuery && (
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition"
              >
                <span>Khám Phá Sách Mới</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}

      </div>
    </div>
  );
}