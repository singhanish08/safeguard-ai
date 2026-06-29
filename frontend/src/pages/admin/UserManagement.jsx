import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, updateUser, toggleUserStatus } from '../../api/userApi';
import { getAllDepartments } from '../../api/departmentApi';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';
import { Search, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users', { search, role: roleFilter, page, limit: 10 }],
    queryFn: () => getAllUsers({ search, role: roleFilter, page, limit: 10 }).then((r) => r.data.data),
  });

  const { data: deptData } = useQuery({
    queryKey: ['departments'],
    queryFn: () => getAllDepartments().then((r) => r.data.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated');
      setEditingUser(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update user'),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User status toggled');
      setConfirmId(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to toggle status'),
  });

  const users = data?.users || [];
  const departments = deptData || [];

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description="Manage all system users" />

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search users..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Roles</option>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase">Name</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase">Email</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase">Role</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase">Department</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase">Status</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase">Joined</th>
              <th className="text-right px-4 py-3 font-medium text-slate-500 text-xs uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="capitalize text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{user.role}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">{user.department?.name || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditingUser(user)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmId(user._id)} className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50">
                      {user.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && !isLoading && (
          <p className="text-sm text-slate-400 text-center py-8">No users found.</p>
        )}
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setEditingUser(null)} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.target);
              updateMutation.mutate({
                id: editingUser._id,
                data: {
                  name: form.get('name'),
                  email: form.get('email'),
                  role: form.get('role'),
                  department: form.get('department') || null,
                },
              });
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Name</label>
                <input name="name" defaultValue={editingUser.name} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Email</label>
                <input name="email" defaultValue={editingUser.email} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Role</label>
                <select name="role" defaultValue={editingUser.role} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Department</label>
                <select name="department" defaultValue={editingUser.department?._id || ''} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">None</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={updateMutation.isPending} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                  {updateMutation.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        title="Toggle User Status"
        message="Are you sure you want to change this user's active status?"
        confirmLabel="Toggle"
        onConfirm={() => toggleMutation.mutate(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
