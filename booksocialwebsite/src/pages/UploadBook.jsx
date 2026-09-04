import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService, categoryService } from '../services/apiServices';
import { 
  BookPlus, 
  Upload, 
  Image as ImageIcon, 
  X, 
  Loader2, 
  ArrowLeft, 
  CheckCircle2,
  Globe
} from 'lucide-react';

export default function UploadBook() {
  const navigate = useNavigate();
  const errorRef = useRef(null);

  // State Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('VIETNAMESE');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State Dữ liệu & UI
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Hàm hỗ trợ cuộn mượt tới khung báo lỗi (dùng setTimeout để chờ DOM render)
  const scrollToError = () => {
    setTimeout(() => {
      errorRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }, 50);
  };

  // 1. Tải danh sách Thể loại (GET /categories)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await categoryService.getAll();
        const data = response;
        setCategories(data);
      } catch (err) {
        console.error('Lỗi khi tải thể loại:', err);
        setError('Không thể tải danh sách thể loại. Vui lòng làm mới trang.');
        scrollToError();
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // 2. Xử lý Chọn/Bỏ chọn Thể loại
  const handleCategoryToggle = (categoryId) => {
    if (selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== categoryId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
    }
  };

  // 3. Xử lý Chọn File Ảnh
  const handleImageChange = (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Dung lượng ảnh tối đa là 5MB');
          return;
        }
        setCoverImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
    } catch (error) { 
      setError(error?.message || 'Có lỗi xảy ra khi tải ảnh. Vui lòng thử lại.');
      scrollToError();
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setImagePreview(null);
  };

  // 4. Submit Form (POST /books - FormData)
  const handleSubmit = async (e) => {
    e.preventDefault();

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
      setError(null);

      // Tạo FormData để truyền Multipart
      const formData = new FormData();
      formData.append('title', title.trim());
      if (description.trim()) formData.append('description', description.trim());
      formData.append('language', language);

      // Thêm danh sách Category IDs
      selectedCategoryIds.forEach(id => {
        formData.append('categoryIds', id);
      });

      // Thêm File ảnh bìa
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      // Call API POST /books
      await bookService.createBook(formData);
      alert('Đăng sách thành công! Sách của bạn đang chờ Admin duyệt.');
      
      navigate('/my-books');
    } catch (err) {
      console.error('Lỗi đăng sách:', err);
      setError(err?.message || err?.response?.data?.message || 'Có lỗi xảy ra khi tạo sách. Vui lòng thử lại.');
      scrollToError();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>

        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <BookPlus className="w-8 h-8 text-emerald-400" />
            Đăng Sách Mới
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Điền đầy đủ thông tin sách của bạn. Sách sẽ được duyệt trước khi xuất bản rộng rãi.
          </p>
        </div>

        {error && (
          <div ref={errorRef} className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs sm:text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Cột Trái: Upload Bìa Sách */}
            <div className="md:col-span-1 space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Ảnh Bìa Sách
              </label>

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 group">
                  <img
                    src={imagePreview}
                    alt="Cover Preview"
                    className="w-full h-72 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-rose-600 text-white rounded-xl transition"
                    title="Xóa ảnh"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-72 border-2 border-dashed border-slate-800 hover:border-indigo-500 rounded-2xl cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition p-4 text-center">
                  <ImageIcon className="w-10 h-10 text-slate-500 mb-2" />
                  <span className="text-xs font-semibold text-slate-300">Nhấp để tải ảnh lên</span>
                  <span className="text-[10px] text-slate-500 mt-1">PNG, JPG, WEBP (Tối đa 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Cột Phải: Thông tin chính */}
            <div className="md:col-span-2 space-y-4">
              
              {/* Tên Sách */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Tên Sách <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên sách..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              {/* Ngôn ngữ */}
              <div>
                <label htmlFor="book-language" className="block text-xs font-bold text-slate-300 mb-1">
                  Ngôn Ngữ <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    id="book-language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full appearance-none pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                    required
                  >
                    <option value="VIETNAMESE">Tiếng Việt</option>
                    <option value="ENGLISH">Tiếng Anh</option>
                  </select>
                </div>
              </div>

              {/* Thể loại */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Thể Loại <span className="text-rose-400">*</span>
                </label>
                {loadingCategories ? (
                  <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang tải danh sách thể loại...
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-slate-900/60 border border-slate-800 rounded-xl">
                    {categories.map((cat) => {
                      const isSelected = selectedCategoryIds.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleCategoryToggle(cat.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                          <span>{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Mô Tả Nội Dung
                </label>
                <textarea
                  rows={5}
                  placeholder="Tóm tắt nội dung tác phẩm, lời giới thiệu..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
                />
              </div>

            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang tạo sách...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Đăng Sách Mới</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}