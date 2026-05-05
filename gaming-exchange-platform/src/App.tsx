import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BlogHomePage from './pages/blog/HomePage';
import PostPage from './pages/blog/PostPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import WritePost from './pages/admin/WritePost';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BlogHomePage />} />
        <Route path="/post/:slug" element={<PostPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/write" element={<WritePost />} />
        <Route path="/admin/edit/:id" element={<WritePost />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
