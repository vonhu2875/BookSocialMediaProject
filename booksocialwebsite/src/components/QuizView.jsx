import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, useBlocker } from 'react-router-dom';
import { chapterService, quizService } from '../services/apiServices';
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, Check, Send, AlertCircle, Sparkles, Grid } from 'lucide-react';

export default function QuizView() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
	const location = useLocation();

  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Quản lý câu hỏi hiện tại (0-based)
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
	const hasSubmitted = useRef(false);
	const [submitted, setSubmitted] = useState(false);
	const isQuizActive = Boolean(quiz) && !submitted && !hasSubmitted.current;
	const blocker = useBlocker(isQuizActive);

	// 1. Tải bài Quiz cho chapter hiện tại
  useEffect(() => {
    const initQuiz = async () => {
	      setQuiz(null);
	      setAnswers({});
	      setCurrentIndex(0);
	      setSubmitted(false);
	      hasSubmitted.current = false;
      setLoading(true);
      setError(null);
      try {
				const quizData = location.state?.quizMode === 'retry' && location.state?.quiz
					? location.state.quiz
					: await chapterService.startQuiz(chapterId);
        setQuiz(quizData);
      } catch (err) {
        console.error('Lỗi khởi tạo Quiz:', err);
        setError('Không thể tải bài Quiz. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (chapterId) initQuiz();
	  }, [chapterId, location.state]);

	// Cảnh báo khi reload, đóng tab hoặc rời trang bằng trình duyệt.
	useEffect(() => {
		const handleBeforeUnload = (event) => {
			if (!isQuizActive) return;

			event.preventDefault();
			event.returnValue = '';
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [isQuizActive]);

	useEffect(() => {
		if (blocker.state !== 'blocked') return;
		if (hasSubmitted.current) {
			blocker.proceed();
			return;
		}

		const confirmed = window.confirm(
			'Tiến trình làm bài sẽ không được lưu. Bạn có chắc chắn muốn thoát không?',
		);

		if (confirmed) {
			blocker.proceed();
		} else {
			blocker.reset();
		}
	}, [blocker]);

	const handleExit = () => {
		navigate(-1);
	};

	// 2. Chọn đáp án, chỉ lưu trong phiên hiện tại
  const handleSelectOption = (questionId, optionValue) => {
    setAnswers((prev) => {
			return { ...prev, [questionId]: optionValue };
    });
  };

  // 3. Nộp bài
  const handleSubmit = async () => {
    if (!quiz?.questions?.length || submitting) return;

    const userAnswerRequests = Object.entries(answers).map(([qId, selectedOpt]) => ({
      questionId: Number(qId),
      selectedAnswer: selectedOpt,
    }));

    if (userAnswerRequests.length < quiz.questions.length) {
      alert('Bạn chưa trả lời hết tất cả các câu hỏi. Vui lòng hoàn thành trước khi nộp.');
      return;
    }

    setSubmitting(true);
    try {
      const quizId = quiz.id;
      const res = await quizService.submitQuiz(quizId, userAnswerRequests);
      
	hasSubmitted.current = true;
		setSubmitted(true);
      sessionStorage.setItem('latest_quiz_cache', JSON.stringify(quiz));

      const attemptData = res;
      const attemptId = attemptData.id;
      if (!attemptId) {
        throw new Error('API không trả về id của kết quả Quiz.');
      }
      
      // Dùng replace: true để đè lên trang Quiz trong History Stack
      navigate(`/quiz-attempts/${attemptId}`, { state: { quiz }, replace: true });
    } catch (err) {
      console.error('Lỗi nộp bài:', err);
      alert('Nộp bài thất bại. Vui lòng thử lại!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="text-sm font-medium">Đang chuẩn bị trang đọc Quiz...</span>
      </div>
    );
  }

  if (error || !quiz || !quiz.questions?.length) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <p className="text-sm text-slate-300">{error || 'Không có câu hỏi nào.'}</p>
        <button
					onClick={handleExit}
          className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-bold rounded-xl"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const questions = quiz.questions;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  // Tính số câu đã trả lời chuẩn xác dựa trên danh sách câu hỏi hiện tại
  const validQuestionIds = new Set(questions.map((q) => String(q.id)));
  const answeredCount = Object.keys(answers).filter((qId) => validQuestionIds.has(String(qId))).length;

  const optionKeys = [
    { key: 'optionA', value: 'A' },
    { key: 'optionB', value: 'B' },
    { key: 'optionC', value: 'C' },
    { key: 'optionD', value: 'D' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between px-4">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        
        {/* HEADER CỐ ĐỊNH NHƯ TRANG SÁCH */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <button
						onClick={handleExit}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Thoát Quiz
          </button>
          
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Đã hoàn thành {answeredCount}/{totalQuestions} câu</span>
          </div>
        </div>

        {/* LAYOUT CHÍNH: CỘT BÀI LÀM & CỘT BẢNG ĐIỀU HƯỚNG */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* CỘT 1: THẺ CÂU HỎI CHÍNH (8 CỘT) */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-8 space-y-6 shadow-2xl backdrop-blur-sm min-h-[380px] flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* THỨ TỰ CÂU HỎI */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                    Câu {currentIndex + 1} / {totalQuestions}
                  </span>
                  
                  {answers[currentQuestion.id] && (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                      <Check className="w-3.5 h-3.5" /> Đã chọn
                    </span>
                  )}
                </div>

                {/* NỘI DUNG CÂU HỎI */}
                <h2 className="text-base sm:text-lg font-semibold leading-relaxed text-slate-100">
                  {currentQuestion.content}
                </h2>
              </div>

              {/* DANH SÁCH LỰA CHỌN */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                {optionKeys.map(({ key, value }) => {
                  const optionText = currentQuestion[key];
                  if (!optionText) return null;

                  const isSelected = answers[currentQuestion.id] === value;

                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectOption(currentQuestion.id, value)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-500/10'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="flex items-start gap-3">
                        <strong className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold border shrink-0 ${
                          isSelected ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}>
                          {value}
                        </strong>
                        <span className="mt-0.5">{optionText}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* NÚT CHUYỂN TRANG / NỘP BÀI */}
            <div className="flex items-center justify-between">
              
              {/* Nút Trước */}
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" /> Trước
              </button>

              {/* Nút Tiếp theo HOẶC Nút Nộp Bài ở câu cuối */}
              {currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/20"
                >
                  Tiếp <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Nộp bài ngay
                </button>
              )}

            </div>

          </div>

          {/* CỘT 2: BẢNG ĐIỀU HƯỚNG CÂU HỎI (4 CỘT) */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl backdrop-blur-sm">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Grid className="w-4 h-4 text-indigo-400" />
                <span>Danh sách câu hỏi</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {answeredCount}/{totalQuestions} đã làm
              </span>
            </div>

            {/* LƯỚI NÚT CHUYỂN CÂU HỎI */}
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-[320px] overflow-y-auto p-1 scrollbar-thin">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = idx === currentIndex;

                let statusStyle = 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700';

                if (isCurrent) {
                  statusStyle = 'bg-indigo-600/30 text-indigo-200 border-indigo-500 font-bold ring-2 ring-indigo-500/30';
                } else if (isAnswered) {
                  statusStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20';
                }

                return (
                  <button
                    key={q.id || idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all ${statusStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* CHÚ THÍCH MÃ MÀU */}
            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 border border-emerald-500/50"></span>
                <span>Đã làm</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-700"></span>
                <span>Chưa làm</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 border border-indigo-400"></span>
                <span>Đang xem</span>
              </div>
            </div>

            {/* NÚT NỘP BÀI NHANH Ở BẢNG ĐIỀU HƯỚNG */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Nộp bài ngay
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}