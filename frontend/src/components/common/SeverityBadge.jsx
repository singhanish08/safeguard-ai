import { cn } from '../../utils/cn';
import { getSeverityColor } from '../../utils/getRiskColor';

export default function SeverityBadge({ severity }) {
  if (!severity) return null;
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getSeverityColor(severity))}>
      {severity}
    </span>
  );
}
