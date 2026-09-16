import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import ChapterView from './pages/ChapterView';
import UploadBook from './pages/UploadBook';
import Profile from './pages/profiles/Profile';
import QuizResult from './pages/QuizResult';
import QuizView from './pages/QuizView';
import Bookshelfs from './pages/profiles/BookShelf';
import MyBooks from './pages/profiles/MyBooks';
import CreateChapter from './pages/CreateChapter';
import EditBook from './pages/EditBook';
import EditChapter from './pages/EditChapter';
import QuizHistory from './pages/profiles/QuizHistory';
import AdminDashboard from './pages/AdminDashboard';

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, search]);

  return null;
}

// Layout dùng chung cho các trang yêu cầu đăng nhập
function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100">
      <ScrollToTop />
      {/* Navbar cố định phía trên */}
      <Navbar />
      
      {/* Nội dung thay đổi tùy thuộc vào Route */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    element: <ProtectedRoute />,
    children: [{
      element: <MainLayout />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/books/:id', element: <BookDetail /> },
        { path: '/books/create', element: <UploadBook /> },
        { path: '/books/:id/chapters/create', element: <CreateChapter /> },
        { path: '/books/:id/edit', element: <EditBook /> },
        { path: '/chapters/:chapterId/edit', element: <EditChapter /> },
        { path: '/chapters/:chapterId', element: <ChapterView /> },
        { path: '/chapters/:chapterId/quizzes', element: <QuizView /> },
        { path: '/quiz-attempts/:attemptId', element: <QuizResult /> },
        { path: '/quiz-history', element: <QuizHistory /> },
        { path: '/profile', element: <Profile /> },
        { path: '/my-books', element: <MyBooks /> },
        { path: 'users/bookshelfs', element: <Bookshelfs /> },
      ],
    }],
  },
  {
    element: <ProtectedRoute requireAdmin={true} />,
    children: [{
      element: <MainLayout />,
      children: [{ path: '/admin', element: <AdminDashboard /> }],
    }],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}