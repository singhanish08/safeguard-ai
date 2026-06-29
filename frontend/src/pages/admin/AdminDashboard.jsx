import { useAdminDashboard } from '../../hooks/useDashboard';
import StatCard from '../../components/common/StatCard';
import IncidentTable from '../../components/incidents/IncidentTable';
import DepartmentChart from '../../components/charts/DepartmentChart';
import StatusDonutChart from '../../components/charts/StatusDonutChart';
import PageHeader from '../../components/common/PageHeader';
import { CardSkeleton, ChartSkeleton, TableSkeleton } from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import { Users, UserCheck, Shield, Building2, FileWarning, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Admin Dashboard" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <ChartSkeleton /><ChartSkeleton />
        </div>
      </div>
    );
  }

  if (isError) return <ErrorState message="Failed to load dashboard" onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" description="System-wide overview" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <StatCard icon={Users} label="Total Users" value={data?.totalUsers} />
        <StatCard icon={UserCheck} label="Employees" value={data?.totalEmployees} />
        <StatCard icon={Shield} label="Managers" value={data?.totalManagers} />
        <StatCard icon={Building2} label="Departments" value={data?.totalDepartments} />
        <StatCard icon={FileWarning} label="Total Incidents" value={data?.totalIncidents} />
        <StatCard icon={AlertTriangle} label="High Severity" value={data?.highSeverityIncidents} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Department-wise Incidents</h2>
          <DepartmentChart data={data?.departmentWise || []} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Incident Status</h2>
          <StatusDonutChart data={data?.statusDistribution || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Users</h2>
          {data?.recentUsers?.length > 0 ? (
            <div className="space-y-3">
              {data.recentUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded">{user.role}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No users yet.</p>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Incidents</h2>
          {data?.recentIncidents?.length > 0 ? (
            <IncidentTable incidents={data.recentIncidents} />
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No incidents yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
