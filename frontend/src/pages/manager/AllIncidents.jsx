import { useState } from 'react';
import { useIncidents } from '../../hooks/useIncidents';
import IncidentTable from '../../components/incidents/IncidentTable';
import IncidentFilters from '../../components/incidents/IncidentFilters';
import PageHeader from '../../components/common/PageHeader';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AllIncidents() {
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const { data, isLoading, isError, refetch } = useIncidents(filters);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1, limit: 10 });
  };

  const handleClearFilters = () => {
    setFilters({ page: 1, limit: 10 });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="All Incidents" />
        <TableSkeleton />
      </div>
    );
  }

  if (isError) return <ErrorState message="Failed to load incidents" onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Incidents</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and review all safety incidents</p>
        </div>
      </div>

      <IncidentFilters
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {data?.incidents?.length > 0 ? (
          <>
            <IncidentTable incidents={data.incidents} />
            {data.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Page {data.page} of {data.pages} ({data.total} total)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(data.page - 1)}
                    disabled={data.page <= 1}
                    className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(data.page + 1)}
                    disabled={data.page >= data.pages}
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
            title="No incidents found"
            description={Object.keys(filters).length > 3 ? 'Try adjusting your filters.' : 'No incidents have been reported yet.'}
          />
        )}
      </div>
    </div>
  );
}
