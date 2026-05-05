import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen particle-bg">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
