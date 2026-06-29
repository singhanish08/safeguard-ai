import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const role = searchParams.get('role');
    if (role === 'employee') {
      setValue('email', 'employee@safeguard.com');
      setValue('password', 'demo1234');
    } else if (role === 'manager') {
      setValue('email', 'manager@safeguard.com');
      setValue('password', 'demo1234');
    } else if (role === 'admin') {
      setValue('email', 'admin@safeguard.com');
      setValue('password', 'demo1234');
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'manager') navigate('/manager/dashboard');
      else navigate('/employee/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role, email) => {
    setValue('email', email);
    setValue('password', 'demo1234');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">Email</label>
        <input {...register('email')} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors bg-slate-50" placeholder="you@company.com" />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">Password</label>
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} {...register('password')} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors bg-slate-50 pr-10" placeholder="Enter your password" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 rounded-xl transition-colors mt-6 text-sm disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="flex justify-center gap-4 mt-5 text-xs">
        <button type="button" onClick={() => fillDemo('employee', 'employee@safeguard.com')} className="text-indigo-600 font-semibold hover:underline cursor-pointer">Employee</button>
        <button type="button" onClick={() => fillDemo('manager', 'manager@safeguard.com')} className="text-emerald-600 font-semibold hover:underline cursor-pointer">Manager</button>
        <button type="button" onClick={() => fillDemo('admin', 'admin@safeguard.com')} className="text-amber-600 font-semibold hover:underline cursor-pointer">Admin</button>
      </div>
    </form>
  );
}
