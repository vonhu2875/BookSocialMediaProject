import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2, Globe, Image as ImageIcon, Loader2, Save } from 'lucide-react';
import { bookService, categoryService } from '../services/apiServices';

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('VIETNAMESE');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const errorRef = useRef(null);

  // Hàm hỗ trợ cuộn mượt tới khung báo lỗi
  const scrollToError = () => {
    setTimeout(() => {
      errorRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }, 50);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookData, categoryData] = await Promise.all([
          bookService.getBookDetail(id),
          categoryService.getAll(),
        ]);
        setBook(bookData);
        setTitle(bookData.title || '');
        setDescription(bookData.description || '');
        setLanguage(bookData.language || 'VIETNAMESE');
        setSelectedCategoryIds((bookData.categories || []).map((category) => category.id));
        setCategories(categoryData);
      } catch (requestError) {
        console.error('Lỗi tải thông tin sách:', requestError);
        setError(requestError?.message || 'Không thể tải thông tin sách.');
        scrollToError();
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Cuộn tới lỗi khi state error thay đổi
  useEffect(() => {
    if (error && errorRef.current) {
      scrollToError();
    }
  }, [error]);

  const toggleCategory = (categoryId) => {
    setSelectedCategoryIds((currentIds) => currentIds.includes(categoryId)
      ? currentIds.filter((currentId) => currentId !== categoryId)
      : [...currentIds, categoryId]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Vui lòng nhập tên sách.');
      scrollToError();
      return;
    }
    if (selectedCategoryIds.length === 0) {
      setError('Vui lòng chọn ít nhất một thể loại.');
      scrollToError();
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('language', language);
      selectedCategoryIds.forEach((categoryId) => formData.append('categoryIds', categoryId));
      if (coverImage) formData.append('coverImage', coverImage);

      await bookService.updateBook(id, formData);
      alert('Cập nhật sách thành công!');
      navigate(`/books/${id}`);
    } catch (requestError) {
      console.error('Lỗi cập nhật sách:', requestError);
      setError(requestError?.message || 'Không thể cập nhật sách. Vui lòng thử lại.');
      scrollToError();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-400"><Loader2 className="w-7 h-7 animate-spin text-indigo-500" /></div>;
  }

  if (!book) {
    return <div className="text-center py-20 text-slate-400">{error || 'Không tìm thấy sách.'}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to={`/books/${id}`} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"><ArrowLeft className="w-4 h-4" /> Quay lại sách</Link>
        <div className="border-b border-slate-800 pb-5">
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3"><BookOpen className="w-8 h-8 text-indigo-400" /> Chỉnh Sửa Sách</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Cập nhật thông tin tác phẩm của bạn.</p>
        </div>
        {error && <div ref={errorRef} className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs sm:text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Tên sách <span className="text-rose-400">*</span></label>
            <input value={title} onChange={(event) => setTitle(event.target.value)} required className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Ngôn ngữ <span className="text-rose-400">*</span></label>
            <div className="relative"><Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" /><select value={language} onChange={(event) => setLanguage(event.target.value)} required className="w-full appearance-none pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"><option value="VIETNAMESE">Tiếng Việt</option><option value="ENGLISH">Tiếng Anh</option></select></div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">Thể loại <span className="text-rose-400">*</span></label>
            <div className="flex flex-wrap gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl max-h-40 overflow-y-auto">{categories.map((category) => <button type="button" key={category.id} onClick={() => toggleCategory(category.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${selectedCategoryIds.includes(category.id) ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>{selectedCategoryIds.includes(category.id) && <CheckCircle2 className="w-3.5 h-3.5" />}{category.name}</button>)}</div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Mô tả</label>
            <textarea rows={5} value={description} onChange={(event) => setDescription(event.target.value)} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Ảnh bìa mới</label>
            <label className="flex items-center gap-3 p-4 bg-slate-950 border border-dashed border-slate-700 hover:border-indigo-500 rounded-xl cursor-pointer transition"><ImageIcon className="w-5 h-5 text-indigo-400" /><span className="text-xs text-slate-300 truncate">{coverImage ? coverImage.name : 'Giữ ảnh hiện tại hoặc chọn ảnh mới'}</span><input type="file" accept="image/*" onChange={(event) => setCoverImage(event.target.files[0] || null)} className="hidden" /></label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800"><Link to={`/books/${id}`} className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition">Hủy bỏ</Link><button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{submitting ? 'Đang lưu...' : 'Lưu thay đổi'}</button></div>
        </form>
      </div>
    </div>
  );
}