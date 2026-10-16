import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, RotateCcw, Sparkles, Plus, Trash2, ListChecks } from 'lucide-react';

export default function CareChecklist({ scanId, recommendedActions = [], treatment = [] }) {
  const storageKey = `plantcare_checklist_${scanId || 'temp'}`;

  // Combine actions into a clean list of tasks
  const defaultTasks = [
    ...recommendedActions.map((action) => ({ text: action, category: 'Cultural Control' })),
    ...treatment.map((treat) => ({ text: treat, category: 'Therapeutic Rx' })),
  ];

  const [completedIndices, setCompletedIndices] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customTasks, setCustomTasks] = useState(() => {
    try {
      const savedCustom = localStorage.getItem(`${storageKey}_custom`);
      return savedCustom ? JSON.parse(savedCustom) : [];
    } catch {
      return [];
    }
  });

  const [newNote, setNewNote] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completedIndices));
    } catch (e) {
      console.warn('Could not save checklist progress', e);
    }
  }, [completedIndices, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}_custom`, JSON.stringify(customTasks));
    } catch (e) {
      console.warn('Could not save custom tasks', e);
    }
  }, [customTasks, storageKey]);

  const allTasks = [
    ...defaultTasks,
    ...customTasks.map((text) => ({ text, category: 'Personal Log' })),
  ];

  const toggleTask = (index) => {
    setCompletedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleReset = () => {
    setCompletedIndices([]);
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setCustomTasks((prev) => [...prev, newNote.trim()]);
    setNewNote('');
    setShowAddInput(false);
  };

  const removeCustomTask = (customIdx) => {
    setCustomTasks((prev) => prev.filter((_, i) => i !== customIdx));
    // Re-adjust completed indices
    setCompletedIndices([]);
  };

  const total = allTasks.length;
  const completedCount = completedIndices.length;
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const isFinished = total > 0 && completedCount === total;

  return (
    <div
      className="card p-6"
      style={{
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        marginBottom: '1.5rem',
      }}
    >
      {/* ── Header & Progress Bar ────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(52, 211, 153, 0.1)' }}
          >
            <ListChecks className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-white">
              Interactive Recovery Checklist
            </h2>
            <p className="text-xs text-stone-400">
              Check off tasks as you care for your plant — progress saves automatically.
            </p>
          </div>
        </div>

        {completedCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1 transition-colors"
            title="Reset checklist"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Progress Track */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <span className="text-stone-300">
            {completedCount} of {total} Milestones Completed
          </span>
          <span className="text-emerald-400 font-mono font-bold">{percent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Celebration banner */}
      {isFinished && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 animate-pop">
          <Sparkles className="w-6 h-6 text-emerald-400 flex-shrink-0 animate-bounce-gentle" />
          <div>
            <h4 className="font-display font-bold text-sm text-emerald-300">
              All Protocol Milestones Completed!
            </h4>
            <p className="text-xs text-emerald-400/80">
              You’ve executed the immediate remediation plan. Monitor foliage over the next 5–7 days for new healthy growth.
            </p>
          </div>
        </div>
      )}

      {/* ── Task Items ───────────────────────────────────────────────────── */}
      <div className="space-y-2.5">
        {allTasks.map((task, idx) => {
          const isDone = completedIndices.includes(idx);
          const isCustom = idx >= defaultTasks.length;
          const customIdx = idx - defaultTasks.length;

          return (
            <div
              key={idx}
              onClick={() => toggleTask(idx)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/25 text-stone-400'
                  : 'bg-stone-900/60 border-stone-800/80 hover:border-emerald-500/30 text-stone-200'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 flex-shrink-0 text-emerald-400"
                aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20 animate-pop" />
                ) : (
                  <Circle className="w-5 h-5 text-stone-600 hover:text-emerald-400 transition-colors" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                      task.category === 'Cultural Control'
                        ? 'bg-blue-950/60 text-blue-400 border border-blue-900/40'
                        : task.category === 'Therapeutic Rx'
                        ? 'bg-teal-950/60 text-teal-400 border border-teal-900/40'
                        : 'bg-stone-800 text-stone-400 border border-stone-700/50'
                    }`}
                  >
                    {task.category}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${isDone ? 'line-through opacity-70' : ''}`}>
                  {task.text}
                </p>
              </div>

              {isCustom && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCustomTask(customIdx);
                  }}
                  className="text-stone-500 hover:text-red-400 p-1"
                  title="Remove note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Add Custom Step / Note ───────────────────────────────────────── */}
      <div className="mt-4 pt-3 border-t border-stone-800/60">
        {!showAddInput ? (
          <button
            type="button"
            onClick={() => setShowAddInput(true)}
            className="text-xs text-stone-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add custom care step or observation
          </button>
        ) : (
          <form onSubmit={handleAddCustom} className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="e.g., Sprayed neem oil on underside of leaves..."
              className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <button type="submit" className="btn-primary text-xs px-3 py-1.5 rounded-xl">
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddInput(false);
                setNewNote('');
              }}
              className="btn-secondary text-xs px-3 py-1.5 rounded-xl"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
