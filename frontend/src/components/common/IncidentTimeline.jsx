import { formatDateTime } from '../../utils/formatDate';
import { cn } from '../../utils/cn';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const statusOrder = ['Open', 'Under Investigation', 'Assigned', 'Resolved', 'Closed'];

export default function IncidentTimeline({ statusHistory = [], currentStatus }) {
  const completedStatuses = statusHistory.map((h) => h.status);

  return (
    <div className="relative">
      {statusOrder.map((status, index) => {
        const historyEntry = statusHistory.find((h) => h.status === status);
        const isCompleted = !!historyEntry;
        const isCurrent = status === currentStatus && !isCompleted;

        return (
          <div key={status} className="flex gap-4 pb-6 last:pb-0 relative items-start">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0',
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-indigo-500 text-white'
                    : 'border-2 border-slate-300'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300" />
                )}
              </div>
              {index < statusOrder.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 h-full absolute top-8',
                    isCompleted ? 'bg-emerald-200' : 'bg-slate-200'
                  )}
                />
              )}
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm font-semibold text-slate-900">{status}</p>
              {historyEntry && (
                <div className="text-xs text-slate-500 mt-0.5">
                  {formatDateTime(historyEntry.changedAt)}
                  {historyEntry.changedBy?.name && ` by ${historyEntry.changedBy.name}`}
                  {historyEntry.note && <p className="text-slate-400 mt-0.5 italic">{historyEntry.note}</p>}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
