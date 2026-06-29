import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Shield, LayoutDashboard, FileWarning, Users, Building2, FileText, User, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const navItems = {
  employee: [
    { to: '/employee/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/employee/report', icon: FileWarning, label: 'Report Incident' },
    { to: '/employee/my-incidents', icon: FileText, label: 'My Incidents' },
    { to: '/profile', icon: User, label: 'Profile' },
  ],
  manager: [
    { to: '/manager/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/manager/incidents', icon: FileText, label: 'All Incidents' },
    { to: '/manager/reports', icon: FileWarning, label: 'Reports' },
    { to: '/profile', icon: User, label: 'Profile' },
  ],
  admin: [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/departments', icon: Building2, label: 'Departments' },
    { to: '/manager/incidents', icon: FileText, label: 'All Incidents' },
    { to: '/profile', icon: User, label: 'Profile' },
  ],
};

export default function Sidebar({ open, onClose }) {
  const { user, isEmployee, isManager } = useAuth();
  const role = isEmployee ? 'employee' : isManager ? 'manager' : 'admin';
  const items = navItems[role] || [];

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}
      <aside className={cn(
        'fixed left-0 top-0 h-screen w-64 bg-[#101827] flex flex-col z-50 shadow-2xl transition-transform duration-200',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        <div className="h-[72px] px-5 border-b border-white/10 flex items-center justify-between">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/20"><Shield className="w-5 h-5" /></span>
            <span className="text-lg font-bold text-white">SafeGuard AI</span>
          </NavLink>
          <button onClick={onClose} className="text-slate-400 hover:text-white md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Workspace</p>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium mb-1 transition-all',
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/25'
                  : 'text-slate-400 hover:bg-white/[.06] hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 rounded-xl bg-white/[.04] p-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
