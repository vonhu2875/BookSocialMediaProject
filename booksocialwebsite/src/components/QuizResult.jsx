import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { quizService } from '../services/apiServices';
import { Loader2, ArrowLeft, CheckCircle2, XCircle, Award, AlertCircle, BookOpen, RotateCcw } from 'lucide-react';

export default function QuizResult() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu quiz từ location state hoặc sessionStorage
  const [quiz, setQuiz] = useState(() => {
    if (location.state?.quiz) return location.state.quiz;
    const cached = sessionStorage.getItem('latest_quiz_cache');
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      try {
        const res = await quizService.getAttemptDetail(attemptId);
        const attemptData = res?.result || res;
        setAttempt(attemptData);

        if (!quiz && attemptData?.quiz) {
          const quizRes = await quizService.getQuiz(attemptData.quiz);
          setQuiz(quizRes?.result || quizRes);
        }
      } catch (err) {
        console.error('Lỗi lấy kết quả Quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) fetchResult();
  }, [attemptId, quiz]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="text-sm font-medium">Đang tải kết quả...</span>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <p className="text-sm text-slate-300">Không tìm thấy kết quả bài làm.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-bold rounded-xl"
        >
          Quay lại
        </button>
      </div>
    );
  }

  // Tính toán chỉ số điểm số
  const responses = attempt.userAnswerResponses || [];
  const questionsMap = quiz?.questions || [];
  const totalQuestions = quiz?.questions?.length || responses.length;
  const correctCount = attempt.score;
  const wrongCount = totalQuestions - correctCount;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const chapterId = quiz?.chapterId;

  const continueReading = () => {
    if (chapterId !== null && chapterId !== undefined) {
      navigate(`/chapters/${chapterId}`);
      return;
    }

    navigate(-1);
  };

  const retryQuiz = () => {
    if (chapterId !== null && chapterId !== undefined) {
      navigate(`/chapters/${chapterId}/quizzes`, { state: { quizMode: 'retry', quiz } });
      return;
    }

    navigate(-1);
  };

  // Lấy text của lựa chọn (A, B, C, D)
  const getOptionText = (questionObj, optionLetter) => {
    if (!questionObj || !optionLetter) return null;
    return questionObj[`option${optionLetter.toUpperCase()}`] || null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={continueReading}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại bài đọc
          </button>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Kết quả bài làm
          </span>
        </div>

        {/* BỐ CỤC CHÍNH 2 CỘT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* CỘT 1: THẺ ĐIỂM SỐ (4 CỘT) */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-center space-y-6 shadow-xl backdrop-blur-sm">
            
            <div className="w-16 h-16 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto text-indigo-400">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">Tỷ lệ chính xác</span>
              <h1 className="text-4xl font-extrabold text-white">{percentage}%</h1>
            </div>

            {/* THỐNG KÊ ĐÚNG / SAI */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-left">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <span className="text-[11px] text-slate-400 block">Số câu đúng</span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-4 h-4" /> {correctCount} câu
                </span>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <span className="text-[11px] text-slate-400 block">Số câu sai</span>
                <span className="text-sm font-bold text-rose-400 flex items-center gap-1 mt-1">
                  <XCircle className="w-4 h-4" /> {wrongCount} câu
                </span>
              </div>
            </div>

            {/* NÚT HÀNH ĐỘNG */}
            <div className="space-y-2">
              <button
                onClick={retryQuiz}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Làm lại Quiz
              </button>
              <button
                onClick={continueReading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Tiếp tục đọc bài
              </button>
            </div>

          </div>

          {/* CỘT 2: CHI TIẾT ĐÁP ÁN (8 CỘT) */}
          <div className="lg:col-span-8 space-y-4">
            
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Chi tiết câu hỏi & Lời giải ({responses.length})
            </h3>

            {responses.map((item, idx) => {
              const questionInfo = questionsMap.find((q) => q.id === item.questionId);
              const userText = getOptionText(questionInfo, item.selectedAnswer);
              const correctText = getOptionText(questionInfo, item.correctAnswer);

              return (
                <div
                  key={item.questionId || idx}
                  className={`p-5 rounded-2xl border space-y-3 bg-slate-900/80 ${
                    item.correct ? 'border-emerald-500/30' : 'border-rose-500/30'
                  }`}
                >
                  {/* TIÊU ĐỀ CÂU HỎI */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-indigo-400 uppercase">
                        Câu {idx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed">
                        {questionInfo?.content || `Câu hỏi #${item.questionId}`}
                      </h4>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      item.correct 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                        : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                    }`}>
                      {item.correct ? 'Đúng' : 'Sai'}
                    </span>
                  </div>

                  {/* LỰA CHỌN CỦA BẠN & ĐÁP ÁN ĐÚNG */}
                  <div className="space-y-2 text-xs pt-1">
                    
                    {/* Đáp án đã chọn */}
                    <div className={`p-3 rounded-xl border ${
                      item.correct 
                        ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
                        : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                    }`}>
                      <span className="text-slate-400 block text-[10px] mb-0.5">Lựa chọn của bạn:</span>
                      <span className="font-medium">
                        {item.selectedAnswer ? `${item.selectedAnswer}. ${userText || ''}` : 'Chưa chọn'}
                      </span>
                    </div>

                    {/* Đáp án đúng (Chỉ hiển thị khi làm sai) */}
                    {!item.correct && (
                      <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-300">
                        <span className="text-emerald-500/80 block text-[10px] mb-0.5">Đáp án đúng:</span>
                        <span className="font-medium">
                          {item.correctAnswer}. {correctText || ''}
                        </span>
                      </div>
                    )}

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>
    </div>
  );
}