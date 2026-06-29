import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';

import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ReportIncident from './pages/employee/ReportIncident';
import MyIncidents from './pages/employee/MyIncidents';

import ManagerDashboard from './pages/manager/ManagerDashboard';
import AllIncidents from './pages/manager/AllIncidents';
import Reports from './pages/manager/Reports';

import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';

import IncidentDetail from './pages/shared/IncidentDetail';
import ProfilePage from './pages/shared/ProfilePage';

import NotFound from './pages/errors/NotFound';
import ServerError from './pages/errors/ServerError';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function RoleRoute({ children, roles }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function DashboardRedirect() {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'manager') return <Navigate to="/manager/dashboard" replace />;
  return <Navigate to="/employee/dashboard" replace />;
}

function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" /></div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppContent() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<GuestRoute><LandingPage /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/dashboard" element={<DashboardRedirect />} />

      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/employee/dashboard" element={<RoleRoute roles={['employee']}><EmployeeDashboard /></RoleRoute>} />
        <Route path="/employee/report" element={<RoleRoute roles={['employee']}><ReportIncident /></RoleRoute>} />
        <Route path="/employee/my-incidents" element={<RoleRoute roles={['employee']}><MyIncidents /></RoleRoute>} />

        <Route path="/manager/dashboard" element={<RoleRoute roles={['manager']}><ManagerDashboard /></RoleRoute>} />
        <Route path="/manager/incidents" element={<RoleRoute roles={['manager', 'admin']}><AllIncidents /></RoleRoute>} />
        <Route path="/manager/reports" element={<RoleRoute roles={['manager']}><Reports /></RoleRoute>} />

        <Route path="/admin/dashboard" element={<RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>} />
        <Route path="/admin/users" element={<RoleRoute roles={['admin']}><UserManagement /></RoleRoute>} />
        <Route path="/admin/departments" element={<RoleRoute roles={['admin']}><DepartmentManagement /></RoleRoute>} />

        <Route path="/incidents/:id" element={<IncidentDetail />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: { borderRadius: '10px', background: '#0F172A', color: '#fff', fontSize: '14px' },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
