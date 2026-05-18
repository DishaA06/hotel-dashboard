// src/components/StatsBar.jsx
export default function StatsBar({ tasks }) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const urgent = tasks.filter((t) => t.priority === 'Urgent' && t.status !== 'Completed').length;

  const stats = [
    { label: 'Total Tasks', value: total, color: 'text-white' },
    { label: 'Pending', value: pending, color: 'text-amber-400' },
    { label: 'In Progress', value: inProgress, color: 'text-blue-400' },
    { label: 'Completed', value: completed, color: 'text-emerald-400' },
    { label: 'Urgent', value: urgent, color: 'text-red-400' },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <div className={`text-2xl font-display font-semibold ${s.color}`}>{s.value}</div>
          <div className="text-slate-500 text-xs font-mono mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
