import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { authService } from '../services/apiServices';
import { AuthContext } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(formData);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Tài khoản hoặc mật khẩu không chính xác!');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');

      // credentialResponse.credential chính là idToken từ Google
      const data = await authService.googleLogin(credentialResponse.credential);
      
      // Lấy kết quả từ ApiResponse<LoginResponse> của Backend
      login(data);
      navigate('/'); // Chuyển hướng sang trang chủ
    }catch (err) {
      setError(err.message || 'Đăng nhập bằng Google thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-900/5 selection:bg-indigo-500 selection:text-white">
      {/* Banner Bên Trái */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="flex items-center space-x-3 z-10">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/30 text-white">
            R
          </div>
          <span className="text-2xl font-black tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-slate-400">
            Readora
          </span>
        </div>

        <div className="space-y-6 max-w-lg z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-950/80 border border-indigo-800/50 rounded-full text-xs font-semibold text-indigo-300 backdrop-blur-md tracking-wide">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Nền tảng đọc sách thế hệ mới
          </div>
          <h1 className="text-5xl font-black leading-tight tracking-wide text-white">
            Tri thức kết nối. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
              Trải nghiệm thông minh.
            </span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed tracking-normal">
            Khám phá cộng đồng đọc sách hiện đại, thảo luận thời gian thực, thử sức với Quiz AI và tự do sáng tạo nội dung của riêng bạn.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium z-10 tracking-wider">
          © 2026 Readora Platform. Built for the next-gen readers.
        </div>
      </div>

      {/* Form Đăng Nhập Bên Phải */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl shadow-indigo-950/5 border border-slate-100">
          
          {/* Tiêu đề căn giữa + Tracking Wide */}
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-wide">Đăng Nhập</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium tracking-wide">Chào mừng bạn quay trở lại với Readora</p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-r-2xl text-sm font-medium tracking-wide">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Tên đăng nhập</label>
              <input
                type="text"
                required
                placeholder="Nhập username..."
                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/80 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition duration-200 text-sm outline-none font-medium text-slate-800 tracking-wide"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Nhập mật khẩu..."
                  className="w-full px-4 py-3 pr-12 bg-slate-50/80 border border-slate-200/80 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition duration-200 text-sm outline-none font-medium text-slate-800 tracking-wide"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-2xl text-sm transition duration-200 shadow-xl shadow-indigo-600/25 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2 tracking-wider"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang kết nối...</span>
                </>
              ) : (
                'Đăng Nhập'
              )}
            </button>
          </form>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Đăng nhập bằng Google thất bại!')}
            useOneTap
            shape="pill"
            theme="outline"
          />
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium tracking-wide">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-indigo-600 font-bold hover:text-violet-600 transition">
                Tạo tài khoản mới
              </Link>
            </p>
          </div>
          {/* <div className="flex justify-center mb-6">           */}
        {/* </div> */}
        </div>
      </div>
    </div>
  );
}