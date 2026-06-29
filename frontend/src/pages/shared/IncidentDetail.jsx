import { useParams, useNavigate } from 'react-router-dom';
import { useIncident, useUpdateStatus, useUpdateRemarks, useAssignIncident } from '../../hooks/useIncidents';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../../api/userApi';
import AIAnalysisCard from '../../components/incidents/AIAnalysisCard';
import ManagerRemarksSection from '../../components/incidents/ManagerRemarksSection';
import IncidentTimeline from '../../components/common/IncidentTimeline';
import StatusBadge from '../../components/common/StatusBadge';
import SeverityBadge from '../../components/common/SeverityBadge';
import PageHeader from '../../components/common/PageHeader';
import ErrorState from '../../components/common/ErrorState';
import { formatDateTime } from '../../utils/formatDate';
import { useAuth } from '../../hooks/useAuth';
import { ArrowLeft, CalendarDays, MapPin, Building2, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isManager, isAdmin, user } = useAuth();
  const canManage = isManager || isAdmin;

  const { data: incident, isLoading, isError, refetch } = useIncident(id);
  const updateStatus = useUpdateStatus();
  const updateRemarks = useUpdateRemarks();
  const assignIncident = useAssignIncident();

  const [statusValue, setStatusValue] = useState('');
  const [assignValue, setAssignValue] = useState('');

  const { data: usersData } = useQuery({
    queryKey: ['users', { limit: 100 }],
    queryFn: () => getAllUsers({ limit: 100 }).then((r) => r.data.data),
    enabled: canManage,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-4">
            <div className="h-64 bg-slate-100 rounded-xl" />
            <div className="h-48 bg-slate-100 rounded-xl" />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="h-96 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) return <ErrorState message="Failed to load incident" onRetry={refetch} />;
  if (!incident) return <ErrorState message="Incident not found" />;

  const handleStatusUpdate = async () => {
    if (!statusValue) return;
    try {
      await updateStatus.mutateAsync({ id, data: { status: statusValue } });
      toast.success('Status updated');
      setStatusValue('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAssign = async () => {
    if (!assignValue) return;
    try {
      await assignIncident.mutateAsync({ id, data: { assignedTo: assignValue } });
      toast.success('Incident assigned');
      setAssignValue('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign');
    }
  };

  return (
    <div className="space-y-0">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-3">{incident.title}</h1>

            <div className="flex items-center gap-2 mb-6">
              <StatusBadge status={incident.status} />
              <SeverityBadge severity={incident.aiAnalysis?.severityLevel} />
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{incident.priority} Priority</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 mb-6 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                <span>{incident.reporter?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>{incident.incidentDate ? formatDateTime(incident.incidentDate) : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{incident.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{incident.department?.name}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Description</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{incident.description}</p>
            </div>

            {incident.assignedTo && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Assigned To</p>
                <p className="text-sm text-slate-700">{incident.assignedTo.name}</p>
              </div>
            )}
          </div>

          {incident.images?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Image Evidence</p>
              <div className="grid grid-cols-2 gap-3">
                {incident.images.map((img, idx) => (
                  <a key={idx} href={img} target="_blank" rel="noopener noreferrer">
                    <img src={img} alt={`Evidence ${idx + 1}`} className="rounded-xl overflow-hidden aspect-video object-cover w-full cursor-pointer hover:opacity-90 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Status Timeline</p>
            <IncidentTimeline statusHistory={incident.statusHistory} currentStatus={incident.status} />
          </div>

          <ManagerRemarksSection
            remarks={incident.managerRemarks}
            isManager={canManage}
            onSave={async (text) => {
              try {
                await updateRemarks.mutateAsync({ id, data: { remarks: text } });
                toast.success('Remarks saved');
              } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to save remarks');
              }
            }}
            saving={updateRemarks.isPending}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <AIAnalysisCard analysis={incident.aiAnalysis} />

          {canManage && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Manager Actions</h3>

              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1.5">Update Status</label>
                <select
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">Select status</option>
                  {['Open', 'Under Investigation', 'Assigned', 'Resolved', 'Closed']
                    .filter((s) => s !== incident.status)
                    .map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={!statusValue || updateStatus.isPending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors mt-2 disabled:opacity-50"
                >
                  {updateStatus.isPending ? 'Updating...' : 'Update Status'}
                </button>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1.5">Assign To</label>
                <select
                  value={assignValue}
                  onChange={(e) => setAssignValue(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">Select user</option>
                  {(usersData?.users || []).map((u) => (
                    <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={!assignValue || assignIncident.isPending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors mt-2 disabled:opacity-50"
                >
                  {assignIncident.isPending ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
