import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import SeverityBadge from '../common/SeverityBadge';
import { formatDate } from '../../utils/formatDate';
import { getRiskColor } from '../../utils/getRiskColor';
import { cn } from '../../utils/cn';

export default function IncidentTable({ incidents = [], showReporter = true }) {
  const navigate = useNavigate();

  if (incidents.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b-2 border-slate-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">#</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Title</th>
            {showReporter && <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Reporter</th>}
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Department</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Priority</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Severity</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Risk</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((inc, idx) => (
            <tr key={inc._id} className="border-b border-slate-100 hover:bg-indigo-50/30 transition-colors cursor-pointer" onClick={() => navigate(`/incidents/${inc._id}`)}>
              <td className="px-6 py-4 text-sm text-slate-400">{idx + 1}</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900 max-w-[200px] truncate">{inc.title}</td>
              {showReporter && <td className="px-6 py-4 text-sm text-slate-700">{inc.reporter?.name || '—'}</td>}
              <td className="px-6 py-4 text-sm text-slate-700">{inc.department?.name || '—'}</td>
              <td className="px-6 py-4 text-sm">
                <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', {
                  'bg-red-100 text-red-800': inc.priority === 'Critical',
                  'bg-orange-100 text-orange-800': inc.priority === 'High',
                  'bg-blue-100 text-blue-800': inc.priority === 'Medium',
                  'bg-slate-100 text-slate-600': inc.priority === 'Low',
                })}>
                  {inc.priority}
                </span>
              </td>
              <td className="px-6 py-4 text-sm"><SeverityBadge severity={inc.aiAnalysis?.severityLevel} /></td>
              <td className="px-6 py-4 text-sm">
                <span className={cn('text-xs font-semibold', getRiskColor(inc.aiAnalysis?.riskScore).text)}>
                  {inc.aiAnalysis?.riskScore ?? '—'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm"><StatusBadge status={inc.status} /></td>
              <td className="px-6 py-4 text-sm text-slate-500">{formatDate(inc.incidentDate)}</td>
              <td className="px-6 py-4 text-sm text-right">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/incidents/${inc._id}`); }}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
