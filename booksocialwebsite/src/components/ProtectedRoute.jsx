import { useContext, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function ProtectedRoute({ requireAdmin = false }) {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthExpired = () => {
      if (window.location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, [navigate]);

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray-500">Đang tải trạng thái...</div>;
  }

  // Chưa đăng nhập -> Chuyển về trang Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Cần quyền ADMIN nhưng user chỉ là READER -> Chuyển về trang chủ
  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
export default ProtectedRoute;