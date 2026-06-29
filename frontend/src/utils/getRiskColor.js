export function getRiskColor(score) {
  if (score >= 70) return { text: 'text-red-600', bg: 'bg-red-100', ring: 'text-red-500' };
  if (score >= 40) return { text: 'text-amber-600', bg: 'bg-amber-100', ring: 'text-amber-500' };
  return { text: 'text-emerald-600', bg: 'bg-emerald-100', ring: 'text-emerald-500' };
}

export function getStatusColor(status) {
  const colors = {
    'Open': 'bg-blue-100 text-blue-800',
    'Under Investigation': 'bg-amber-100 text-amber-800',
    'Assigned': 'bg-purple-100 text-purple-800',
    'Resolved': 'bg-emerald-100 text-emerald-800',
    'Closed': 'bg-slate-100 text-slate-600',
  };
  return colors[status] || 'bg-slate-100 text-slate-600';
}

export function getSeverityColor(severity) {
  const colors = {
    'Low': 'bg-emerald-100 text-emerald-800',
    'Medium': 'bg-amber-100 text-amber-800',
    'High': 'bg-orange-100 text-orange-800',
    'Critical': 'bg-red-100 text-red-800',
  };
  return colors[severity] || 'bg-slate-100 text-slate-600';
}

export function getPriorityColor(priority) {
  const colors = {
    'Low': 'bg-slate-100 text-slate-600',
    'Medium': 'bg-blue-100 text-blue-800',
    'High': 'bg-orange-100 text-orange-800',
    'Critical': 'bg-red-100 text-red-800',
  };
  return colors[priority] || 'bg-slate-100 text-slate-600';
}
