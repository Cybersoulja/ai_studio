import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Sparkles, X } from 'lucide-react';
import { playCosmicSound } from '../services/genesisEngine';

interface MissionCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimXP: (xp: number, summary: string) => void;
  defaultMissionTitle?: string;
}

export const MissionCheckinModal: React.FC<MissionCheckinModalProps> = ({
  isOpen,
  onClose,
  onClaimXP,
  defaultMissionTitle,
}) => {
  const [taskInput, setTaskInput] = useState(
    defaultMissionTitle ? `Completed: ${defaultMissionTitle}` : ''
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playCosmicSound('levelUp');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onClaimXP(110, taskInput || 'Engineering milestone completed');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-[#121626] border border-cyan-500/60 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-[#232b47] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛸</span>
            <h3 className="text-sm font-bold text-amber-300 tracking-wider uppercase">
              Mission Check-in & XP Boost
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Report completed engineering progress:
            </label>
            <textarea
              required
              rows={3}
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="e.g. Fixed OAuth token race condition, added edge unit tests, verified PR in staging..."
              className="w-full bg-[#0b0d17] border border-[#232b47] focus:border-cyan-400 rounded-lg p-3 text-slate-100 placeholder:text-slate-500 outline-none leading-relaxed font-mono"
            />
          </div>

          {/* Rewards Breakdown matching TUI */}
          <div className="bg-[#0b0d17] border border-[#232b47] rounded-lg p-4 space-y-2">
            <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-2 flex items-center justify-between">
              <span>Rewards Calculator</span>
              <span className="text-amber-400 font-mono">+110 XP Total</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-mono">
              <span>• Base Mission Reward:</span>
              <span>+75 XP</span>
            </div>
            <div className="flex justify-between text-amber-400 font-mono">
              <span>• Speed Velocity Bonus:</span>
              <span>+20 XP</span>
            </div>
            <div className="flex justify-between text-cyan-400 font-mono">
              <span>• Zero-G Floating Buff:</span>
              <span>+15 XP</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-400 text-[11px]">
              T.A.B. will verify delivery into orbit.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Claim 110 XP</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
