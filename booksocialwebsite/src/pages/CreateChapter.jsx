import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2, FileText, Loader2, Upload } from 'lucide-react';
import { bookService } from '../services/apiServices';

export default function CreateChapter() {
  const { id: bookId } = useParams();
  const navigate = useNavigate();
  const [chapterNumber, setChapterNumber] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
    if (!file) {
      setError('Vui lòng chọn file nội dung chương.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('chapterNumber', chapterNumber);
      formData.append('title', title.trim());
      formData.append('file', file);
      await bookService.createChapter(bookId, formData);
      alert('Thêm chương thành công!');
      navigate(`/books/${bookId}`);
    } catch (requestError) {
      console.error('Lỗi thêm chương:', requestError);
      setError(requestError?.message || 'Không thể thêm chương. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link to={`/books/${bookId}`} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Quay lại sách
        </Link>

        <div className="border-b border-slate-800 pb-5">
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-400" /> Thêm Chương Mới
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Tải file nội dung để bổ sung chương cho tác phẩm.</p>
        </div>

        {error && <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs sm:text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Số chương <span className="text-rose-400">*</span></label>
            <input type="number" min="1" required value={chapterNumber} onChange={(event) => setChapterNumber(event.target.value)} placeholder="Ví dụ: 1" className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Tên chương <span className="text-rose-400">*</span></label>
            <input type="text" required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Nhập tên chương..." className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">File nội dung <span className="text-rose-400">*</span></label>
            <label className="flex items-center gap-3 p-4 bg-slate-950 border border-dashed border-slate-700 hover:border-indigo-500 rounded-xl cursor-pointer transition">
              <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
              <span className="text-xs text-slate-300 truncate">{file ? file.name : 'Chọn file nội dung chương'}</span>
              <input type="file" required onChange={(event) => setFile(event.target.files[0] || null)} className="hidden" />
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Link to={`/books/${bookId}`} className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition">Hủy bỏ</Link>
            <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-4 h-4" /><CheckCircle2 className="w-4 h-4" /></>}
              {submitting ? 'Đang tải lên...' : 'Thêm chương'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
