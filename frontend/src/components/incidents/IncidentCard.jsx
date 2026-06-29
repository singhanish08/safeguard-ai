import { useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import SeverityBadge from '../common/SeverityBadge';
import { formatDate } from '../../utils/formatDate';
import { CalendarDays, MapPin, Building2 } from 'lucide-react';

export default function IncidentCard({ incident }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/incidents/${incident._id}`)}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-900 line-clamp-1 flex-1">{incident.title}</h4>
        <div className="flex gap-2 ml-2 shrink-0">
          <StatusBadge status={incident.status} />
          <SeverityBadge severity={incident.aiAnalysis?.severityLevel} />
        </div>
      </div>
      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{incident.description}</p>
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{formatDate(incident.incidentDate)}</span>
        <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{incident.department?.name}</span>
        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{incident.location}</span>
      </div>
    </div>
  );
}
