import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService, bookService } from '../../services/apiServices';
import { 
  BookOpen, 
  PlusCircle, 
  Clock,
  CheckCircle2,
  XCircle,
  Eye, 
  Plus, 
  Edit3, 
  Trash2, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  BookMarked,
  Globe,
  User
} from 'lucide-react';

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // 1. Gọi API Lấy Danh Sách Sách Của Tôi: GET /users/books?page=x&size=6
  const fetchMyBooks = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.getMyBooks(page, 6);
      const data = response;

      setBooks(data.content);
      setPageInfo({
        page: data.number,
        totalPages: data.totalPages
      });
    } catch (err) {
      console.error('Lỗi khi tải danh sách sách:', err);
      setError('Không thể tải danh sách sách của bạn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks(0);
  }, []);

  // Xóa sách (DELETE /books/{id})
  const handleDeleteBook = async (bookId, e) => {
    e.preventDefault();
    if (!window.confirm('Bạn có chắc chắn muốn xóa cuốn sách này không?')) return;

    try {
      await bookService.deleteBook(bookId);
      setBooks(prev => prev.filter(b => b.id !== bookId));
    } catch (err) {
      console.error('Lỗi khi xóa sách:', err);
      alert(err?.message || err?.response?.data?.message || 'Xóa sách thất bại!');
    }
  };

  const statusLabels = {
    ALL: `Tất cả (${books.length})`,
    APPROVED: `Đã duyệt (${books.filter((book) => book.status === 'APPROVED').length})`,
    PENDING: `Chờ duyệt (${books.filter((book) => book.status === 'PENDING').length})`,
    REJECTED: `Bị từ chối (${books.filter((book) => book.status === 'REJECTED').length})`,
  };

  const filteredBooks = filterStatus === 'ALL'
    ? books
    : books.filter((book) => book.status === filterStatus);

  const renderStatusBadge = (status) => {
    const statusConfig = {
      APPROVED: {
        label: 'Đã duyệt',
        icon: CheckCircle2,
        className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      },
      PENDING: {
        label: 'Chờ duyệt',
        icon: Clock,
        className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      },
      REJECTED: {
        label: 'Bị từ chối',
        icon: XCircle,
        className: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      },
    };
    const config = statusConfig[status];
    if (!config) return null;
    const StatusIcon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${config.className}`}>
        <StatusIcon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  if (loading && pageInfo.page === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-2" />
        <span>Đang tải sách của bạn...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-indigo-500" />
              Sách Của Tôi
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Quản lý các tác phẩm bạn đã đăng và thêm các chương sách mới.
            </p>
          </div>

          <Link
            to="/books/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Đăng Sách Mới</span>
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs sm:text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {Object.entries(statusLabels).map(([status, label]) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid Danh Sách Sách */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex gap-4 transition duration-200 shadow-xl"
              >
                {/* Bìa Sách */}
                <Link to={`/books/${book.id}`} className="shrink-0">
                  <img
                    src={book.coverImage || undefined}
                    alt={book.title}
                    className="w-24 h-36 object-cover rounded-xl border border-slate-800"
                  />
                </Link>

                {/* Thông Tin */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      {renderStatusBadge(book.status)}
                      <button
                        onClick={(e) => handleDeleteBook(book.id, e)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition"
                        title="Xóa sách"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <Link to={`/books/${book.id}`}>
                      <h3 className="font-bold text-slate-100 hover:text-indigo-400 transition line-clamp-1 text-base mt-1">
                        {book.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        {book.viewCount || 0} lượt xem
                      </span>
                      <span>•</span>
                      <span>{book.totalChapters || 0} chương</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{book.authorUsername || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                      <span>{book.language === 'ENGLISH' ? 'Tiếng Anh' : 'Tiếng Việt'}</span>
                    </div>
                    {book.categories?.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {book.categories.map((category) => (
                          <span key={category.id} className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-[10px] text-indigo-300">
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hành Động Quản Lý */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                    <Link
                      to={`/books/${book.id}/chapters/create`}
                      className="flex-1 px-3 py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/20 hover:border-transparent rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Chương</span>
                    </Link>

                    <Link
                      to={`/books/${book.id}/edit`}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
                      title="Sửa thông tin"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Trạng thái trống */
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-4">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-500">
              <BookMarked className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-200">Chưa có tác phẩm nào</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Bạn chưa đăng cuốn sách nào ở danh mục này. Hãy bắt đầu chia sẻ câu chuyện của bạn ngay hôm nay!
              </p>
            </div>
            <Link
              to="/books/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng Sách Mới Ngay</span>
            </Link>
          </div>
        )}

        {/* Phân Trang */}
        {pageInfo.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => fetchMyBooks(pageInfo.page - 1)}
              disabled={pageInfo.page === 0}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-slate-400 px-3">
              Trang {pageInfo.page + 1} / {pageInfo.totalPages}
            </span>
            <button
              onClick={() => fetchMyBooks(pageInfo.page + 1)}
              disabled={pageInfo.page + 1 >= pageInfo.totalPages}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}