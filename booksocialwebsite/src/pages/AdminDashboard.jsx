import { useEffect, useMemo, useState } from 'react';
import {
  ShieldCheck,
  Users,
  BookOpen,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  MessageSquareText,
  Star,
  BookText,
  Clock,
  Ban,
  Search,
  X,
  ArrowLeft,
} from 'lucide-react';
import { authService, bookService, chapterService, commentService } from '../services/apiServices';
import { useSearchParams } from 'react-router-dom';

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const statusLabel = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Bị từ chối',
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [searchParams] = useSearchParams();
  const [activeBookStatus, setActiveBookStatus] = useState('ALL');
  const [userSearch, setUserSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');

  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [error, setError] = useState('');

  // Drawer chi tiết sách
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [bookDetails, setBookDetails] = useState({});
  const [loadingDetailsForBook, setLoadingDetailsForBook] = useState({});
  const [bookDetailTab, setBookDetailTab] = useState('overview'); // 'overview' | 'chapters' | 'ratings'
  const [drillChapterId, setDrillChapterId] = useState(null); // chương đang xem bình luận, null = đang ở danh sách chương

  const tabs = useMemo(
    () => [
      { id: 'users', label: 'Quản lý người dùng' },
      { id: 'books', label: 'Quản lý sách' },
    ],
    []
  );

  const stats = useMemo(
    () => ({
      totalUsers: users.length,
      bannedUsers: users.filter((u) => u.active === false).length,
      totalBooks: books.length,
      pendingBooks: books.filter((b) => b.status === 'PENDING').length,
      approvedBooks: books.filter((b) => b.status === 'APPROVED').length,
      rejectedBooks: books.filter((b) => b.status === 'REJECTED').length,
    }),
    [users, books]
  );

  const bookStatusOptions = [
    { id: 'ALL', label: 'Tất cả sách', count: books.length },
    { id: 'APPROVED', label: 'Sách approved', count: stats.approvedBooks },
    { id: 'REJECTED', label: 'Sách rejected', count: stats.rejectedBooks },
    { id: 'PENDING', label: 'Sách pending', count: stats.pendingBooks },
  ];

  const filteredUsers = useMemo(() => {
    const keyword = userSearch.trim().toLowerCase();
    if (!keyword) return users;
    return users.filter((user) => {
      const haystack = `${user.fullName || ''} ${user.username || ''} ${user.email || ''}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [users, userSearch]);

  const filteredBooks = useMemo(() => {
    let list = activeBookStatus === 'ALL' ? books : books.filter((book) => book.status === activeBookStatus);
    const keyword = bookSearch.trim().toLowerCase();
    if (keyword) {
      list = list.filter((book) => {
        const haystack = `${book.title || ''} ${book.authorUsername || book.authorName || ''}`.toLowerCase();
        return haystack.includes(keyword);
      });
    }
    return list;
  }, [books, activeBookStatus, bookSearch]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const result = await authService.getAllUsers(0, 200).catch(() => []);
      setUsers(normalizeList(result));
    } catch (err) {
      console.error('Lỗi lấy danh sách người dùng:', err);
      setError('Không thể tải danh sách người dùng.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoadingBooks(true);
      const [allBooksRes, pendingRes, rejectedRes] = await Promise.all([
        bookService.getBooks({ page: 0, size: 200 }).catch(() => []),
        bookService.getPendingBooks(0, 200).catch(() => []),
        bookService.getRejectedBooks(0, 200).catch(() => []),
      ]);

      const allBooks = normalizeList(allBooksRes);
      const pendingBooks = normalizeList(pendingRes);
      const rejectedBooks = normalizeList(rejectedRes);
      const mergedBooks = [...allBooks];

      [...pendingBooks, ...rejectedBooks].forEach((book) => {
        const exists = mergedBooks.some((existingBook) => String(existingBook.id) === String(book.id));
        if (!exists) mergedBooks.push(book);
      });

      setBooks(mergedBooks);
    } catch (err) {
      console.error('Lỗi lấy danh sách sách:', err);
      setError('Không thể tải danh sách sách.');
    } finally {
      setLoadingBooks(false);
    }
  };

  const refreshAdminData = async () => {
    setError('');
    await Promise.all([fetchUsers(), fetchBooks()]);
  };

  useEffect(() => {
    refreshAdminData();
  }, []);
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const statusParam = searchParams.get('status');

    if (tabParam === 'books') setActiveTab('books');
    if (statusParam && ['PENDING', 'APPROVED', 'REJECTED'].includes(statusParam)) {
        setActiveBookStatus(statusParam);
    }
    }, [searchParams]);

  const fetchBookDetails = async (bookId) => {
    if (bookDetails[bookId]) return;
    setLoadingDetailsForBook((prev) => ({ ...prev, [bookId]: true }));

    try {
      const [ratingsRes, chaptersRes] = await Promise.all([
        bookService.getRatings(bookId).catch(() => []),
        bookService.getChapters(bookId, 0, 100).catch(() => ({ content: [] })),
      ]);

      setBookDetails((prev) => ({
        ...prev,
        [bookId]: {
          ratings: normalizeList(ratingsRes),
          chapters: normalizeList(chaptersRes),
          commentsByChapter: {},
        },
      }));
    } catch (err) {
      console.error('Lỗi tải chi tiết sách:', err);
      setError('Không thể tải chi tiết sách cho admin.');
    } finally {
      setLoadingDetailsForBook((prev) => ({ ...prev, [bookId]: false }));
    }
  };

  const fetchChapterComments = async (bookId, chapterId) => {
    try {
      const comments = await chapterService.getComments(chapterId, 0, 100).catch(() => []);
      setBookDetails((prev) => ({
        ...prev,
        [bookId]: {
          ...prev[bookId],
          commentsByChapter: {
            ...(prev[bookId]?.commentsByChapter || {}),
            [chapterId]: normalizeList(comments),
          },
        },
      }));
    } catch (err) {
      console.error('Lỗi tải bình luận:', err);
    }
  };

  const openBookDrawer = async (book) => {
    setSelectedBookId(book.id);
    setBookDetailTab('overview');
    setDrillChapterId(null);
    setDrawerOpen(true);
    if (!bookDetails[book.id]) {
      await fetchBookDetails(book.id);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const handleOpenChapterComments = async (bookId, chapterId) => {
    setDrillChapterId(chapterId);
    if (!bookDetails[bookId]?.commentsByChapter?.[chapterId]) {
      await fetchChapterComments(bookId, chapterId);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa người dùng này khỏi hệ thống?');
    if (!confirmed) return;

    try {
      await authService.deleteUser(userId);
      await fetchUsers();
    } catch (err) {
      console.error('Lỗi xóa người dùng:', err);
      alert('Không thể xóa người dùng.');
    }
  };

  const handleBookStatus = async (bookId, action) => {
    try {
      if (action === 'approve') await bookService.approveBook(bookId);
      if (action === 'reject') await bookService.rejectBook(bookId);
      await fetchBooks();
      if (selectedBookId === bookId && bookDetails[bookId]) {
        setBookDetails((prev) => {
          const next = { ...prev };
          delete next[bookId];
          return next;
        });
        await fetchBookDetails(bookId);
      }
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái sách:', err);
      alert('Không thể cập nhật trạng thái sách.');
    }
  };

  const handleDeleteBook = async (bookId) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa sách này?');
    if (!confirmed) return;

    try {
      await bookService.deleteBook(bookId);
      if (selectedBookId === bookId) closeDrawer();
      await fetchBooks();
    } catch (err) {
      console.error('Lỗi xóa sách:', err);
      alert('Không thể xóa sách.');
    }
  };

  const handleDeleteRating = async (bookId, ratingId) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa đánh giá này không?');
    if (!confirmed) return;

    try {
      await bookService.deleteRating(ratingId);
      setBookDetails((prev) => ({
        ...prev,
        [bookId]: {
          ...prev[bookId],
          ratings: (prev[bookId]?.ratings || []).filter((item) => item.id !== ratingId),
        },
      }));
    } catch (err) {
      console.error('Lỗi xóa rating:', err);
      alert('Không thể xóa đánh giá.');
    }
  };

  const handleDeleteChapter = async (bookId, chapterId) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa chương này không?');
    if (!confirmed) return;

    try {
      await chapterService.deleteChapter(chapterId);
      setBookDetails((prev) => ({
        ...prev,
        [bookId]: {
          ...prev[bookId],
          chapters: (prev[bookId]?.chapters || []).filter((chapter) => (chapter.id || chapter.chapterId) !== chapterId),
          commentsByChapter: Object.fromEntries(
            Object.entries(prev[bookId]?.commentsByChapter || {}).filter(([id]) => id !== String(chapterId))
          ),
        },
      }));
      if (drillChapterId === chapterId) setDrillChapterId(null);
    } catch (err) {
      console.error('Lỗi xóa chương:', err);
      alert('Không thể xóa chương.');
    }
  };

  const handleDeleteComment = async (bookId, chapterId, commentId) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?');
    if (!confirmed) return;

    try {
      await commentService.deleteComment(commentId);
      setBookDetails((prev) => ({
        ...prev,
        [bookId]: {
          ...prev[bookId],
          commentsByChapter: {
            ...(prev[bookId]?.commentsByChapter || {}),
            [chapterId]: (prev[bookId]?.commentsByChapter?.[chapterId] || []).filter((item) => item.id !== commentId),
          },
        },
      }));
    } catch (err) {
      console.error('Lỗi xóa bình luận:', err);
      alert('Không thể xóa bình luận.');
    }
  };

  const selectedBook = books.find((b) => b.id === selectedBookId) || null;
  const selectedDetail = (selectedBookId && bookDetails[selectedBookId]) || { ratings: [], chapters: [], commentsByChapter: {} };
  const selectedChapter = selectedDetail.chapters.find((c) => (c.id || c.chapterId) === drillChapterId) || null;
  const drillComments = drillChapterId ? selectedDetail.commentsByChapter?.[drillChapterId] || [] : [];

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Panel
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">Quản lý hệ thống</h1>
          </div>

          <button
            onClick={refreshAdminData}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-indigo-500 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Tải lại
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Tổng người dùng', value: stats.totalUsers, icon: Users, color: 'text-indigo-300 border-indigo-500/20 bg-indigo-500/10' },
          { label: 'Tài khoản bị khóa', value: stats.bannedUsers, icon: Ban, color: 'text-rose-300 border-rose-500/20 bg-rose-500/10' },
          { label: 'Tổng số sách', value: stats.totalBooks, icon: BookOpen, color: 'text-sky-300 border-sky-500/20 bg-sky-500/10' },
          { label: 'Sách chờ duyệt', value: stats.pendingBooks, icon: Clock, color: 'text-amber-300 border-amber-500/20 bg-amber-500/10' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg border ${s.color}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <p className="text-xl font-black text-white">{s.value}</p>
            <p className="text-[11px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-white">Danh sách người dùng</h2>
            <span className="text-xs text-slate-400">{filteredUsers.length}/{users.length} tài khoản</span>
          </div>

          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Tìm theo tên, username hoặc email..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {loadingUsers ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-400">Đang tải người dùng...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-400">
              {userSearch ? 'Không tìm thấy người dùng phù hợp.' : 'Chưa có người dùng nào.'}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="min-w-full divide-y divide-slate-800 text-sm">
                <thead className="bg-slate-950/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Người dùng</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Email</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Vai trò</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Trạng thái</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/30">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="transition hover:bg-slate-900/60">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white">{user.fullName || user.username || 'Người dùng'}</p>
                        <p className="text-xs text-slate-400">@{user.username || 'username'}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{user.email || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-1 text-[10px] font-semibold text-indigo-200">
                          {user.role || 'READER'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${
                            user.active
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                              : 'border-rose-500/20 bg-rose-500/10 text-rose-300'
                          }`}
                        >
                          {user.active ? 'Hoạt động' : 'Bị khóa'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-rose-300 transition hover:bg-rose-500/20"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeTab === 'books' && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-white">Danh sách sách trong hệ thống</h2>
            <span className="text-xs text-slate-400">{filteredBooks.length}/{books.length} cuốn</span>
          </div>

          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              placeholder="Tìm theo tên sách hoặc tác giả..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {bookStatusOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveBookStatus(option.id)}
                className={`rounded-xl border px-3 py-2 text-[11px] font-semibold transition ${
                  activeBookStatus === option.id
                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200'
                    : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-600 hover:text-white'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>

          {loadingBooks ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-400">Đang tải sách...</div>
          ) : filteredBooks.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-400">
              Không có sách nào khớp với bộ lọc hiện tại.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="min-w-full divide-y divide-slate-800 text-sm">
                <thead className="bg-slate-950/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Sách</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tác giả</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Trạng thái</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/30">
                  {filteredBooks.map((book) => (
                    <tr
                      key={book.id}
                      onClick={() => openBookDrawer(book)}
                      className={`cursor-pointer transition hover:bg-slate-900/60 ${selectedBookId === book.id && drawerOpen ? 'bg-slate-900/70' : ''}`}
                    >
                      <td className="max-w-xs px-4 py-3">
                        <p className="truncate font-semibold text-white">{book.title}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{book.authorUsername || book.authorName || 'Tác giả'}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full border border-slate-700 bg-slate-800/60 px-2 py-1 text-[10px] font-semibold text-slate-200">
                          {statusLabel[book.status] || book.status || 'Không rõ'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          {book.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleBookStatus(book.id, 'approve')}
                              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-1.5 text-emerald-300 transition hover:bg-emerald-500/20"
                              title="Duyệt"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                          {book.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleBookStatus(book.id, 'reject')}
                              className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-1.5 text-amber-300 transition hover:bg-amber-500/20"
                              title="Từ chối"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-300 transition hover:bg-rose-500/20"
                            title="Xóa sách"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <ChevronRight className="h-4 w-4 self-center text-slate-500" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Drawer chi tiết sách */}
      <div className={`fixed inset-0 z-50 ${drawerOpen ? '' : 'pointer-events-none'}`}>
        <div
          onClick={closeDrawer}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-950 shadow-2xl transition-transform duration-300 ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {selectedBook && (
            <>
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 p-5">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="truncate">{selectedBook.title}</span>
                    {drillChapterId && selectedChapter && (
                      <>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate text-slate-200">
                          Chương {selectedChapter.chapterNumber ||  ''}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="mt-1 truncate text-lg font-bold text-white">
                    {drillChapterId && selectedChapter ? selectedChapter.title : selectedBook.title}
                  </h3>
                </div>
                <button
                  onClick={closeDrawer}
                  className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {drillChapterId ? (
                  <>
                    <button
                      onClick={() => setDrillChapterId(null)}
                      className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 transition hover:text-indigo-200"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Quay lại danh sách chương
                    </button>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                        <MessageSquareText className="h-4 w-4 text-sky-400" />
                        Bình luận trong chương
                      </div>

                      {drillComments.length === 0 ? (
                        <div className="text-sm text-slate-400">Chưa có bình luận nào trong chương này.</div>
                      ) : (
                        <div className="space-y-2">
                          {drillComments.map((comment) => (
                            <div
                              key={comment.id}
                              className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-white">{comment.username || 'Người dùng'}</p>
                                <p className="mt-1 text-xs text-slate-300 break-words">{comment.content || 'Không có nội dung'}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteComment(selectedBookId, drillChapterId, comment.id)}
                                className="shrink-0 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-300 transition hover:bg-rose-500/20"
                                title="Xóa bình luận"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4 inline-flex rounded-xl border border-slate-800 bg-slate-900 p-1">
                      <button
                        onClick={() => setBookDetailTab('overview')}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition ${
                          bookDetailTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <BookOpen className="h-3.5 w-3.5" /> Tổng quan
                      </button>
                      <button
                        onClick={() => setBookDetailTab('chapters')}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition ${
                          bookDetailTab === 'chapters' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <BookText className="h-3.5 w-3.5" /> Chương ({selectedDetail.chapters.length})
                      </button>
                      <button
                        onClick={() => setBookDetailTab('ratings')}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition ${
                          bookDetailTab === 'ratings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Star className="h-3.5 w-3.5" /> Rating ({selectedDetail.ratings.length})
                      </button>
                    </div>

                    {loadingDetailsForBook[selectedBookId] ? (
                      <div className="text-sm text-slate-400">Đang tải...</div>
                    ) : bookDetailTab === 'overview' ? (
                      <div className="space-y-4">
                        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
                          {selectedBook.coverImage ? (
                            <img
                              src={selectedBook.coverImage}
                              alt={selectedBook.title}
                              className="h-48 w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-48 items-center justify-center bg-gradient-to-br from-indigo-600/20 to-slate-800 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                              Cover
                            </div>
                          )}
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">Tên sách</p>
                              <h4 className="mt-1 text-lg font-bold text-white break-words">{selectedBook.title}</h4>
                            </div>
                            <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] font-semibold text-slate-200">
                              {statusLabel[selectedBook.status] || selectedBook.status || 'Không rõ'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-2.5">
                              <p className="text-[10px] uppercase tracking-wider text-slate-400">Tác giả</p>
                              <p className="mt-1 font-semibold text-white">{selectedBook.authorUsername || selectedBook.authorName || 'Không rõ'}</p>
                            </div>
                            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-2.5">
                              <p className="text-[10px] uppercase tracking-wider text-slate-400">Ngôn ngữ</p>
                              <p className="mt-1 font-semibold text-white">{selectedBook.language || 'Không rõ'}</p>
                            </div>
                            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-2.5">
                              <p className="text-[10px] uppercase tracking-wider text-slate-400">Lượt xem</p>
                              <p className="mt-1 font-semibold text-white">{selectedBook.viewCount || 0}</p>
                            </div>
                            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-2.5">
                              <p className="text-[10px] uppercase tracking-wider text-slate-400">Số chương</p>
                              <p className="mt-1 font-semibold text-white">{selectedBook.totalChapters || selectedDetail.chapters.length || 0}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Danh mục</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {(selectedBook.categories || []).length > 0 ? (
                                (selectedBook.categories || []).map((category) => (
                                  <span
                                    key={category.id || category.name}
                                    className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-1 text-[10px] font-medium text-indigo-200"
                                  >
                                    {category.name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-slate-400">Chưa có danh mục</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {selectedBook.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleBookStatus(selectedBook.id, 'approve')}
                              className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20"
                            >
                              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Approve</span>
                            </button>
                          )}
                          {selectedBook.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleBookStatus(selectedBook.id, 'reject')}
                              className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs font-bold text-amber-300 transition hover:bg-amber-500/20"
                            >
                              <span className="inline-flex items-center gap-2"><XCircle className="h-4 w-4" /> Reject</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ) : bookDetailTab === 'ratings' ? (
                      selectedDetail.ratings.length === 0 ? (
                        <div className="text-sm text-slate-400">Chưa có rating nào cho sách này.</div>
                      ) : (
                        <div className="space-y-2">
                          {selectedDetail.ratings.map((rating) => (
                            <div
                              key={rating.id}
                              className="rounded-xl border border-slate-800 bg-slate-900/70 p-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-white">Người đánh giá: {rating.username || 'Người dùng'}</p>
                                  <p className="mt-1 text-xs text-slate-400">Số sao: {rating.star || 0}★</p>
                                  <p className="mt-2 text-xs leading-5 text-slate-300 break-words"> Nhận xét: {rating.review}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleDeleteRating(selectedBookId, rating.id)}
                                  className="shrink-0 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-300 transition hover:bg-rose-500/20"
                                  title="Xóa rating"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    ) : selectedDetail.chapters.length === 0 ? (
                      <div className="text-sm text-slate-400">Sách này chưa có chương nào.</div>
                    ) : (
                      <div className="space-y-2">
                        {selectedDetail.chapters.map((chapter) => {
                          const chapterId = chapter.id || chapter.chapterId;
                          return (
                            <div
                              key={chapterId}
                              className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3"
                            >
                              <button
                                onClick={() => handleOpenChapterComments(selectedBookId, chapterId)}
                                className="min-w-0 flex-1 text-left"
                              >
                                <p className="truncate text-sm font-semibold text-white transition hover:text-indigo-300">
                                  Chương {chapter.chapterNumber || chapter.order || ''}: {chapter.title}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-400">Xem bình luận</p>
                              </button>
                              <div className="flex shrink-0 gap-2">
                                <button
                                  onClick={() => handleOpenChapterComments(selectedBookId, chapterId)}
                                  className="rounded-lg border border-sky-500/30 bg-sky-500/10 p-2 text-sky-300 transition hover:bg-sky-500/20"
                                  title="Xem bình luận"
                                >
                                  <MessageSquareText className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteChapter(selectedBookId, chapterId)}
                                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-300 transition hover:bg-rose-500/20"
                                  title="Xóa chương"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}