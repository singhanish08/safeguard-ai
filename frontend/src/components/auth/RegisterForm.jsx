import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPublicDepartments } from '../../api/departmentApi';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  department: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { data: deptData, isError: departmentsError, refetch: retryDepartments, isFetching: departmentsLoading } = useQuery({
    queryKey: ['publicDepartments'],
    queryFn: () => getPublicDepartments().then((r) => r.data.data),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        department: data.department || undefined,
        role: 'employee',
      });
      toast.success('Registration successful!');
      navigate('/employee/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Full Name</label>
        <input {...register('name')} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="John Doe" />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
        <input {...register('email')} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="you@company.com" />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Department</label>
        <select {...register('department')} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
          <option value="">{departmentsLoading ? 'Loading departments...' : 'Select department (optional)'}</option>
          {(deptData || []).map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
        {departmentsError && (
          <div className="mt-1.5 flex items-center justify-between gap-3 text-xs text-amber-700">
            <span>Departments could not be loaded. You can retry or register without selecting one.</span>
            <button type="button" onClick={() => retryDepartments()} className="shrink-0 font-semibold text-indigo-600 hover:text-indigo-700">
              Retry
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Password</label>
        <input type="password" {...register('password')} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="At least 6 characters" />
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Confirm Password</label>
        <input type="password" {...register('confirmPassword')} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Repeat your password" />
        {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
