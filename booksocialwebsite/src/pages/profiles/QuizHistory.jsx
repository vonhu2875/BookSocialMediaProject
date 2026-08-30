import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Award, BookOpen, CalendarDays, ChevronLeft, ChevronRight, ClipboardList, Loader2 } from 'lucide-react';
import { authService, quizService } from '../../services/apiServices';

const formatDate = (value) => {
  if (!value) return 'Chưa cập nhật';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa cập nhật';

  return date.toLocaleString('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export default function QuizHistory() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 1, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttempts = async (page = 0) => {
      try {
        setLoading(true);
        setError(null);
        const response = await authService.getMyAttempts(page, 6);
        const data = response.content ? response : response.result || response;
        const attemptList = data.content || data;
        setPageInfo({
          page: data.number ?? page,
          totalPages: data.totalPages ?? 1,
          totalElements: data.totalElements ?? attemptList.length,
        });
        const enrichedAttempts = await Promise.all(attemptList.map(async (attempt) => {
          const quizId = attempt.quizId;
          if (quizId === null || quizId === undefined) return attempt;

          try {
            const quizResponse = await quizService.getQuiz(quizId);
            const quiz = quizResponse.result || quizResponse;
            return {
              ...attempt,
              bookTitle: quiz.bookTitle,
              chapterTitle: quiz.chapterTitle,
              chapterId: quiz.chapterId,
            };
          } catch (quizError) {
            console.error(`Lỗi tải thông tin quiz ${quizId}:`, quizError);
            return attempt;
          }
        }));

        setAttempts(enrichedAttempts);
      } catch (err) {
        console.error('Lỗi tải lịch sử Quiz:', err);
        setError(err.response?.data?.message || 'Không thể tải lịch sử làm Quiz.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts(page);
  }, [page]);

  const orderedAttempts = useMemo(
    () => [...attempts].sort((first, second) => new Date(second.submittedAt) - new Date(first.submittedAt)),
    [attempts],
  );

  const attemptsWithBookNumber = useMemo(() => {
    const attemptsByBook = new Map();

    [...attempts]
      .sort((first, second) => new Date(first.submittedAt) - new Date(second.submittedAt))
      .forEach((attempt) => {
        const quizId = attempt.quizId;
        const bookId = attempt.bookTitle || `unknown-${quizId}`;
        const bookAttempts = attemptsByBook.get(bookId) || [];
        bookAttempts.push(attempt);
        attemptsByBook.set(bookId, bookAttempts);
      });

    const attemptNumbers = new Map();
    attemptsByBook.forEach((bookAttempts) => {
      bookAttempts.forEach((attempt, index) => {
        attemptNumbers.set(attempt.id, index + 1);
      });
    });

    return orderedAttempts.map((attempt) => ({
      ...attempt,
      bookAttemptNumber: attemptNumbers.get(attempt.id),
    }));
  }, [attempts, orderedAttempts]);

  const totalScore = attempts.reduce((total, attempt) => {
    return total + Number(attempt.score || 0);
  }, 0);

  const averageScore = attempts.length > 0
    ? (totalScore / attempts.length).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center gap-3 text-slate-400">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
        <span className="text-sm">Đang tải lịch sử làm Quiz...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-7">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 transition hover:border-slate-700 hover:text-white"
            title="Quay lại"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black text-white">
              <ClipboardList className="h-7 w-7 text-amber-400" />
              Lịch sử làm Quiz
            </h1>
            <p className="mt-1 text-xs text-slate-400">Theo dõi những lần bạn đã hoàn thành.</p>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-300">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <span className="text-xs text-slate-400">Tổng số lần làm</span>
                <strong className="mt-2 block text-2xl text-white">{attempts.length}</strong>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <span className="text-xs text-slate-400">Điểm trung bình</span>
                <strong className="mt-2 block text-2xl text-amber-400">{averageScore}</strong>
              </div>
              <div className="col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:col-span-1">
                <span className="text-xs text-slate-400">Lần gần nhất</span>
                <strong className="mt-2 block truncate text-sm text-white">
                  {formatDate(orderedAttempts[0]?.submittedAt)}
                </strong>
              </div>
            </div>

            {attemptsWithBookNumber.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-14 text-center">
                <Award className="mx-auto h-10 w-10 text-slate-600" />
                <h2 className="mt-4 text-base font-bold text-slate-200">Bạn chưa có lần làm Quiz nào</h2>
                <p className="mt-2 text-xs text-slate-500">Hoàn thành một bài Quiz để kết quả xuất hiện tại đây.</p>
              </div>
            ) : (
              <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                <div className="border-b border-slate-800 px-5 py-4">
                  <h2 className="text-sm font-bold text-white">Các lần làm gần đây</h2>
                </div>
                <div className="divide-y divide-slate-800">
                  {attemptsWithBookNumber.map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-800/40">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-200">
                          {attempt.bookTitle || `Lần làm Quiz #${attempt.id}`}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-400">
                          {attempt.chapterTitle || `Quiz #${attempt.quizId ?? 'không xác định'}`}
                        </p>
                        <p className="mt-1 text-xs font-medium text-indigo-400">
                          Lần làm thứ {attempt.bookAttemptNumber || '?'} trong sách này
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(attempt.submittedAt)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
                          {attempt.score} điểm
                        </span>
                        {attempt.chapterId !== null && attempt.chapterId !== undefined && (
                          <button
                            onClick={() => navigate(`/chapters/${attempt.chapterId}`)}
                            className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/20 hover:text-indigo-200"
                            title="Đọc chương"
                          >
                            <BookOpen className="h-4 w-4" />
                            <span className="hidden sm:inline">Đọc chương</span>
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/quiz-attempts/${attempt.id}`)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                          title="Xem kết quả"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {!loading && pageInfo.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 border-t border-slate-800/80 pt-6">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 0))}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  title="Trang trước"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-xs font-semibold text-slate-400 sm:text-sm">
                  Trang <strong className="text-white">{pageInfo.page + 1}</strong> / {pageInfo.totalPages}
                </span>
                <button
                  disabled={page >= pageInfo.totalPages - 1}
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  title="Trang sau"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
