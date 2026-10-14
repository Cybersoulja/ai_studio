import React, { useState } from 'react';
import { Shield, Bug, Rocket, TestTube2, Users2, Sparkles, MessageSquareQuote, CheckCircle2, ChevronRight, RefreshCw, Zap } from 'lucide-react';
import { Commander, PlayerStats, Mission, Agent } from '../types';
import { playCosmicSound } from '../services/genesisEngine';

interface BridgeHUDProps {
  commander: Commander;
  stats: PlayerStats;
  missions: Mission[];
  agents: Agent[];
  currentQuote: string;
  onRefreshQuote: () => void;
  onOpenCheckin: () => void;
  onLogWork: (metric: keyof PlayerStats) => void;
  onSelectMission: (missionId: string) => void;
  onUpdateCallsign: (newCallsign: string) => void;
  onTriggerBriefing: () => void;
}

export const BridgeHUD: React.FC<BridgeHUDProps> = ({
  commander,
  stats,
  missions,
  agents,
  currentQuote,
  onRefreshQuote,
  onOpenCheckin,
  onLogWork,
  onSelectMission,
  onUpdateCallsign,
  onTriggerBriefing,
}) => {
  const [isEditingCallsign, setIsEditingCallsign] = useState(false);
  const [tempCallsign, setTempCallsign] = useState(commander.callsign);

  const topMission = missions[0];
  const xpPercent = Math.min(100, Math.round((commander.xp / commander.xp_to_next) * 100));

  // Determine unlock status from agents
  const nova = agents.find(a => a.id === 'nova');
  const orion = agents.find(a => a.id === 'orion');
  const vega = agents.find(a => a.id === 'vega');
  const zara = agents.find(a => a.id === 'zara');
  const atlas = agents.find(a => a.id === 'atlas');

  const telemetryItems = [
    {
      key: 'bugs_fixed' as keyof PlayerStats,
      label: 'Bugs Fixed',
      icon: Bug,
      value: stats.bugs_fixed,
      threshold: 5,
      agentName: 'Nova Starwind',
      isUnlocked: nova?.unlocked ?? false,
      desc: 'Powers Slingshot Refactor'
    },
    {
      key: 'deployments' as keyof PlayerStats,
      label: 'Deploys Verified',
      icon: Rocket,
      value: stats.deployments,
      threshold: 3,
      agentName: 'Orion Codex',
      isUnlocked: orion?.unlocked ?? false,
      desc: 'Powers Plasma Shield'
    },
    {
      key: 'tests_written' as keyof PlayerStats,
      label: 'Tests Written',
      icon: TestTube2,
      value: stats.tests_written,
      threshold: 10,
      agentName: 'Vega Quantum',
      isUnlocked: vega?.unlocked ?? false,
      desc: 'Powers Tachyon Scan'
    },
    {
      key: 'meetings_led' as keyof PlayerStats,
      label: 'Sprint Meetings',
      icon: Users2,
      value: stats.meetings_led,
      threshold: 2,
      agentName: 'Zara Nebula',
      isUnlocked: zara?.unlocked ?? false,
      desc: 'Powers Quantum Sync'
    },
    {
      key: 'weekly_deploys' as keyof PlayerStats,
      label: 'Weekly Deploys',
      icon: Zap,
      value: stats.weekly_deploys,
      threshold: 3,
      agentName: 'Atlas Comet',
      isUnlocked: atlas?.unlocked ?? false,
      desc: 'Powers Zero Downtime Warp'
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Alert */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-cyan-950/30 to-[#121626] border border-cyan-800/40 rounded-lg p-3 text-xs flex flex-wrap items-center justify-between gap-3 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
        <div className="flex items-center gap-2 text-cyan-300">
          <span className="text-base animate-bounce">🛰️</span>
          <span>
            <strong className="text-cyan-200">ORBITAL FLIGHT STATUS:</strong> Zero-gravity anti-gravity thrusters online. 
            All engineering signals mapped to Agent Genesis.
          </span>
        </div>
        <button
          onClick={onTriggerBriefing}
          className="text-xs px-2.5 py-1 bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-600/50 text-cyan-200 rounded transition-colors flex items-center gap-1.5"
        >
          <span>Run 09:00 Briefing</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dossier & Work Telemetry */}
        <div className="lg:col-span-5 space-y-6">
          {/* Commander Dossier Card */}
          <div className="bg-[#121626] border border-[#232b47] rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-[#232b47] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">👨‍🚀</span>
                <h2 className="text-sm font-bold text-amber-300 tracking-wider uppercase">
                  Commander Dossier
                </h2>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50 font-mono">
                Lvl {commander.level}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Callsign:</span>
                {isEditingCallsign ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={tempCallsign}
                      onChange={(e) => setTempCallsign(e.target.value)}
                      className="bg-[#0b0d17] border border-cyan-500 rounded px-1.5 py-0.5 text-xs text-amber-300 w-28 outline-none"
                    />
                    <button
                      onClick={() => {
                        onUpdateCallsign(tempCallsign);
                        setIsEditingCallsign(false);
                        playCosmicSound('beep');
                      }}
                      className="px-1.5 py-0.5 bg-cyan-800 hover:bg-cyan-700 rounded text-cyan-100 text-[10px]"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingCallsign(true)}
                    className="font-bold text-amber-300 hover:text-amber-200 underline decoration-dotted"
                    title="Click to change callsign"
                  >
                    {commander.callsign} ✎
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Rank:</span>
                <span className="text-emerald-400 font-semibold">{commander.rank}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Orbital Streak:</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <span>🔥</span>
                  <span>{commander.streak_days} Days Unbroken</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-cyan-300 font-medium">✨ {commander.status}</span>
              </div>

              {/* XP Progress Bar */}
              <div className="pt-2 border-t border-[#232b47]/60 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">XP Progress</span>
                  <span className="text-amber-300 font-bold font-mono">
                    {commander.xp} / {commander.xp_to_next} XP ({xpPercent}%)
                  </span>
                </div>
                <div className="h-3 w-full bg-[#0b0d17] rounded-full overflow-hidden border border-[#232b47] p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Work Telemetry Card (Fuel for Agent Genesis) */}
          <div className="bg-[#121626] border border-[#232b47] rounded-lg p-4">
            <div className="flex items-center justify-between border-b border-[#232b47] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <h2 className="text-sm font-bold text-amber-300 tracking-wider uppercase">
                  Work Telemetry
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">Fuel for Agent Genesis</span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Log completed work items below. Work automatically triggers dynamic agent genesis unlocks!
            </p>

            <div className="space-y-2.5">
              {telemetryItems.map((item) => {
                const Icon = item.icon;
                const progress = Math.min(100, Math.round((item.value / item.threshold) * 100));
                return (
                  <div
                    key={item.key}
                    className="p-2.5 bg-[#0b0d17] border border-[#232b47] rounded flex items-center justify-between gap-3 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded ${item.isUnlocked ? 'bg-cyan-950 text-cyan-300' : 'bg-slate-900 text-slate-500'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-200 truncate">{item.label}</span>
                          <span className="text-xs font-mono font-bold text-amber-300">
                            {item.value} / {item.threshold}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {item.isUnlocked ? (
                            <span className="text-emerald-400 font-medium">✓ {item.agentName} Active</span>
                          ) : (
                            <span>Needs {item.threshold - item.value} more for {item.agentName}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          playCosmicSound('beep');
                          onLogWork(item.key);
                        }}
                        className="px-2 py-1 rounded bg-[#1a2035] hover:bg-cyan-900/60 border border-[#232b47] hover:border-cyan-600 text-slate-200 hover:text-cyan-200 text-xs font-medium transition-all"
                        title={`Log 1 ${item.label}`}
                      >
                        +1 Log
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Floating Motivation & Priority Quest */}
        <div className="lg:col-span-7 space-y-6">
          {/* Trill Astro Buzz Floating Dispatch */}
          <div className="bg-[#121626] border border-[#232b47] rounded-lg p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-[#232b47] pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-lg animate-float">
                  🚀
                </div>
                <div>
                  <h2 className="text-sm font-bold text-cyan-300 tracking-wider">
                    TRILL ASTRO BUZZ FLOATING DISPATCH
                  </h2>
                  <p className="text-[11px] text-slate-400">First Officer • Zero-Gravity Motivation</p>
                </div>
              </div>

              <button
                onClick={() => {
                  playCosmicSound('beep');
                  onRefreshQuote();
                }}
                className="p-1.5 rounded bg-[#1a2035] hover:bg-cyan-900/40 border border-[#232b47] hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1 text-xs"
                title="Dispatch new motivation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Quote</span>
              </button>
            </div>

            {/* Quote Bubble */}
            <div className="relative bg-[#0b0d17] border border-cyan-900/40 rounded-lg p-4 mb-4">
              <MessageSquareQuote className="w-6 h-6 text-cyan-500/30 absolute top-3 right-3 pointer-events-none" />
              <p className="text-sm font-medium text-emerald-300 italic leading-relaxed pr-6">
                "{currentQuote}"
              </p>
              <div className="mt-2 text-right text-[11px] text-cyan-400 font-mono">
                — Trill Astro Buzz (T.A.B.)
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-[#0b0d17]/80 rounded border border-[#232b47]">
                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                  Active Superpower
                </div>
                <div className="font-semibold text-cyan-300">Cosmic Clutch</div>
                <div className="text-slate-400 text-[11px]">+10% XP multiplier on all closed PRs</div>
              </div>
              <div className="p-2.5 bg-[#0b0d17]/80 rounded border border-[#232b47]">
                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                  Crew Philosophy
                </div>
                <div className="font-semibold text-indigo-300">Zero-G Speed</div>
                <div className="text-slate-400 text-[11px]">Gravity is optional. Delivery is mandatory.</div>
              </div>
            </div>
          </div>

          {/* Priority Orbital Quest Card */}
          {topMission ? (
            <div className="bg-[#121626] border border-cyan-800/60 rounded-lg p-5 relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.08)]">
              <div className="flex items-center justify-between border-b border-[#232b47] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">🔥</span>
                  <h2 className="text-sm font-bold text-amber-300 tracking-wider uppercase">
                    Priority Orbital Quest
                  </h2>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-rose-950/80 text-rose-300 border border-rose-700/60 font-mono">
                  {topMission.priority}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                    <span>[{topMission.id}]</span>
                    <span className="text-slate-400">•</span>
                    <span>Category: {topMission.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 hover:text-cyan-300 transition-colors">
                    {topMission.title}
                  </h3>
                  {topMission.description && (
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {topMission.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-[#0b0d17] p-2 rounded border border-[#232b47]">
                    <div className="text-slate-400 text-[10px]">Status</div>
                    <div className="font-semibold text-emerald-400">{topMission.status}</div>
                  </div>
                  <div className="bg-[#0b0d17] p-2 rounded border border-[#232b47]">
                    <div className="text-slate-400 text-[10px]">Assigned Agent</div>
                    <div className="font-semibold text-cyan-300 truncate">{topMission.assigned_to}</div>
                  </div>
                  <div className="bg-[#0b0d17] p-2 rounded border border-[#232b47]">
                    <div className="text-slate-400 text-[10px]">Runtime</div>
                    <div className="font-semibold text-indigo-300">{topMission.runtime || 'Codex'}</div>
                  </div>
                  <div className="bg-[#0b0d17] p-2 rounded border border-[#232b47]">
                    <div className="text-slate-400 text-[10px]">Reward</div>
                    <div className="font-bold text-amber-400">+{topMission.xp} XP</div>
                  </div>
                </div>

                {/* Checkin Action CTA */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-400">
                    Ready to report completed work? Claim your XP boost below:
                  </span>
                  <button
                    onClick={() => {
                      playCosmicSound('beep');
                      onOpenCheckin();
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Initiate Mission Check-in</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#121626] border border-[#232b47] rounded-lg p-6 text-center text-slate-400 text-xs">
              No active orbital quests. Create a new mission to assign crew tasks!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
