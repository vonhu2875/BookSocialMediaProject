import { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { chapterService, bookService } from '../services/apiServices';
import CommentSection from '../components/CommentSection';
import ChapterChat from '../components/ChapterChat';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  HelpCircle,
  ArrowLeft,
  Bot,
  Trash2,
  Settings,
  Type,
  Moon,
  BookOpen,
  Sun,
} from 'lucide-react';

export default function ChapterView() {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const commentRef = useRef(null);

  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  // State phân trang nội dung
  const [currentPage, setCurrentPage] = useState(1);
  const CHARS_PER_PAGE = 800;

  const [prevChapter, setPrevChapter] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);

  // AI Drawer State
  const [summary, setSummary] = useState(null);
  const [summarizing, setSummarizing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiMode, setAiMode] = useState('summary');
  const [deletingChatHistory, setDeletingChatHistory] = useState(false);
  const [chatResetKey, setChatResetKey] = useState(0);

  const chapterQuickPrompts = [
    'Tóm tắt nội dung chính của chương này bằng 3 điểm',
    'Nhân vật nào đóng vai trò quan trọng nhất?',
    'Chương này nói về chủ đề gì?',
    'Nêu ý chính tôi cần chú ý khi đọc chương này',
  ];

  // Reading Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('reader_font_size') || 'text-base');
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('reader_font_family') || 'font-serif');
  const lineHeight = 'leading-relaxed';
  const [theme, setTheme] = useState(() => localStorage.getItem('reader_theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('reader_font_size', fontSize);
    localStorage.setItem('reader_font_family', fontFamily);
    localStorage.setItem('reader_theme', theme);
  }, [fontSize, fontFamily, theme]);

  useEffect(() => {
    const fetchChapterData = async () => {
      setLoading(true);
      setSummary(null);
      setIsDrawerOpen(false);
      setCurrentPage(1);

      try {
        const chapRes = await chapterService.getDetail(chapterId);
        const chapterData = chapRes;
        setChapter(chapterData);

        const currentBookId = chapterData?.bookId;
        if (currentBookId) {
          const listRes = await bookService.getChapterByBookId(currentBookId).catch(() => null);
          const list = listRes?.content || [];

          const curIdNum = Number(chapterId);
          const idx = list.findIndex((c) => Number(c.id || c.chapterId) === curIdNum);

          if (idx !== -1) {
            setPrevChapter(idx > 0 ? list[idx - 1] : null);
            setNextChapter(idx < list.length - 1 ? list[idx + 1] : null);
          } else {
            const curNum = Number(chapterData?.chapterNumber);
            setPrevChapter(list.find((c) => Number(c.chapterNumber) === curNum - 1) || null);
            setNextChapter(list.find((c) => Number(c.chapterNumber) === curNum + 1) || null);
          }

          bookService.updateReadingProgress(currentBookId, chapterId).catch(() => {});
        }
      } catch (error) {
        console.error('Lỗi lấy dữ liệu chương:', error);
      } finally {
        setLoading(false);
      }
    };

    if (chapterId) {
      fetchChapterData();
    }
  }, [chapterId]);

  // CẮT ĐOẠN VĂN THÀNH TRANG
  const pages = useMemo(() => {
    if (!chapter?.content) return [];
    
    const paragraphs = chapter.content.split('\n');
    const pageList = [];
    let currentChunk = '';

    paragraphs.forEach((p) => {
      if ((currentChunk + p).length > CHARS_PER_PAGE && currentChunk.trim().length > 0) {
        pageList.push(currentChunk.trim());
        currentChunk = p + '\n';
      } else {
        currentChunk += p + '\n';
      }
    });

    if (currentChunk.trim().length > 0) {
      pageList.push(currentChunk.trim());
    }

    return pageList.length > 0 ? pageList : [chapter.content];
  }, [chapter]);

  // TIẾN ĐỘ ĐỌC TÍNH THEO TRANG (%)
  const readingProgress = useMemo(() => {
    if (pages.length === 0) return 0;
    return Math.round((currentPage / pages.length) * 100);
  }, [currentPage, pages.length]);

  // PHÍM MŨI TÊN SANG TRANG
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentPage < pages.length) {
          setCurrentPage((prev) => prev + 1);
        } else if (nextChapter) {
          navigate(`/chapters/${nextChapter.id || nextChapter.chapterId}`);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else if (prevChapter) {
          navigate(`/chapters/${prevChapter.id || prevChapter.chapterId}`);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, pages.length, nextChapter, prevChapter, navigate]);

  const handleNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage((prev) => prev + 1);
    } else if (nextChapter) {
      navigate(`/chapters/${nextChapter.id || nextChapter.chapterId}`);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (prevChapter) {
      navigate(`/chapters/${prevChapter.id || prevChapter.chapterId}`);
    }
  };

  const handleSummarize = async () => {
    setAiMode('summary');
    setIsDrawerOpen(true);
    if (summary) return;

    setSummarizing(true);
    try {
      const res = await chapterService.summarize(chapterId);
      const sumData = res;
      setSummary(sumData?.summary || sumData);
    } catch (error) {
      console.error('Lỗi tóm tắt chương:', error);
      setSummary('Khởi tạo tóm tắt thất bại. Vui lòng thử lại.');
    } finally {
      setSummarizing(false);
    }
  };

  const handleOpenChat = () => {
    setAiMode('chat');
    setIsDrawerOpen(true);
  };

  // STYLE CHỈ ÁP DỤNG CHO KHUNG ĐỌC SÁCH
  const getCardThemeClasses = () => {
    switch (theme) {
      case 'sepia':
        return {
          bg: 'bg-[#f8f1e5]',
          text: 'text-[#433422]',
          subtext: 'text-[#7f6a52]',
          border: 'border-[#e2d5c3]',
          shadow: 'shadow-2xl shadow-amber-950/20',
        };
      case 'light':
        return {
          bg: 'bg-white',
          text: 'text-slate-900',
          subtext: 'text-slate-500',
          border: 'border-slate-200',
          shadow: 'shadow-2xl shadow-slate-200/50',
        };
      default:
        return {
          bg: 'bg-slate-900/90',
          text: 'text-slate-100',
          subtext: 'text-slate-400',
          border: 'border-slate-800',
          shadow: 'shadow-2xl shadow-black/50',
        };
    }
  };

  const cardStyle = getCardThemeClasses();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="text-sm">Đang tải nội dung chương...</span>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="text-center py-20 text-slate-400 space-y-3">
        <p>Không tìm thấy nội dung chương này.</p>
        <button onClick={() => navigate(-1)} className="text-xs text-indigo-400 hover:underline">
          Quay lại trang trước
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 select-none">
      
      {/* TOPBAR CỐ ĐỊNH */}
      {ReactDOM.createPortal(
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link
              to={`/books/${chapter.bookId}`}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Chi tiết sách
            </Link>
            
            <span className="text-xs font-bold text-slate-300 truncate max-w-[200px] sm:max-w-xs">
              Chương {chapter.chapterNumber}: {chapter.title}
            </span>

            <div className="flex items-center gap-2">
              <Link
                to={`/chapters/${chapterId}/edit`}
                className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-200 transition hover:border-indigo-400 hover:bg-indigo-500/20"
              >
                <Settings className="w-3.5 h-3.5" />
                Sửa
              </Link>

              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
                title="Tùy chỉnh giao diện đọc"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full h-1 bg-slate-800/40">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        </div>,
        document.body
      )}

      {/* POPOVER SETTINGS */}
      {isSettingsOpen && (
        <div className="fixed top-14 right-4 z-[10000] w-80 bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-2xl text-slate-100 space-y-5 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Type className="w-4 h-4" /> Cài đặt giao diện đọc
            </h4>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400">Chủ đề màu nền khung đọc</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme('dark')}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-indigo-500 text-indigo-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Tối
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                  theme === 'sepia'
                    ? 'bg-[#f8f1e5] border-amber-600 text-[#433422]'
                    : 'bg-[#f8f1e5]/80 border-slate-800 text-[#433422]/70'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Sepia
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                  theme === 'light'
                    ? 'bg-white border-indigo-600 text-slate-900'
                    : 'bg-white/80 border-slate-800 text-slate-700'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Sáng
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400">Kiểu chữ</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => setFontFamily('font-serif')}
                className={`py-2 rounded-xl font-serif font-bold border transition ${
                  fontFamily === 'font-serif'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Serif
              </button>
              <button
                onClick={() => setFontFamily('font-sans')}
                className={`py-2 rounded-xl font-sans font-bold border transition ${
                  fontFamily === 'font-sans'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Sans
              </button>
              <button
                onClick={() => setFontFamily('font-mono')}
                className={`py-2 rounded-xl font-mono font-bold border transition ${
                  fontFamily === 'font-mono'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Mono
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400">Kích thước chữ</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
              {[
                { label: 'Vừa', val: 'text-base' },
                { label: 'Lớn', val: 'text-lg' },
                { label: 'Rất lớn', val: 'text-xl' },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setFontSize(item.val)}
                  className={`py-2 rounded-xl border transition ${
                    fontSize === item.val
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER: CHIA GRID 2 CỘT CHO DESKTOP */}
      <main className="max-w-7xl mx-auto pt-2 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-start">
          
          {/* CỘT BÊN TRÁI: KHUNG ĐỌC SÁCH (Chiếm 7/12 cột trên Desktop) */}
          {/* CỘT BÊN TRÁI: KHUNG ĐỌC SÁCH */}
          <section className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* Thêm padding px-4 hoặc px-6 cho container ngoài để nút âm không bị tràn khỏi màn hình mobile */}
            <div className="relative min-h-[60vh] flex justify-center px-4 sm:px-6">
              
              {/* Nút Trái: Kéo ra ngoài lề trái bằng -left-3 hoặc -left-5 */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1 && !prevChapter}
                className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-800 text-slate-200 border border-slate-700 disabled:opacity-0 transition shadow-2xl hover:scale-110 active:scale-95"
                title="Trang trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* KHUNG THẺ NỘI DUNG SÁCH */}
              <div className={`w-full p-6 sm:p-10 rounded-3xl border transition-all duration-300 ${cardStyle.bg} ${cardStyle.text} ${cardStyle.border} ${cardStyle.shadow}`}>
                {currentPage === 1 && (
                  <div className="text-center space-y-2 pb-4 mb-6 border-b border-current/10">
                    <span className={`text-xs font-bold uppercase tracking-widest ${cardStyle.subtext}`}>
                      Chương {chapter.chapterNumber}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                      {chapter.title}
                    </h1>
                  </div>
                )}

                <p className={`w-full whitespace-pre-line text-justify leading-relaxed select-text ${fontFamily} ${fontSize} ${lineHeight}`}>
                  {pages[currentPage - 1]}
                </p>

                <div className="text-center pt-6">
                  <span className={`text-[11px] font-bold ${cardStyle.subtext}`}>
                    Trang {currentPage} / {pages.length}
                  </span>
                </div>
              </div>

              {/* Nút Phải: Kéo ra ngoài lề phải bằng -right-3 hoặc -right-5 */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === pages.length && !nextChapter}
                className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-800 text-slate-200 border border-slate-700 disabled:opacity-0 transition shadow-2xl hover:scale-110 active:scale-95"
                title="Trang sau"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

            </div>
          </section>

          {/* CỘT BÊN PHẢI: PHẦN BÌNH LUẬN (Chiếm 5/12 cột trên Desktop, Dính theo màn hình khi cuộn) */}
          <section ref={commentRef} className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 sm:p-6 backdrop-blur-sm shadow-xl">
              <CommentSection chapterId={chapterId} />
            </div>
          </section>

        </div>
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 border border-slate-700/60 backdrop-blur-xl px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 sm:gap-3 border-indigo-500/20">
        {prevChapter ? (
          <Link
            to={`/chapters/${prevChapter.id || prevChapter.chapterId}`}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
            title="Chương trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
        ) : (
          <span className="p-2 text-slate-700 cursor-not-allowed">
            <ChevronLeft className="w-5 h-5" />
          </span>
        )}

        <div className="h-4 w-[1px] bg-slate-800" />

        <button
          onClick={handleSummarize}
          className="relative group px-3.5 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 transition duration-200"
        >
          <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
          <span className="hidden sm:inline">Tóm tắt AI</span>
        </button>

        <button
          onClick={() => navigate(`/chapters/${chapterId}/quizzes`)}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-full text-xs font-bold flex items-center gap-1.5 transition"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Quiz</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-800" />

        {nextChapter ? (
          <Link
            to={`/chapters/${nextChapter.id || nextChapter.chapterId}`}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
            title="Chương sau"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        ) : (
          <span className="p-2 text-slate-700 cursor-not-allowed">
            <ChevronRight className="w-5 h-5" />
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          const nextOpen = !isDrawerOpen;
          if (nextOpen) {
            setAiMode('chat');
          }
          setIsDrawerOpen(nextOpen);
        }}
        className={`fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 ${
          isDrawerOpen
            ? 'border-indigo-400/40 bg-indigo-600/80 text-white shadow-[0_12px_30px_rgba(79,70,229,0.45)]'
            : 'border-cyan-400/30 bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-[0_12px_30px_rgba(34,211,238,0.45)]'
        }`}
        aria-label={isDrawerOpen ? 'Đóng trợ lý AI' : 'Mở trợ lý AI'}
        title={isDrawerOpen ? 'Đóng trợ lý AI' : 'Mở trợ lý AI'}
      >
        <Bot className="w-5 h-5" />
      </button>

      <div
        aria-hidden={!isDrawerOpen}
        className={`fixed bottom-4 right-20 z-50 flex h-[min(640px,calc(100vh-5rem))] w-[calc(100%-1.5rem)] max-w-[380px] flex-col rounded-2xl border border-indigo-500/30 bg-slate-900 shadow-2xl shadow-black/50 transition-all duration-300 ease-out ${
          isDrawerOpen
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-800 p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Trợ lý AI</h3>
              <p className="text-[10px] text-slate-400">Tóm tắt và hỏi đáp chương {chapter.chapterNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                setSummary(null);
              }}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              title="Đóng trợ lý AI"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 border-b border-slate-800 px-4 py-2">
          <button
            type="button"
            onClick={() => setAiMode('summary')}
            className={`flex-1 rounded-xl px-3 py-2 text-[11px] font-bold transition ${
              aiMode === 'summary'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Tóm tắt
          </button>
          <button
            type="button"
            onClick={() => setAiMode('chat')}
            className={`flex-1 rounded-xl px-3 py-2 text-[11px] font-bold transition ${
              aiMode === 'chat'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Chatbot
          </button>
        </div>

        <div className="flex h-full min-h-0 flex-1 flex-col gap-3 overflow-hidden p-4">
          {aiMode === 'summary' ? (
            summarizing ? (
              <div className="flex h-full flex-col items-center justify-center space-y-3 text-slate-400 py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                <p className="text-xs animate-pulse">AI đang đọc và tổng hợp nội dung...</p>
              </div>
            ) : summary ? (
              <div className="scrollbar-chat h-full min-h-[120px] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs leading-relaxed text-slate-300 sm:text-sm">
                <div className="mb-3 flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" /> Key Takeaways
                </div>
                <p className="whitespace-pre-line">{summary}</p>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-4 text-center text-xs text-slate-500">
                Chưa có tóm tắt. Hãy nhấn “Tóm tắt AI” để tạo nội dung.
              </div>
            )
          ) : (
            <div className="min-h-0 flex-1 overflow-hidden">
              <ChapterChat key={chatResetKey} chapterId={chapterId} />
            </div>
          )}
        </div>

        {aiMode === 'summary' && (
          <div className="shrink-0 border-t border-slate-800 p-4">
            <button
              onClick={() => navigate(`/chapters/${chapterId}/quizzes`)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <HelpCircle className="w-4 h-4" /> Làm Quiz Kiểm Tra Thử
            </button>
          </div>
        )}
      </div>
    </div>
  );
}