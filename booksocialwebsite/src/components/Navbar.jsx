import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Search, 
  BookmarkCheck, 
  User, 
  LogOut, 
  ShieldCheck, 
  PlusCircle, 
  ChevronDown 
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const [keyword, setKeyword] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Xử lý Tìm kiếm nhanh sách theo từ khóa
  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/');
    }
  };

  // Xử lý Đăng xuất
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* 1. Logo & Tên Thương Hiệu */}
          <Link to="/" className="flex items-center space-x-3 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-md shadow-indigo-500/20">
              R
            </div>
            <span className="text-xl font-black tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-slate-300 hidden sm:inline-block">
              Readora
            </span>
          </Link>

          {/* 2. Thanh Tìm Kiếm Keyword */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sách, tác giả..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition duration-200"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </form>

          {/* 3. Menu Điều Hướng & Profile */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            
            {/* Link Trang Chủ / Tủ Sách */}
            <Link
              to="/"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline">Khám Phá</span>
            </Link>

            <Link
              to="/bookshelfs"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-2"
            >
              <BookmarkCheck className="w-4 h-4 text-violet-400" />
              <span className="hidden md:inline">Tủ Sách</span>
            </Link>

            {/* Menu Duyệt Sách riêng cho Admin */}
            {isAdmin && (
              <Link
                to="/books/pending"
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="hidden lg:inline">Duyệt Sách</span>
              </Link>
            )}

            {/* Dropdown Profile Người Dùng */}
            <div className="relative ml-2">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition border border-transparent focus:border-slate-700"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs ring-1 ring-indigo-500/50">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-200 hidden sm:inline-block max-w-[100px] truncate">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Menu con khi Click vào Avatar */}
              {isDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-slate-200"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-400">Đăng nhập với danh nghĩa</p>
                    <p className="text-sm font-bold text-slate-100 truncate">{user?.username}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-slate-800 transition text-slate-300 hover:text-white"
                  >
                    <User className="w-4 h-4 text-indigo-400" />
                    Trang Cá Nhân
                  </Link>

                  <div className="my-1 border-t border-slate-800/80" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng Xuất
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}