import React, { useState } from 'react';
import { Package, Sparkles, Gift, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { InventoryItem, Agent } from '../types';
import { playCosmicSound } from '../services/genesisEngine';

interface CargoBayProps {
  inventory: InventoryItem[];
  agents: Agent[];
  onUseItem: (itemName: string, targetAgentId?: string) => void;
  onOpenSupplyCrate: () => void;
}

export const CargoBay: React.FC<CargoBayProps> = ({
  inventory,
  agents,
  onUseItem,
  onOpenSupplyCrate,
}) => {
  const [selectedItemName, setSelectedItemName] = useState<string | null>(null);
  const [targetAgentId, setTargetAgentId] = useState<string>(agents[0]?.id || 'buzz');

  const selectedItem = inventory.find((i) => i.name === selectedItemName);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232b47] pb-4">
        <div>
          <h2 className="text-base font-bold text-cyan-300 tracking-wider flex items-center gap-2">
            <span>💎</span>
            <span>CARGO BAY & ZERO-G LOOT INVENTORY</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Loot dropped from successful PR merges and sprint completions. Consume items to refuel crew and boost velocity.
          </p>
        </div>

        <button
          onClick={() => {
            playCosmicSound('warp');
            onOpenSupplyCrate();
          }}
          className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white rounded font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Gift className="w-4 h-4" />
          <span>Open Orbital Supply Crate</span>
        </button>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {inventory.map((item) => (
          <div
            key={item.name}
            className="bg-[#121626] border border-[#232b47] hover:border-cyan-600/60 rounded-lg p-5 flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl p-2 bg-[#0b0d17] border border-[#232b47] rounded-xl group-hover:scale-110 transition-transform">
                  {item.icon || '📦'}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  x{item.count}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#232b47]">
              <button
                disabled={item.count <= 0}
                onClick={() => {
                  playCosmicSound('beep');
                  if (item.name === 'Quantum Coffee') {
                    setSelectedItemName(item.name);
                  } else {
                    onUseItem(item.name);
                  }
                }}
                className={`w-full py-2 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  item.count > 0
                    ? 'bg-[#1a2035] hover:bg-cyan-950 border border-[#232b47] hover:border-cyan-500 text-cyan-200'
                    : 'bg-slate-900 border-[#232b47] text-slate-600 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{item.count > 0 ? 'Use Item' : 'Depleted'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coffee Targeting Modal if selecting coffee */}
      {selectedItemName === 'Quantum Coffee' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#121626] border border-cyan-500/60 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#232b47] pb-3">
              <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <span>☕</span>
                <span>Select Crew Member for Quantum Coffee</span>
              </h3>
              <button
                onClick={() => setSelectedItemName(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Restores <strong>+25% Energy Reserves</strong>. Which active crew member needs the dark matter boost?
            </p>

            <div className="space-y-2">
              {agents.filter(a => a.unlocked).map((agent) => (
                <label
                  key={agent.id}
                  className={`flex items-center justify-between p-2.5 rounded border cursor-pointer transition-colors ${
                    targetAgentId === agent.id
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200'
                      : 'bg-[#0b0d17] border-[#232b47] hover:bg-[#151a2d] text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="agent_target"
                      checked={targetAgentId === agent.id}
                      onChange={() => setTargetAgentId(agent.id)}
                      className="accent-cyan-400"
                    />
                    <span className="text-xs font-semibold">{agent.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Energy: {agent.energy}%
                  </span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#232b47]">
              <button
                onClick={() => setSelectedItemName(null)}
                className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  playCosmicSound('coffee');
                  onUseItem('Quantum Coffee', targetAgentId);
                  setSelectedItemName(null);
                }}
                className="px-4 py-1.5 rounded text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow"
              >
                Drink Coffee (+25% Energy)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
