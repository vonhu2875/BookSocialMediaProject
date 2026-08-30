import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { authService } from '../services/apiServices';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(formData);
      alert('Tạo tài khoản thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-900/5 selection:bg-indigo-500 selection:text-white">
      {/* Banner Bên Trái */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute -top-10 right-10 w-96 h-96 bg-violet-600/25 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 -left-10 w-80 h-80 bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex items-center space-x-3 z-10">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/30 text-white">
            R
          </div>
          <span className="text-2xl font-black tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-slate-400">
            Readora
          </span>
        </div>

        <div className="space-y-6 max-w-lg z-10">
          <h1 className="text-5xl font-black leading-tight tracking-wide text-white">
            Bắt đầu hành trình <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">
              Đọc & Sáng Tạo.
            </span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed tracking-normal">
            Tạo tài khoản hoàn toàn miễn phí chỉ trong vài giây. Lưu trữ tủ sách cá nhân, theo dõi tiến độ đọc và khám phá hàng ngàn tựa sách hay.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium z-10 tracking-wider">
          © 2026 Readora Platform. Built for the next-gen readers.
        </div>
      </div>

      {/* Form Đăng Ký Bên Phải */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl shadow-indigo-950/5 border border-slate-100">
          
          {/* Căn Giữa Tiêu Đề */}
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-wide">Tạo Tài Khoản</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium tracking-wide">Trở thành một phần của cộng đồng Readora</p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-r-2xl text-sm font-medium tracking-wide">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Họ</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn"
                  className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition text-sm outline-none font-medium text-slate-800 tracking-wide"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Tên</label>
                <input
                  type="text"
                  required
                  placeholder="Văn A"
                  className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition text-sm outline-none font-medium text-slate-800 tracking-wide"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Tên đăng nhập</label>
              <input
                type="text"
                required
                placeholder="username123"
                className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition text-sm outline-none font-medium text-slate-800 tracking-wide"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Email</label>
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition text-sm outline-none font-medium text-slate-800 tracking-wide"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Mật khẩu</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition text-sm outline-none font-medium text-slate-800 tracking-wide"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-2xl text-sm transition duration-200 shadow-xl shadow-indigo-600/25 active:scale-[0.98] disabled:opacity-50 mt-2 flex items-center justify-center space-x-2 tracking-wider"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang khởi tạo...</span>
                </>
              ) : (
                'Đăng Ký Ngay'
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium tracking-wide">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-indigo-600 font-bold hover:text-violet-600 transition">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}