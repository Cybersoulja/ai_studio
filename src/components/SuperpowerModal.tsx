import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Zap, CheckCircle2, X, Terminal, Cpu } from 'lucide-react';
import { Agent } from '../types';
import { playCosmicSound } from '../services/genesisEngine';

interface SuperpowerModalProps {
  agent: Agent | null;
  onClose: () => void;
  onSuperpowerApplied: (agentId: string, xpBonus: number) => void;
}

export const SuperpowerModal: React.FC<SuperpowerModalProps> = ({
  agent,
  onClose,
  onSuperpowerApplied,
}) => {
  const [stage, setStage] = useState<'charging' | 'executing' | 'complete'>('charging');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!agent) return;
    setStage('charging');
    setLogs([`⚡ Initializing ${agent.power}...`, `Aligning neural weights for ${agent.name}...`]);

    const timer1 = setTimeout(() => {
      setStage('executing');
      playCosmicSound('warp');
      if (agent.id === 'nova') {
        setLogs(prev => [
          ...prev,
          'Scanning codebase for cyclomatic complexity > 15...',
          'Found monolithic router (412 LOC). Splitting into functional pipelines...',
          'Refactoring complete! Complexity reduced by 64%. Clean syntax achieved.'
        ]);
      } else if (agent.id === 'orion') {
        setLogs(prev => [
          ...prev,
          'Connecting to Cloudflare Workers edge nodes...',
          'Verifying D1 SQLite schema integrity and replica sync...',
          'Plasma Shield status: 100% active. Zero downtime guaranteed.'
        ]);
      } else if (agent.id === 'vega') {
        setLogs(prev => [
          ...prev,
          'Engaging Tachyon wavelength scan on API endpoints...',
          'Discovered 2 race conditions in webhook token validation!',
          'Generated 8 automated test fixtures to guard against regressions.'
        ]);
      } else if (agent.id === 'zara') {
        setLogs(prev => [
          ...prev,
          'Querying Notion Story Nodes Matrix & Jira backlog...',
          'Rebalancing sprint velocity based on team capacity...',
          'Quantum Sync locked. All orbital milestones prioritized.'
        ]);
      } else if (agent.id === 'atlas') {
        setLogs(prev => [
          ...prev,
          'Executing zero-downtime blue-green cutover across all clusters...',
          'Routing 100% production traffic to new deployment...',
          'Zero drop, zero errors, warp speed achieved.'
        ]);
      } else {
        setLogs(prev => [
          ...prev,
          'Broadcasting Cosmic Clutch frequency to all fleet commanders...',
          '"Gravity is optional. Delivery is mandatory."',
          '+10% XP motivation buff engaged for 24 hours.'
        ]);
      }
    }, 1200);

    const timer2 = setTimeout(() => {
      setStage('complete');
      playCosmicSound('levelUp');
      confetti({ particleCount: 60, spread: 60 });
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [agent]);

  if (!agent) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-[#121626] border border-cyan-500/70 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#232b47] pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="text-sm font-bold text-amber-300 tracking-wider uppercase">
              {agent.power}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Simulation Terminal */}
        <div className="bg-[#0b0d17] border border-[#232b47] rounded-lg p-4 font-mono text-xs text-slate-300 min-h-[160px] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-cyan-400 border-b border-[#232b47]/60 pb-1.5 mb-2">
            <span>[SUPERPOWER HARNESS ENGINE]</span>
            <span>Status: {stage.toUpperCase()}</span>
          </div>

          {logs.map((log, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-cyan-500 shrink-0">›</span>
              <span className={i === logs.length - 1 ? 'text-emerald-300 font-semibold' : 'text-slate-300'}>
                {log}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {stage === 'complete' ? '✨ Superpower successfully executed.' : 'Harnessing zero-g cosmic energy...'}
          </span>
          <button
            disabled={stage !== 'complete'}
            onClick={() => {
              onSuperpowerApplied(agent.id, agent.id === 'nova' ? 25 : 15);
              onClose();
            }}
            className={`px-4 py-2 rounded font-bold text-xs transition-all ${
              stage === 'complete'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Claim {agent.id === 'nova' ? '+25 XP' : '+15 XP'} Boost
          </button>
        </div>
      </div>
    </div>
  );
};
