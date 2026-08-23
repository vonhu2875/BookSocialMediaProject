import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import ChapterView from './pages/ChapterView';

// Layout dùng chung cho các trang yêu cầu đăng nhập
function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Navbar cố định phía trên */}
      <Navbar />
      
      {/* Nội dung thay đổi tùy thuộc vào Route */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Reader Routes (Yêu cầu phải đăng nhập) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/chapters/:chapterId" element={<ChapterView />} />
              <Route path="/bookshelfs" element={<div className="p-8 font-bold text-center">Tủ sách cá nhân</div>} />
              <Route path="/profile" element={<div className="p-8 font-bold text-center">Trang cá nhân</div>} />
            </Route>
          </Route>

          {/* Admin Routes (Yêu cầu quyền ADMIN) */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route element={<MainLayout />}>
              <Route path="/books/pending" element={<div className="p-8 font-bold text-center">Trang duyệt sách Admin</div>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}