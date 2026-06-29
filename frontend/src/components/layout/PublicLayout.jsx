import { Outlet } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';

export default function PublicLayout() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950">
      <ThemeToggle className="fixed bottom-4 right-4 z-[60] bg-white/90 shadow-sm backdrop-blur dark:bg-slate-900/90" />
      <Outlet />
    </div>
  );
}
