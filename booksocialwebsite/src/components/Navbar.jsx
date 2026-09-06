import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Search, 
  BookmarkCheck, 
  User, 
  LogOut, 
  ShieldCheck, 
  ChevronDown, 
  Book,
  BookPlus
  , ClipboardList
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin, isReader } = useContext(AuthContext);
  const [keyword, setKeyword] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [avatarErrorSource, setAvatarErrorSource] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  

  // Đóng dropdown khi click ra ngoài màn hình
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Xử lý Tìm kiếm
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
    setIsDropdownOpen(false);
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

          {/* 2. Thanh Tìm Kiếm */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sách..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition duration-200"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </form>

          {/* 3. Menu Điều Hướng */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            <Link
              to="/"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline">Khám Phá</span>
            </Link>
            <Link
                to="/books/create"
                onClick={() => setIsDropdownOpen(false)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-2"
              >
                <BookPlus className="w-4 h-4 text-emerald-400" />
                <span className="hidden md:inline">Đăng sách</span>
              </Link>
            {isReader && (
              <Link
              to="/users/bookshelfs"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-2"
            >
              <BookmarkCheck className="w-4 h-4 text-violet-400" />
              <span className="hidden md:inline">Tủ Sách</span>
            </Link>
            )}
            {isAdmin && (
              <>
              <Link
                to="/admin?tab=books&status=PENDING"
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="hidden xl:inline">Duyệt sách</span>
                <span className="xl:hidden">Admin</span>
              </Link>
                </>
            )}

            {/* {user && (
              
            )} */}

            {/* Dropdown Profile */}
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition border border-transparent focus:border-slate-700"
              >
                {user?.avatar && avatarErrorSource !== user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    onError={() => setAvatarErrorSource(user.avatar)}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs ring-1 ring-indigo-500/50">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-200 hidden sm:inline-block max-w-[100px] truncate">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-slate-200">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-[10px] text-slate-400">Đăng nhập với danh nghĩa</p>
                    <p className="text-sm font-bold text-slate-100 truncate">{user?.username}</p>
                  </div>

                  {isAdmin && (
                    <>
                    <Link
                      to="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-slate-800 transition text-amber-300 hover:text-amber-200"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      Quản lý hệ thống
                    </Link>
                    <Link
                      to="/users/bookshelfs"
                      className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-2"
                    >
                      <BookmarkCheck className="w-4 h-4 text-violet-400" />
                      Tủ Sách
                    </Link>
                    </>
                    )}

                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-slate-800 transition text-slate-300 hover:text-white"
                  >
                    <User className="w-4 h-4 text-indigo-400" />
                    Trang Cá Nhân
                  </Link>
                  <Link
                    to="/my-books"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-slate-800 transition text-slate-300 hover:text-white"
                  >
                    <Book className="w-4 h-4 text-indigo-400" />
                    <span>Sách của tôi</span>
                  </Link>
                  <Link
                    to="/quiz-history"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-slate-800 transition text-slate-300 hover:text-white"
                  >
                    <ClipboardList className="w-4 h-4 text-amber-400" />
                    <span>Lịch sử làm Quiz</span>
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