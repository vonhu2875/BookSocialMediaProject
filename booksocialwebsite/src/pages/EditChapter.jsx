import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, FileText, Loader2, Save } from 'lucide-react';
import { chapterService } from '../services/apiServices';

export default function EditChapter() {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState(null);
  const [chapterNumber, setChapterNumber] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true);
        const data = await chapterService.getDetail(chapterId);
        setChapter(data);
        setChapterNumber(data?.chapterNumber ?? '');
        setTitle(data?.title ?? '');
      } catch (requestError) {
        console.error('Lỗi tải thông tin chương:', requestError);
        setError(requestError?.message || 'Không thể tải thông tin chương.');
      } finally {
        setLoading(false);
      }
    };

    if (chapterId) fetchChapter();
  }, [chapterId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!chapterNumber || Number(chapterNumber) < 1) {
      setError('Số chương phải lớn hơn hoặc bằng 1.');
      return;
    }

    if (!title.trim()) {
      setError('Vui lòng nhập tên chương.');
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('chapterNumber', String(Number(chapterNumber)));
      formData.append('title', title.trim());
      if (file) {
        formData.append('file', file);
      }

      await chapterService.updateChapter(chapterId, formData);

      alert('Cập nhật chương thành công!');
      navigate(`/chapters/${chapterId}`);
    } catch (requestError) {
      console.error('Lỗi cập nhật chương:', requestError);
      setError(requestError?.message || 'Không thể cập nhật chương. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa chương này không?');
    if (!confirmed) return;

    try {
      await chapterService.deleteChapter(chapterId);
      alert('Xóa chương thành công!');
      navigate(`/books/${chapter?.bookId}`);
    } catch (requestError) {
      console.error('Lỗi xóa chương:', requestError);
      setError(requestError?.message || 'Không thể xóa chương.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400">
        <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link to={`/chapters/${chapterId}`} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Quay lại chương
        </Link>

        <div className="border-b border-slate-800 pb-5">
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-400" /> Chỉnh sửa chương
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Cập nhật số chương, tiêu đề và file nội dung nếu cần.</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs sm:text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Số chương <span className="text-rose-400">*</span></label>
            <input
              type="number"
              min="1"
              required
              value={chapterNumber}
              onChange={(event) => setChapterNumber(event.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Tên chương <span className="text-rose-400">*</span></label>
            <input
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">File nội dung mới</label>
            <label className="flex items-center gap-3 p-4 bg-slate-950 border border-dashed border-slate-700 hover:border-indigo-500 rounded-xl cursor-pointer transition">
              <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
              <span className="text-xs text-slate-300 truncate">
                {file ? file.name : 'Giữ file hiện tại hoặc chọn file mới'}
              </span>
              <input type="file" onChange={(event) => setFile(event.target.files[0] || null)} className="hidden" />
            </label>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleDelete}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition"
            >
              Xóa chương
            </button>

            <div className="flex gap-3">
              <Link to={`/chapters/${chapterId}`} className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition">
                Hủy bỏ
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
