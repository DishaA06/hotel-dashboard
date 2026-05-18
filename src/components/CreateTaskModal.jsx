// src/components/CreateTaskModal.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ROOMS = Array.from({ length: 30 }, (_, i) => {
  const floor = Math.floor(i / 10) + 1;
  const num = (i % 10) + 1;
  return `${floor}0${num}`;
});

export default function CreateTaskModal({ onClose, onCreate }) {
  const { profile } = useAuth();
  const [form, setForm] = useState({
    title: '',
    type: 'Housekeeping',
    room: '101',
    priority: 'Normal',
    assignedTo: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    await onCreate({
      ...form,
      createdBy: profile?.name || 'Staff',
    });
    setSubmitting(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-white font-sans font-medium">New Task</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
              placeholder="e.g. Clean room, Fix AC, Replace towels"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-colors"
            />
          </div>

          {/* Type + Room */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors appearance-none"
              >
                <option>Housekeeping</option>
                <option>Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-1.5">Room</label>
              <select
                value={form.room}
                onChange={(e) => set('room', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors appearance-none"
              >
                {ROOMS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
                <option value="Common Area">Common Area</option>
                <option value="Lobby">Lobby</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Pool">Pool</option>
              </select>
            </div>
          </div>

          {/* Priority + Assigned To */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-1.5">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => set('priority', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors appearance-none"
              >
                <option>Low</option>
                <option>Normal</option>
                <option>Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-1.5">Assign To</label>
              <input
                type="text"
                value={form.assignedTo}
                onChange={(e) => set('assignedTo', e.target.value)}
                placeholder="Staff name"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={2}
              placeholder="Optional details…"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 text-sm font-sans hover:border-slate-600 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !form.title.trim()}
              className="flex-1 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 text-sm font-sans font-semibold transition-colors"
            >
              {submitting ? 'Creating…' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
