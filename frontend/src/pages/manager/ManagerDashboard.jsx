import { useManagerDashboard } from '../../hooks/useDashboard';
import StatCard from '../../components/common/StatCard';
import IncidentTable from '../../components/incidents/IncidentTable';
import MonthlyTrendChart from '../../components/charts/MonthlyTrendChart';
import SeverityPieChart from '../../components/charts/SeverityPieChart';
import DepartmentChart from '../../components/charts/DepartmentChart';
import StatusDonutChart from '../../components/charts/StatusDonutChart';
import PageHeader from '../../components/common/PageHeader';
import { CardSkeleton, ChartSkeleton, TableSkeleton } from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import { AlertTriangle, Activity, CheckCircle2, FileWarning, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ManagerDashboard() {
  const { data, isLoading, isError, refetch } = useManagerDashboard();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Manager Dashboard" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartSkeleton /><ChartSkeleton />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  if (isError) return <ErrorState message="Failed to load dashboard" onRetry={refetch} />;

  return (
    <div className="space-y-8">
      <PageHeader title="Manager Dashboard" description="Safety overview and analytics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard icon={FileWarning} label="Total Incidents" value={data?.totalIncidents} color="indigo" />
        <StatCard icon={Activity} label="Open Incidents" value={data?.openIncidents} color="amber" />
        <StatCard icon={AlertTriangle} label="High Risk" value={data?.highRiskIncidents} color="red" />
        <StatCard icon={CheckCircle2} label="Resolved This Month" value={data?.resolvedThisMonth} color="emerald" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-6">Monthly Incident Trend</h2>
          <MonthlyTrendChart data={data?.monthlyTrend || []} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-6">Severity Distribution</h2>
          <SeverityPieChart data={data?.severityDistribution || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-6">Department-wise Incidents</h2>
          <DepartmentChart data={data?.departmentWise || []} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-6">Status Distribution</h2>
          <StatusDonutChart data={data?.statusDistribution || []} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-4">Recent Incidents</h2>
        {data?.recentIncidents?.length > 0 ? (
          <IncidentTable incidents={data.recentIncidents} />
        ) : (
          <p className="text-sm text-slate-400 text-center py-8">No incidents reported yet.</p>
        )}
      </div>

      {data?.highRiskAlerts?.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-red-700 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            High Risk Alerts
          </h2>
          <div className="space-y-3">
            {data.highRiskAlerts.map((alert) => (
              <div key={alert._id} onClick={() => navigate(`/incidents/${alert._id}`)} className="flex items-center justify-between p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-900">{alert.title}</p>
                  <p className="text-xs text-slate-500">{alert.department?.name} • {alert.reporter?.name}</p>
                </div>
                <span className="text-lg font-bold text-red-600">{alert.aiAnalysis?.riskScore}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
