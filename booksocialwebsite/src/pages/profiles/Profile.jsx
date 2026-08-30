import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/apiServices';
import { AuthContext } from '../../contexts/AuthContext';
import { 
  User, 
  Lock, 
  Camera, 
  Save, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Mail,
  Shield,
  CalendarDays,
  BookmarkCheck,
  BookMarked,
  UserRoundCheck
  , ClipboardList
} from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);

  // State Form Thông tin cá nhân
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // State Form Đổi mật khẩu
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State UI
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [updatingInfo, setUpdatingInfo] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [infoMessage, setInfoMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);

  // 1. Tải thông tin cá nhân (GET /users/my-info)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingInfo(true);
        const response = await authService.getMyInfo();
        const userData = response;

        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        setBio(userData.bio || '');
        setAvatarPreview(userData.avatar || null);

        if (setUser) setUser(userData);
      } catch (err) {
        console.error('Lỗi tải thông tin cá nhân:', err);
        setInfoMessage({ type: 'error', text: 'Không thể tải thông tin cá nhân.' });
      } finally {
        setLoadingInfo(false);
      }
    };

    fetchProfile();
  }, [setUser]);

  // Handle chọn ảnh đại diện
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh tối đa là 5MB');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // 2. Cập nhật thông tin cá nhân (PUT /users/my-info)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setInfoMessage(null);

    try {
      setUpdatingInfo(true);
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      if (bio) formData.append('bio', bio);
      if (avatarFile) formData.append('avatar', avatarFile);

      const response = await authService.updateMyInfo(formData);
      const updatedUser = response;
      if (setUser) setUser(updatedUser);

      setInfoMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } catch (err) {
      console.error('Lỗi cập nhật thông tin:', err);
      setInfoMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Cập nhật thông tin thất bại.' 
      });
    } finally {
      setUpdatingInfo(false);
    }
  };

  // 3. Đổi mật khẩu (PUT /users/change-password)
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Mật khẩu mới không trùng khớp!' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
      return;
    }

    try {
      setChangingPassword(true);
      await authService.changePassword({
        oldPassword,
        newPassword
      });

      setPasswordMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Lỗi đổi mật khẩu:', err);
      setPasswordMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Mật khẩu cũ không chính xác hoặc có lỗi xảy ra.' 
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loadingInfo) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-2" />
        <span>Đang tải thông tin cá nhân...</span>
      </div>
    );
  }

  const displayName = [firstName, lastName].filter(Boolean).join(' ') || user?.username || 'Bạn đọc';
  const joinedDate = user?.createdDate
    ? new Date(user.createdDate).toLocaleDateString('vi-VN')
    : 'Chưa cập nhật';
  const roleLabel = user?.role === 'ADMIN' ? 'Quản trị viên' : 'Bạn đọc';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <User className="w-8 h-8 text-indigo-500" />
            Trang Cá Nhân
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Quản lý thông tin hồ sơ và bảo mật tài khoản của bạn.
          </p>
        </div>

        {/* Tổng quan hồ sơ */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt={displayName}
                onError={() => setAvatarPreview(null)}
                className="w-24 h-24 rounded-2xl object-cover ring-2 ring-indigo-500/40"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-indigo-600/20 text-indigo-300 font-black text-3xl flex items-center justify-center border border-indigo-500/30">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-black text-white truncate">{displayName}</h2>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-300">
                  <UserRoundCheck className="w-3.5 h-3.5" />
                  {roleLabel}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">@{user?.username || 'username'}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  {user?.email || 'Chưa cập nhật email'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
                  Tham gia {joinedDate}
                </span>
                <span className={`inline-flex items-center gap-1.5 ${user?.active ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {user?.active ? 'Tài khoản đang hoạt động' : 'Tài khoản bị khóa'}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-800">
            <Link to="/my-books" className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition">
              <BookMarked className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-300">Quản lý sách của tôi</span>
            </Link>
            <Link to="/users/bookshelfs" className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition">
              <BookmarkCheck className="w-5 h-5 text-violet-400" />
              <span className="text-xs font-semibold text-slate-300">Mở tủ sách cá nhân</span>
            </Link>
            <Link to="/quiz-history" className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition">
              <ClipboardList className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-semibold text-slate-300">Lịch sử làm Quiz</span>
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* CỘT TRÁI: Form Cập Nhật Thông Tin Cá Nhân */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                Thông Tin Cá Nhân
              </h2>

              {infoMessage && (
                <div className={`p-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 ${
                  infoMessage.type === 'success' 
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                }`}>
                  {infoMessage.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{infoMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-5">

                {/* Avatar Upload */}
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        onError={() => setAvatarPreview(null)}
                        className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/30"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 text-indigo-400 font-black text-2xl flex items-center justify-center border border-indigo-500/30">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <label className="absolute inset-0 bg-slate-950/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                      <Camera className="w-6 h-6 text-white" />
                      <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300">Ảnh Đại Diện</label>
                    <p className="text-[11px] text-slate-500 mt-0.5">PNG, JPG, WEBP tối đa 5MB</p>
                  </div>
                </div>

                {/* Username & Email (Chỉ Xem) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Tên Đăng Nhập</label>
                    <div className="px-4 py-2.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-slate-500" />
                      <span>{user?.username}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Email</label>
                    <div className="px-4 py-2.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span>{user?.email || 'Chưa cập nhật'}</span>
                    </div>
                  </div>
                </div>

                {/* Họ & Tên */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Họ</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nhập họ..."
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Tên</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Nhập tên..."
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updatingInfo}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition"
                  >
                    {updatingInfo ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Lưu Thay Đổi</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* CỘT PHẢI: Form Đổi Mật Khẩu */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-400" />
                Đổi Mật Khẩu
              </h2>

              {passwordMessage && (
                <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  passwordMessage.type === 'success' 
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                }`}>
                  {passwordMessage.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Mật Khẩu Hiện Tại</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Mật Khẩu Mới</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Xác Nhận Mật Khẩu Mới</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-semibold text-xs rounded-xl transition border border-slate-700"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang cập nhật...</span>
                    </>
                  ) : (
                    <span>Cập Nhật Mật Khẩu</span>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}