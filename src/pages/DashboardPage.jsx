// src/pages/DashboardPage.jsx
import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import StatsBar from '../components/StatsBar';
import CreateTaskModal from '../components/CreateTaskModal';

const FILTERS = ['All', 'Pending', 'In Progress', 'Completed'];
const TYPE_FILTERS = ['All Types', 'Housekeeping', 'Maintenance'];

export default function DashboardPage() {
  const { profile, logout } = useAuth();
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();

  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  const isAdmin = profile?.role === 'admin';

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter !== 'All' && t.status !== statusFilter) return false;
      if (typeFilter !== 'All Types' && t.type !== typeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.title?.toLowerCase().includes(q) ||
          t.room?.toLowerCase().includes(q) ||
          t.assignedTo?.toLowerCase().includes(q) ||
          t.notes?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tasks, statusFilter, typeFilter, searchQuery]);

  const urgentTasks = filtered.filter((t) => t.priority === 'Urgent' && t.status !== 'Completed');
  const regularTasks = filtered.filter((t) => t.priority !== 'Urgent' || t.status === 'Completed');

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d1424" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span className="font-display text-lg text-white">StayOps</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm font-medium leading-none">{profile?.name || 'Staff'}</p>
              <p className="text-slate-500 text-xs font-mono mt-0.5 capitalize">{profile?.role || 'staff'}</p>
            </div>
            <button
              onClick={logout}
              className="text-slate-500 hover:text-white text-xs font-mono py-1.5 px-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-pulse h-16" />
            ))}
          </div>
        ) : (
          <StatsBar tasks={tasks} />
        )}

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, rooms, staff…"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-slate-600 transition-colors"
            />
          </div>

          {/* Status filter */}
          <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                  statusFilter === f
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                  typeFilter === f
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {f === 'All Types' ? 'All' : f}
              </button>
            ))}
          </div>

          {/* Create button — all roles can create for MVP simplicity */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-sans font-semibold px-4 py-2 rounded-lg transition-colors flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Task
          </button>
        </div>

        {/* Task list */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-pulse h-36" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
            </div>
            <p className="text-slate-400 text-sm">No tasks found</p>
            <p className="text-slate-600 text-xs mt-1">Try adjusting your filters or create a new task</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Urgent */}
            {urgentTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  <h3 className="text-red-400 text-xs font-mono uppercase tracking-wider">Urgent</h3>
                  <span className="text-red-400/50 text-xs font-mono">({urgentTasks.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {urgentTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular tasks */}
            {regularTasks.length > 0 && (
              <div>
                {urgentTasks.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-slate-500 text-xs font-mono uppercase tracking-wider">Other Tasks</h3>
                    <span className="text-slate-700 text-xs font-mono">({regularTasks.length})</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {regularTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onCreate={createTask}
        />
      )}
    </div>
  );
}
