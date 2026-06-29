export default function StatCard({ label, value, icon: Icon, color = 'indigo' }) {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
  };
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${colorMap[color] || colorMap.indigo}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        <div className="min-w-0"><div className="text-2xl font-bold tracking-tight text-slate-950">{value ?? 0}</div><div className="mt-0.5 truncate text-sm font-medium text-slate-500">{label}</div></div>
      </div>
    </div>
  );
}
