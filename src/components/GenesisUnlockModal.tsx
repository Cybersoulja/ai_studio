import React from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { UnlockEvent } from '../services/genesisEngine';

interface GenesisUnlockModalProps {
  unlockEvent: UnlockEvent | null;
  onClose: () => void;
  onAcknowledge: (event: UnlockEvent) => void;
}

export const GenesisUnlockModal: React.FC<GenesisUnlockModalProps> = ({
  unlockEvent,
  onClose,
  onAcknowledge,
}) => {
  if (!unlockEvent) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-[#151c33] to-[#0d1020] border-2 border-cyan-400 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(6,182,212,0.3)] text-center space-y-5 animate-in zoom-in-95 duration-250">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-cyan-950 border border-cyan-400/80 flex items-center justify-center text-4xl shadow-inner animate-bounce">
          {unlockEvent.agentId === 'nova' && '🌠'}
          {unlockEvent.agentId === 'orion' && '🔭'}
          {unlockEvent.agentId === 'vega' && '🔬'}
          {unlockEvent.agentId === 'zara' && '🌌'}
          {unlockEvent.agentId === 'atlas' && '☄️'}
          {unlockEvent.agentId === 'buzz' && '🚀'}
        </div>

        <div>
          <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest mb-1 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DYNAMIC AGENT GENESIS COMPLETE</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-100 tracking-wide">
            {unlockEvent.agentName}
          </h2>
          <p className="text-sm font-semibold text-cyan-300 mt-2 font-mono">
            {unlockEvent.announcement}
          </p>
        </div>

        <div className="bg-[#0b0d17] border border-cyan-800/60 rounded-xl p-4 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Cosmic Superpower Unlocked:</span>
          </div>
          <p className="text-xs text-slate-200 font-mono">
            {unlockEvent.superpower}
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              onAcknowledge(unlockEvent);
              onClose();
            }}
            className="w-full py-3 rounded-xl font-black text-sm bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-500 hover:opacity-95 text-white shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <span>Welcome Aboard, {unlockEvent.agentName}! 🫡</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
