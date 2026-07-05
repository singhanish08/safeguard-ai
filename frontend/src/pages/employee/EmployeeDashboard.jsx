import { useNavigate } from 'react-router-dom';
import { Plus, AlertTriangle, CheckCircle2, Activity, FileWarning } from 'lucide-react';
import { useEmployeeDashboard } from '../../hooks/useDashboard';
import StatCard from '../../components/common/StatCard';
import IncidentTable from '../../components/incidents/IncidentTable';
import PageHeader from '../../components/common/PageHeader';
import { CardSkeleton, TableSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export default function EmployeeDashboard() {
  const { data, isLoading, isError, refetch } = useEmployeeDashboard();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Employee Dashboard" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
        <TableSkeleton />
      </div>
    );
  }

  if (isError) return <ErrorState message="Failed to load dashboard" onRetry={refetch} />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Employee Dashboard"
        description="Overview of your reported incidents"
        action={
          <button
            onClick={() => navigate('/employee/report')}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Report New Incident
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard icon={FileWarning} label="Total Reported" value={data?.totalIncidents} color="indigo" />
        <StatCard icon={Activity} label="Open Incidents" value={data?.openIncidents} color="amber" />
        <StatCard icon={CheckCircle2} label="Completed" value={data?.resolvedIncidents} color="emerald" />
        <StatCard icon={AlertTriangle} label="High Risk" value={data?.highRiskIncidents} color="red" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-4">Recent My Incidents</h2>
        {data?.recentIncidents?.length > 0 ? (
          <IncidentTable incidents={data.recentIncidents} showReporter={false} />
        ) : (
          <EmptyState
            title="No incidents reported"
            description="You haven't reported any incidents yet."
            action={
              <button onClick={() => navigate('/employee/report')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Report Your First Incident
              </button>
            }
          />
        )}
      </div>

      {data?.safetyTip && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-6">
          <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1">Safety Tip of the Day</p>
          <p className="text-sm text-indigo-900">{data.safetyTip}</p>
        </div>
      )}
    </div>
  );
}
