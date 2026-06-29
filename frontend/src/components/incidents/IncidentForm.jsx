import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllDepartments } from '../../api/departmentApi';
import { cn } from '../../utils/cn';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  incidentDate: z.string().min(1, 'Date is required'),
  incidentTime: z.string().min(1, 'Time is required'),
  category: z.string().min(1, 'Category is required'),
  priority: z.string().min(1, 'Priority is required'),
});

const categories = [
  'Chemical Leak', 'Fire Hazard', 'Equipment Failure', 'Electrical Hazard',
  'Gas Leak', 'Near Miss', 'Unsafe Condition', 'PPE Violation', 'Oil Spill', 'Other',
];

export default function IncidentForm({ onSubmit, loading }) {
  const [images, setImages] = useState([]);

  const { data: deptData } = useQuery({
    queryKey: ['departments'],
    queryFn: () => getAllDepartments().then((r) => r.data.data),
  });

  const departments = deptData || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      priority: 'Medium',
      incidentDate: new Date().toISOString().split('T')[0],
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - images.length;
    const toAdd = files.slice(0, remaining);
    setImages((prev) => [...prev, ...toAdd]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onFormSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    images.forEach((img) => formData.append('images', img));

    const dept = departments.find((d) => d._id === data.department);
    if (dept) formData.append('departmentName', dept.name);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Incident Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">Title</label>
            <input {...register('title')} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-colors" placeholder="e.g., Chemical spill in Unit 3" />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">Description</label>
            <textarea {...register('description')} rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-colors" placeholder="Describe what happened, what caused it, and any immediate actions taken..." />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">Department</label>
            <select {...register('department')} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-colors">
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
            {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">Location</label>
            <input {...register('location')} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-colors" placeholder="e.g., Building A, Floor 2" />
            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">Incident Date</label>
            <input type="date" {...register('incidentDate')} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-colors" />
            {errors.incidentDate && <p className="text-xs text-red-500 mt-1">{errors.incidentDate.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">Incident Time</label>
            <input type="time" {...register('incidentTime')} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-colors" />
            {errors.incidentTime && <p className="text-xs text-red-500 mt-1">{errors.incidentTime.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">Category</label>
            <select {...register('category')} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-colors">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">Priority</label>
            <select {...register('priority')} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-colors">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Image Evidence</h2>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-24 h-24 rounded-lg border border-slate-200 overflow-hidden group">
              <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <span className="text-sm text-slate-400">Upload images</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>
        <p className="text-xs text-slate-400">Upload up to 5 images (max 5MB each)</p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={cn(
            'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-sm shadow-sm',
            loading ? 'opacity-50 cursor-not-allowed' : ''
          )}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Analyzing with AI...
            </span>
          ) : (
            'Report Incident'
          )}
        </button>
      </div>
    </form>
  );
}
