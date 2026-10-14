import React, { useState, useEffect } from 'react';
import { Sparkles, X, AlertCircle } from 'lucide-react';
import { Mission, Agent } from '../types';
import { playCosmicSound } from '../services/genesisEngine';

interface NewMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: Agent[];
  onCreateMission: (mission: Mission) => void;
}

export const NewMissionModal: React.FC<NewMissionModalProps> = ({
  isOpen,
  onClose,
  agents,
  onCreateMission,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Mission['category']>('Bug');
  const [priority, setPriority] = useState<string>('🔥 Cosmic P1');
  const [assignedTo, setAssignedTo] = useState<string>('Nova Starwind');
  const [runtime, setRuntime] = useState<Mission['runtime']>('Codex');

  // Automatic crew recommendation based on category
  useEffect(() => {
    if (category === 'Bug') {
      setAssignedTo('Nova Starwind');
      setRuntime('Codex');
    } else if (category === 'DevOps') {
      setAssignedTo('Orion Codex');
      setRuntime('Codex');
    } else if (category === 'QA') {
      setAssignedTo('Vega Quantum');
      setRuntime('Codex');
    } else if (category === 'Project') {
      setAssignedTo('Zara Nebula');
      setRuntime('Craft');
    } else {
      setAssignedTo('Trill Astro Buzz');
      setRuntime('Local');
    }
  }, [category]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let xpReward = 80;
    if (priority.includes('P1')) xpReward = 110;
    else if (priority.includes('High')) xpReward = 90;
    else if (priority.includes('Standard')) xpReward = 75;

    const newMission: Mission = {
      id: `JIRA-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      xp: xpReward,
      assigned_to: assignedTo,
      status: 'Queued',
      runtime,
      jira_key: `PROJ-${Math.floor(100 + Math.random() * 900)}`
    };

    playCosmicSound('levelUp');
    onCreateMission(newMission);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-[#121626] border border-cyan-500/60 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#232b47] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h3 className="text-sm font-bold text-cyan-300 tracking-wider uppercase">
              Draft New Orbital Mission
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Mission Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Eliminate race condition in Redis pub/sub queue"
              className="w-full bg-[#0b0d17] border border-[#232b47] focus:border-cyan-400 rounded p-2 text-slate-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description / Acceptance Criteria</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, reproduction steps, or expected deliverable..."
              className="w-full bg-[#0b0d17] border border-[#232b47] focus:border-cyan-400 rounded p-2 text-slate-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#0b0d17] border border-[#232b47] rounded p-2 text-slate-100 outline-none"
              >
                <option value="Bug">Bug (Fix / Triage)</option>
                <option value="DevOps">DevOps (Deployment / Infra)</option>
                <option value="QA">QA (Tests / Tachyon Scan)</option>
                <option value="Project">Project (Sprint / Planning)</option>
                <option value="Feature">Feature (Rollout)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-[#0b0d17] border border-[#232b47] rounded p-2 text-slate-100 outline-none"
              >
                <option value="🔥 Cosmic P1">🔥 Cosmic P1 (+110 XP)</option>
                <option value="⚡ High Orbit">⚡ High Orbit (+90 XP)</option>
                <option value="🔬 Standard">🔬 Standard (+75 XP)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Assigned Agent</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-[#0b0d17] border border-[#232b47] rounded p-2 text-slate-100 outline-none"
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name} ({a.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Execution Runtime</label>
              <select
                value={runtime}
                onChange={(e) => setRuntime(e.target.value as any)}
                className="w-full bg-[#0b0d17] border border-[#232b47] rounded p-2 text-slate-100 outline-none"
              >
                <option value="Codex">Codex Adapter (Code & CI)</option>
                <option value="Jules">Jules Adapter (GitHub PRs)</option>
                <option value="Craft">Craft Adapter (Research & Docs)</option>
                <option value="Zapier">Zapier Adapter (Jira Sync)</option>
                <option value="Local">Local TUI Runner</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#232b47]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow"
            >
              Enqueue Mission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
