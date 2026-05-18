// src/components/TaskCard.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  Pending: {
    label: 'Pending',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
    dot: 'bg-amber-400',
  },
  'In Progress': {
    label: 'In Progress',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
    dot: 'bg-blue-400',
  },
  Completed: {
    label: 'Completed',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/20',
    dot: 'bg-emerald-400',
  },
};

const TYPE_ICONS = {
  Housekeeping: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Maintenance: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
};

const STATUSES = ['Pending', 'In Progress', 'Completed'];

export default function TaskCard({ task, onUpdate, onDelete }) {
  const { profile } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.Pending;
  const isAdmin = profile?.role === 'admin';
  const canChangeStatus = true; // all roles can update status

  async function handleStatusChange(newStatus) {
    setUpdating(true);
    await onUpdate(task.id, { status: newStatus });
    setUpdating(false);
  }

  async function handleDelete() {
    await onDelete(task.id);
  }

  const formattedDate = task.createdAt?.toDate
    ? task.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '—';

  const nextStatus = STATUSES[(STATUSES.indexOf(task.status) + 1) % STATUSES.length];

  return (
    <div className={`bg-slate-900 border rounded-xl p-4 transition-all ${task.status === 'Completed' ? 'border-slate-800 opacity-75' : 'border-slate-800 hover:border-slate-700'}`}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono font-medium flex-shrink-0 ${task.type === 'Housekeeping' ? 'bg-violet-500/15 text-violet-400' : 'bg-orange-500/15 text-orange-400'}`}>
            {TYPE_ICONS[task.type] || TYPE_ICONS.Housekeeping}
          </span>
          <span className="text-white font-sans font-medium text-sm truncate">{task.title}</span>
        </div>

        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
        <span className="text-slate-400 text-xs font-mono">
          Room <span className="text-slate-200">{task.room}</span>
        </span>
        {task.assignedTo && (
          <span className="text-slate-400 text-xs font-mono">
            → <span className="text-slate-200">{task.assignedTo}</span>
          </span>
        )}
        <span className="text-slate-600 text-xs font-mono">{formattedDate}</span>
      </div>

      {task.notes && (
        <p className="text-slate-400 text-xs mb-3 leading-relaxed border-l border-slate-700 pl-3">
          {task.notes}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
        {task.status !== 'Completed' && (
          <button
            onClick={() => handleStatusChange(nextStatus)}
            disabled={updating}
            className="flex-1 text-xs font-mono py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          >
            {updating ? '…' : `Mark ${nextStatus}`}
          </button>
        )}

        {task.status === 'Completed' && (
          <button
            onClick={() => handleStatusChange('Pending')}
            disabled={updating}
            className="flex-1 text-xs font-mono py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors disabled:opacity-50"
          >
            Reopen
          </button>
        )}

        {isAdmin && !showDeleteConfirm && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs font-mono py-1.5 px-3 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors"
          >
            Delete
          </button>
        )}

        {isAdmin && showDeleteConfirm && (
          <>
            <button onClick={handleDelete} className="text-xs font-mono py-1.5 px-3 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors">
              Confirm
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="text-xs font-mono py-1.5 px-3 rounded-lg text-slate-500 hover:text-slate-300 transition-colors">
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
