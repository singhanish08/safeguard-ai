import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../api/departmentApi';
import { getAllUsers } from '../../api/userApi';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function DepartmentManagement() {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();

  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => getAllDepartments().then((r) => r.data.data),
  });

  const { data: usersData } = useQuery({
    queryKey: ['users', { limit: 100 }],
    queryFn: () => getAllUsers({ limit: 100 }).then((r) => r.data.data),
  });

  const users = usersData?.users || [];

  const createMutation = useMutation({
    mutationFn: (data) => createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department created');
      setShowModal(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department updated');
      setEditing(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department deleted');
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  const handleSubmit = (e, isEdit) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = {
      name: form.get('name'),
      description: form.get('description'),
      head: form.get('head') || null,
    };
    if (isEdit) {
      updateMutation.mutate({ id: editing._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Management"
        description="Manage departments in your organization"
        action={
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Department
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase">Name</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase">Description</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase">Head</th>
              <th className="text-right px-4 py-3 font-medium text-slate-500 text-xs uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(departments || []).map((dept) => (
              <tr key={dept._id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{dept.name}</td>
                <td className="px-4 py-3 text-slate-500 text-xs max-w-xs truncate">{dept.description || '—'}</td>
                <td className="px-4 py-3 text-slate-600">{dept.head?.name || '—'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditing(dept)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(dept._id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!departments || departments.length === 0) && !isLoading && (
          <p className="text-sm text-slate-400 text-center py-8">No departments yet.</p>
        )}
      </div>

      {(showModal || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => { setShowModal(false); setEditing(null); }} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Department' : 'Add Department'}</h3>
            <form onSubmit={(e) => handleSubmit(e, !!editing)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Name</label>
                <input name="name" defaultValue={editing?.name} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Description</label>
                <textarea name="description" defaultValue={editing?.description} rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Department Head</label>
                <select name="head" defaultValue={editing?.head?._id || ''} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">None</option>
                  {users.filter((u) => u.role === 'manager' || u.role === 'admin').map((u) => (
                    <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Department"
        message="Are you sure? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
