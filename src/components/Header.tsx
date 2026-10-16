import React from 'react';
import { Rocket, Users, ClipboardList, Package, Radio, Terminal, Sparkles, CheckCircle2, Volume2, VolumeX, Gamepad2 } from 'lucide-react';
import { Commander } from '../types';
import { CUSTOM_STATUSES } from '../data/initialData';
import { playCosmicSound } from '../services/genesisEngine';

interface HeaderProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  commander: Commander;
  isAmbientPlaying?: boolean;
  onToggleAmbient?: () => void;
  onUpdateStatus: (status: string) => void;
  onOpenCheckin: () => void;
  onOpenNewMission: () => void;
  onTriggerBriefing: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  commander,
  isAmbientPlaying = false,
  onToggleAmbient,
  onUpdateStatus,
  onOpenCheckin,
  onOpenNewMission,
  onTriggerBriefing,
}) => {
  const tabs = [
    { id: 0, label: 'BRIDGE / HUD', icon: Rocket },
    { id: 1, label: 'CREW ROSTER', icon: Users },
    { id: 2, label: 'MISSIONS', icon: ClipboardList },
    { id: 3, label: 'CARGO BAY', icon: Package },
    { id: 4, label: 'DISPATCHES & STORY', icon: Radio },
    { id: 5, label: 'OPERATIONS GATEWAY', icon: Terminal },
    { id: 6, label: 'INK RPG LAYER', icon: Gamepad2 },
  ];

  const currentStatusObj = CUSTOM_STATUSES.find(s => s.label === commander.status) || CUSTOM_STATUSES[1];

  return (
    <header className="border-b border-[#232b47] bg-[#0b0d17]/95 backdrop-blur sticky top-0 z-40">
      {/* Top Banner */}
      <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-[#232b47]/60 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold tracking-wider text-cyan-400">
            <span className="text-base animate-pulse">🛸</span>
            <span>USS HUSTLE COMMAND CENTER</span>
            <span className="hidden sm:inline text-xs text-indigo-400 font-normal">
              — SPACE AGE HUSTLE (Anti-Gravity v1.0)
            </span>
          </div>
          <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            Zero-G Field: 100% Nominal
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Selector */}
          <div className="flex items-center gap-1.5 bg-[#121626] border border-[#232b47] rounded px-2 py-1 text-xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentStatusObj.color }}
            />
            <select
              value={commander.status}
              onChange={(e) => {
                onUpdateStatus(e.target.value);
                playCosmicSound('beep');
              }}
              className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
            >
              {CUSTOM_STATUSES.map((st) => (
                <option key={st.id} value={st.label} className="bg-[#121626] text-slate-200">
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Action: Space Station Ambient Soundscape Toggle */}
          {onToggleAmbient && (
            <button
              onClick={() => {
                onToggleAmbient();
                playCosmicSound('beep');
              }}
              className={`px-2.5 py-1 rounded text-xs border transition-all flex items-center gap-1.5 ${
                isAmbientPlaying
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-[#121626] hover:bg-[#1a2035] border-[#232b47] text-slate-400 hover:text-slate-200'
              }`}
              title={isAmbientPlaying ? 'Mute Space Station Ambient Soundscape' : 'Play Space Station Ambient Soundscape'}
            >
              {isAmbientPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="hidden sm:inline font-mono text-[11px] font-semibold text-cyan-300">Station Hum</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline font-mono text-[11px]">Station Hum</span>
                </>
              )}
            </button>
          )}

          {/* Quick Action: Morning Briefing */}
          <button
            onClick={() => {
              playCosmicSound('warp');
              onTriggerBriefing();
            }}
            className="px-2.5 py-1 rounded text-xs bg-indigo-900/50 hover:bg-indigo-800/60 border border-indigo-700/60 text-indigo-200 transition-colors flex items-center gap-1"
            title="Trigger 09:00 Morning Briefing"
          >
            <span>🌅</span>
            <span className="hidden sm:inline">Briefing</span>
          </button>

          {/* Quick Action: Check-in */}
          <button
            onClick={() => {
              playCosmicSound('beep');
              onOpenCheckin();
            }}
            className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/80 text-emerald-300 transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Check-in (+110 XP)</span>
          </button>

          {/* Quick Action: New Mission */}
          <button
            onClick={() => {
              playCosmicSound('beep');
              onOpenNewMission();
            }}
            className="px-2.5 py-1 rounded text-xs font-semibold bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-600/80 text-cyan-200 transition-all flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Mission</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="px-4 flex overflow-x-auto no-scrollbar gap-1 pt-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                playCosmicSound('beep');
              }}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#121626]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>[{tab.id + 1}] {tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
