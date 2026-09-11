import { useEffect, useState } from 'react';
import { categoryService } from '../services/apiServices';
import { Sparkles, Layers } from 'lucide-react';

export default function CategoryBar({ selectedCategoryIds, onToggleCategory, onClearCategories }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Lỗi lấy danh sách thể loại:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto py-2 scrollbar-none animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-24 bg-slate-800 rounded-xl shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none no-scrollbar">
      {/* Nút Chọn Tất Cả */}
      <button
        onClick={onClearCategories}
        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 flex items-center gap-2 ${
          selectedCategoryIds.length === 0
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
            : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        Tất Cả Thể Loaị
      </button>

      {/* Danh Sách Thể Loại Trả Về Từ Backend */}
      {categories.map((cat) => {
        const isSelected = selectedCategoryIds.includes(cat.id);
        return (
          <button
            key={cat.id}
            onClick={() => onToggleCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 flex items-center gap-2 ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}