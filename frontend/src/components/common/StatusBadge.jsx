import { cn } from '../../utils/cn';
import { getStatusColor } from '../../utils/getRiskColor';

export default function StatusBadge({ status }) {
  if (!status) return null;
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(status))}>
      {status}
    </span>
  );
}
