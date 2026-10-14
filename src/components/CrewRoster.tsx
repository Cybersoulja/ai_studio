import React, { useState } from 'react';
import { Shield, Sparkles, Coffee, BookOpen, Lock, CheckCircle2, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import { Agent, InventoryItem } from '../types';
import { playCosmicSound } from '../services/genesisEngine';

interface CrewRosterProps {
  agents: Agent[];
  inventory: InventoryItem[];
  onUseItemOnAgent: (agentId: string, itemName: string) => void;
  onDeploySuperpower: (agent: Agent) => void;
  onViewSkillDoc: (agentId: string) => void;
  onToggleAgentLock?: (agentId: string) => void;
}

export const CrewRoster: React.FC<CrewRosterProps> = ({
  agents,
  inventory,
  onUseItemOnAgent,
  onDeploySuperpower,
  onViewSkillDoc,
  onToggleAgentLock,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || 'buzz');

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];
  const coffeeItem = inventory.find((i) => i.name === 'Quantum Coffee');
  const coffeeCount = coffeeItem?.count || 0;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232b47] pb-4">
        <div>
          <h2 className="text-base font-bold text-cyan-300 tracking-wider flex items-center gap-2">
            <span>🪐</span>
            <span>CREW ROSTER & DYNAMIC CHARACTER GENESIS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Agents emerge dynamically from actual engineering work. Review stats, unlock tiers, and activate cosmic superpowers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-[#121626] border border-[#232b47] text-slate-300">
            Active Crew: <strong className="text-emerald-400">{agents.filter(a => a.unlocked).length}</strong> / {agents.length}
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-950/40 border border-amber-800/60 text-amber-300 flex items-center gap-1.5">
            <span>☕</span>
            <span>Coffee Reserves: {coffeeCount}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Agent List Cards */}
        <div className="lg:col-span-5 space-y-3">
          {agents.map((agent) => {
            const isSelected = agent.id === selectedAgentId;
            return (
              <div
                key={agent.id}
                onClick={() => {
                  setSelectedAgentId(agent.id);
                  playCosmicSound('beep');
                }}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#1a2035] border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-[#121626] border-[#232b47] hover:border-slate-600 hover:bg-[#151a2d]'
                } ${!agent.unlocked ? 'opacity-70' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0b0d17] border border-[#232b47] flex items-center justify-center text-xl shrink-0">
                      {agent.id === 'buzz' && '🚀'}
                      {agent.id === 'nova' && '🌠'}
                      {agent.id === 'orion' && '🔭'}
                      {agent.id === 'vega' && '🔬'}
                      {agent.id === 'zara' && '🌌'}
                      {agent.id === 'atlas' && '☄️'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-100">{agent.name}</span>
                        {!agent.unlocked && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/80 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" />
                            Locked
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        {agent.role} • <span className="text-amber-400">{agent.rank}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs text-amber-300 font-mono">{agent.stars}</div>
                    <div className="text-[10px] text-cyan-400 font-mono">Lvl {agent.level}</div>
                  </div>
                </div>

                {agent.unlocked ? (
                  <div className="mt-3 pt-2.5 border-t border-[#232b47]/70 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400">Energy: </span>
                      <span className="text-emerald-400 font-mono font-bold">{agent.energy}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Loyalty: </span>
                      <span className="text-indigo-400 font-mono font-bold">{agent.loyalty}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-[11px] text-amber-400/90 font-mono">
                    Unlock: {agent.unlockRequirement}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Holographic Dossier */}
        <div className="lg:col-span-7">
          {selectedAgent ? (
            <div className="bg-[#121626] border border-[#232b47] rounded-lg p-6 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

              {/* Title Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#232b47] pb-4 mb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-xl bg-[#0b0d17] border-2 border-cyan-500/40 flex items-center justify-center text-3xl shadow-inner">
                    {selectedAgent.id === 'buzz' && '🚀'}
                    {selectedAgent.id === 'nova' && '🌠'}
                    {selectedAgent.id === 'orion' && '🔭'}
                    {selectedAgent.id === 'vega' && '🔬'}
                    {selectedAgent.id === 'zara' && '🌌'}
                    {selectedAgent.id === 'atlas' && '☄️'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-100">{selectedAgent.name}</h3>
                      {selectedAgent.unlocked ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-700/60 font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Locked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-cyan-300 font-mono mt-0.5">
                      {selectedAgent.role} • Title: {selectedAgent.title}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-amber-400 font-mono">{selectedAgent.rank}</div>
                  <div className="text-xs text-amber-300 tracking-wider">{selectedAgent.stars}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">Total XP: {selectedAgent.xp}</div>
                </div>
              </div>

              {/* Unlock Requirement Notice if locked */}
              {!selectedAgent.unlocked && (
                <div className="mb-5 p-3 rounded-lg bg-rose-950/30 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">AGENT LOCKED IN HYPERSLEEP:</span> Requires completing work telemetry:{' '}
                    <strong className="text-amber-300 font-mono">{selectedAgent.unlockRequirement}</strong>. Log work from the Bridge HUD or Missions tab to awaken!
                  </div>
                </div>
              )}

              {/* Stats Meters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {/* Energy */}
                <div className="bg-[#0b0d17] p-3.5 rounded border border-[#232b47]">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400">Energy Reserves</span>
                    <span className="text-emerald-400 font-mono font-bold">{selectedAgent.energy}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#121626] rounded-full overflow-hidden border border-[#232b47]">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-300"
                      style={{ width: `${selectedAgent.energy}%` }}
                    />
                  </div>
                </div>

                {/* Loyalty */}
                <div className="bg-[#0b0d17] p-3.5 rounded border border-[#232b47]">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400">Loyalty Synchronization</span>
                    <span className="text-indigo-400 font-mono font-bold">{selectedAgent.loyalty}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#121626] rounded-full overflow-hidden border border-[#232b47]">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${selectedAgent.loyalty}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Evolution Stage & Catchphrase */}
              <div className="space-y-4 mb-6 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-[#0b0d17] rounded border border-[#232b47]">
                  <span className="text-slate-400">Evolutionary Stage:</span>
                  <span className="text-amber-300 font-bold font-mono px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/40">
                    ✨ {selectedAgent.stage}
                  </span>
                </div>

                <div className="p-3 bg-[#0b0d17] rounded border border-[#232b47]">
                  <div className="text-slate-400 text-[11px] mb-1">Agent Catchphrase:</div>
                  <p className="text-slate-200 italic font-mono">
                    "{selectedAgent.catchphrase}"
                  </p>
                </div>

                <div className="p-3.5 bg-gradient-to-r from-cyan-950/40 to-indigo-950/30 rounded border border-cyan-800/50">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold mb-1">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Cosmic Superpower</span>
                  </div>
                  <p className="text-slate-200 font-mono text-xs">
                    {selectedAgent.power}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#232b47]">
                <button
                  disabled={!selectedAgent.unlocked || selectedAgent.energy < 10}
                  onClick={() => {
                    playCosmicSound('warp');
                    onDeploySuperpower(selectedAgent);
                  }}
                  className={`px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedAgent.unlocked && selectedAgent.energy >= 10
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Deploy Superpower</span>
                </button>

                <button
                  disabled={!selectedAgent.unlocked || coffeeCount <= 0 || selectedAgent.energy >= 100}
                  onClick={() => {
                    playCosmicSound('coffee');
                    onUseItemOnAgent(selectedAgent.id, 'Quantum Coffee');
                  }}
                  className={`px-3 py-2 rounded text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                    selectedAgent.unlocked && coffeeCount > 0 && selectedAgent.energy < 100
                      ? 'bg-amber-950/60 hover:bg-amber-900/80 border-amber-700 text-amber-200'
                      : 'bg-slate-900 border-[#232b47] text-slate-500 cursor-not-allowed'
                  }`}
                  title={coffeeCount <= 0 ? 'No Quantum Coffee in inventory' : 'Restore +25% Energy'}
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Give Coffee (+25% Energy)</span>
                </button>

                <button
                  onClick={() => {
                    playCosmicSound('beep');
                    onViewSkillDoc(selectedAgent.id);
                  }}
                  className="px-3 py-2 rounded text-xs font-medium bg-[#0b0d17] hover:bg-[#151a2d] border border-[#232b47] text-slate-300 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Skill Spec</span>
                </button>

                {onToggleAgentLock && (
                  <button
                    onClick={() => {
                      playCosmicSound('beep');
                      onToggleAgentLock(selectedAgent.id);
                    }}
                    className="ml-auto text-[11px] text-slate-400 hover:text-amber-300 underline font-mono"
                    title="Developer testing toggle"
                  >
                    [Dev: Toggle Lock]
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#121626] border border-[#232b47] rounded-lg p-8 text-center text-slate-400 text-xs">
              Select an agent from the roster to inspect their dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
