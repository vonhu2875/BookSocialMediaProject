import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import ChapterView from './pages/ChapterView';
import UploadBook from './pages/UploadBook';
import Profile from './pages/profiles/Profile';
import QuizResult from './components/QuizResult';
import QuizView from './components/QuizView';
import Bookshelfs from './pages/profiles/BookShelf';
import MyBooks from './pages/profiles/MyBooks';
import CreateChapter from './pages/CreateChapter';
import EditBook from './pages/EditBook';
import EditChapter from './pages/EditChapter';
import QuizHistory from './pages/profiles/QuizHistory';
import AdminDashboard from './pages/AdminDashboard';

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