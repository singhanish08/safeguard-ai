import { useState } from 'react';
import { useMyIncidents } from '../../hooks/useIncidents';
import IncidentTable from '../../components/incidents/IncidentTable';
import PageHeader from '../../components/common/PageHeader';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MyIncidents() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useMyIncidents({ page, limit: 10 });
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Incidents" />
        <TableSkeleton />
      </div>
    );
  }

  if (isError) return <ErrorState message="Failed to load incidents" onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Incidents"
        description="All incidents you have reported"
        action={
          <button onClick={() => navigate('/employee/report')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" />
            New Incident
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {data?.incidents?.length > 0 ? (
          <>
            <IncidentTable incidents={data.incidents} showReporter={false} />
            {data.pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Page {data.page} of {data.pages} ({data.total} total)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                    disabled={page === data.pages}
                    className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No incidents reported"
            description="You haven't reported any safety incidents yet."
            action={
              <button onClick={() => navigate('/employee/report')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Report Your First Incident
              </button>
            }
          />
        )}
      </div>
    </div>
  );
}
