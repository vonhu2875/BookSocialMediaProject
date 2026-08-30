import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookService } from '../services/apiServices';
import CategoryBar from '../components/CategoryBar';
import BookGrid from '../components/BookGrid';
import { ChevronLeft, ChevronRight, BookOpenText } from 'lucide-react';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Lấy keyword từ URL (nếu có bấm Tìm kiếm trên Navbar)
  const keywordParam = searchParams.get('keyword') || '';

  // State quản lý danh sách sách và phân trang
  const [books, setBooks] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy sách mỗi khi Thể loại, Trạng thái phân trang hoặc Keyword thay đổi
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = {
          page: page,
          size: 10,
          keyword: keywordParam || undefined,
          categoryIds: selectedCategoryId ? [selectedCategoryId] : undefined,
        };

        // Backend trả về Page<BookListResponse>
        const response = await bookService.getBooks(params);
        setBooks(response.content || []);
        setTotalPages(response.totalPages || 0);
      } catch (error) {
        console.error('Lỗi tải danh sách sách:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [selectedCategoryId, page, keywordParam]);

  // Xử lý khi bấm chuyển Thể Loại
  const handleSelectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setPage(0); // Reset về trang đầu tiên
  };

  return (
    <div className="space-y-8">
      {/* Banner Tiêu Đề Trang */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 p-6 sm:p-10 border border-slate-800 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-300">
            <BookOpenText className="w-3.5 h-3.5" />
            Khám phá kho sách
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide leading-tight">
            Thỏa sức khám phá những <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
              Chương sách đặc sắc nhất
            </span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Hàng ngàn tựa sách đa dạng thể loại. Đọc trực tuyến, thảo luận cùng cộng đồng và rèn luyện kiến thức bằng Quiz AI.
          </p>
        </div>
      </div>

      {/* Bộ Lọc Thể Loại */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Danh mục thể loại</h2>
        <CategoryBar
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
        />
      </div>

      {/* Hiển thị Keyword đang tìm nếu có */}
      {keywordParam && (
        <div className="flex items-center justify-between bg-indigo-950/40 border border-indigo-800/40 px-4 py-3 rounded-2xl text-xs sm:text-sm text-indigo-200">
          <span>Kết quả tìm kiếm cho: <strong className="text-white">"{keywordParam}"</strong></span>
          <button 
            onClick={() => setSearchParams({})}
            className="text-indigo-400 hover:text-white font-semibold underline ml-2"
          >
            Xóa tìm kiếm
          </button>
        </div>
      )}

      {/* Lưới Sách */}
      <BookGrid books={books} loading={loading} />

      {/* Phân Trang (Pagination) */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-slate-800/80">
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs sm:text-sm font-semibold text-slate-400">
            Trang <strong className="text-white">{page + 1}</strong> / {totalPages}
          </span>

          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}