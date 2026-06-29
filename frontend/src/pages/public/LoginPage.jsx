import { Shield } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    const target = user.role === 'admin' ? '/admin/dashboard' : user.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard';
    return <Navigate to={target} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10 mx-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-8 h-8 text-indigo-600" />
          <span className="text-3xl font-bold text-slate-900">SafeGuard AI</span>
        </div>
        <p className="text-center text-slate-500 text-sm mb-8">Sign in to your account</p>
        <LoginForm />
        <p className="text-center text-xs text-slate-500 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">Register</Link>
        </p>
      </div>
    </div>
  );
}
