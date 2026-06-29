import { Shield } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterPage() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    const target = user.role === 'admin' ? '/admin/dashboard' : user.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard';
    return <Navigate to={target} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-8 h-8 text-indigo-400" />
            <span className="text-xl font-bold text-white">SafeGuard AI</span>
          </div>
          <p className="text-slate-400 text-sm">Create your employee account</p>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-6">
          <RegisterForm />
          <p className="text-center text-xs text-slate-400 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
