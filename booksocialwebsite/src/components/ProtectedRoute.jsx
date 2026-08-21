import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function ProtectedRoute({ requireAdmin = false }) {
  const { user, loading } = useContext(AuthContext);

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