import React, { useState } from 'react';
import { Plus, Filter, CheckCircle2, Clock, Play, Sparkles, AlertCircle, ArrowUpRight, ShieldCheck, Tag } from 'lucide-react';
import { Mission, Agent } from '../types';
import { playCosmicSound } from '../services/genesisEngine';

interface MissionsViewProps {
  missions: Mission[];
  agents: Agent[];
  onOpenNewMission: () => void;
  onOpenCheckin: (mission?: Mission) => void;
  onCompleteMission: (missionId: string) => void;
  onAdvanceMissionStatus: (missionId: string) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  missions,
  agents,
  onOpenNewMission,
  onOpenCheckin,
  onCompleteMission,
  onAdvanceMissionStatus,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  const categories = ['All', 'Bug', 'DevOps', 'QA', 'Project', 'Feature'];

  const filteredMissions = missions.filter((m) => {
    if (selectedCategory !== 'All' && m.category !== selectedCategory) return false;
    if (selectedPriority !== 'All' && !m.priority.includes(selectedPriority)) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232b47] pb-4">
        <div>
          <h2 className="text-base font-bold text-cyan-300 tracking-wider flex items-center gap-2">
            <span>📋</span>
            <span>ACTIVE ORBITAL MISSIONS & TASK BROKER</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Jira & GitHub engineering tasks routed through agent advisors and execution runtimes (Codex, Jules, Craft, Zapier).
          </p>
        </div>

        <button
          onClick={() => {
            playCosmicSound('beep');
            onOpenNewMission();
          }}
          className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Orbital Mission</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-[#121626] p-2.5 rounded-lg border border-[#232b47]">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <span className="text-slate-400 font-medium px-2 py-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2035]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Total:</span>
          <span className="text-amber-300 font-mono font-bold">{filteredMissions.length}</span>
        </div>
      </div>

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMissions.map((mission) => {
          const isCompleted = mission.status === 'Completed';
          const isP1 = mission.priority.includes('P1');

          return (
            <div
              key={mission.id}
              className={`bg-[#121626] border rounded-lg p-5 flex flex-col justify-between transition-all ${
                isCompleted
                  ? 'border-emerald-800/40 bg-emerald-950/10 opacity-80'
                  : isP1
                  ? 'border-rose-700/60 shadow-[0_0_15px_rgba(244,63,94,0.08)]'
                  : 'border-[#232b47] hover:border-slate-600'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-cyan-400 font-bold bg-[#0b0d17] px-2 py-0.5 rounded border border-[#232b47]">
                      {mission.id}
                    </span>
                    <span className="text-slate-400">{mission.category}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                      isP1
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                        : 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/60'
                    }`}
                  >
                    {mission.priority}
                  </span>
                </div>

                {/* Title */}
                <h3 className={`text-sm font-bold mt-2 ${isCompleted ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                  {mission.title}
                </h3>

                {mission.description && (
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {mission.description}
                  </p>
                )}

                {/* Metadata tags */}
                <div className="mt-4 pt-3 border-t border-[#232b47]/80 grid grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="bg-[#0b0d17] p-1.5 rounded">
                    <div className="text-slate-500 text-[10px]">Navigator</div>
                    <div className="text-cyan-300 font-medium truncate">{mission.assigned_to}</div>
                  </div>
                  <div className="bg-[#0b0d17] p-1.5 rounded">
                    <div className="text-slate-500 text-[10px]">Runtime</div>
                    <div className="text-indigo-300 font-medium truncate">{mission.runtime || 'Codex'}</div>
                  </div>
                  <div className="bg-[#0b0d17] p-1.5 rounded">
                    <div className="text-slate-500 text-[10px]">Reward</div>
                    <div className="text-amber-400 font-bold">+{mission.xp} XP</div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-[#232b47] flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-400'
                        : mission.status.includes('Orbit')
                        ? 'bg-cyan-400 animate-pulse'
                        : 'bg-amber-400'
                    }`}
                  />
                  <span className="text-slate-300 font-medium">{mission.status}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {!isCompleted && (
                    <>
                      {mission.status === 'Queued' ? (
                        <button
                          onClick={() => {
                            playCosmicSound('warp');
                            onAdvanceMissionStatus(mission.id);
                          }}
                          className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-200 rounded font-medium transition-colors flex items-center gap-1"
                          title="Launch into orbit"
                        >
                          <Play className="w-3 h-3" />
                          <span>Launch</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            playCosmicSound('beep');
                            onOpenCheckin(mission);
                          }}
                          className="px-2.5 py-1 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/60 text-amber-200 rounded font-medium transition-colors flex items-center gap-1"
                        >
                          <Clock className="w-3 h-3" />
                          <span>Check-in</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          playCosmicSound('levelUp');
                          onCompleteMission(mission.id);
                        }}
                        className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300 rounded font-bold transition-colors flex items-center gap-1 shadow-sm"
                        title="Complete mission & claim rewards"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Complete</span>
                      </button>
                    </>
                  )}

                  {isCompleted && (
                    <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>XP Banked</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMissions.length === 0 && (
        <div className="bg-[#121626] border border-[#232b47] rounded-lg p-10 text-center text-slate-400 text-xs">
          No missions match this category. Click "+ New Orbital Mission" to create one.
        </div>
      )}
    </div>
  );
};
