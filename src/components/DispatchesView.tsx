import React, { useState } from 'react';
import { Radio, MessageSquare, Copy, Check, Sparkles, BookOpen, ChevronRight, Send, ArrowRight } from 'lucide-react';
import { Dispatch, StoryNode } from '../types';
import { STORY_NODES } from '../data/initialData';
import { playCosmicSound } from '../services/genesisEngine';

interface DispatchesViewProps {
  dispatches: Dispatch[];
  onAddDispatch: (dispatch: Dispatch) => void;
  onStoryChoiceMade?: (node: StoryNode, choice: string) => void;
}

export const DispatchesView: React.FC<DispatchesViewProps> = ({
  dispatches,
  onAddDispatch,
  onStoryChoiceMade,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'transmissions' | 'story'>('transmissions');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New transmission draft state
  const [isComposing, setIsComposing] = useState(false);
  const [draftHeadline, setDraftHeadline] = useState('');
  const [draftSummary, setDraftSummary] = useState('');
  const [draftWhyItMatters, setDraftWhyItMatters] = useState('');
  const [draftTrillsTake, setDraftTrillsTake] = useState('');
  const [draftSource, setDraftSource] = useState('');

  // Story runner state
  const [currentNodeIndex, setCurrentNodeIndex] = useState<number>(0);
  const [dialogueHistory, setDialogueHistory] = useState<Array<{ speaker: string; text: string; choiceMade?: string }>>([
    {
      speaker: STORY_NODES[0].speaker,
      text: STORY_NODES[0].text
    }
  ]);

  const currentNode = STORY_NODES[currentNodeIndex] || STORY_NODES[0];

  const handleCopy = (d: Dispatch, index: number) => {
    const formatted = `🚀 TRILL ASTRO BUZZ TRANSMISSION\n\n${d.headline}\n\n${d.summary}\n\n🧠 Why it matters:\n${d.whyItMatters || 'Essential zero-gravity engineering momentum.'}\n\n🛰️ Trill's Take:\n${d.trillsTake || 'Stay sharp and keep shipping.'}\n\n🔗 Source:\n${d.source}`;
    navigator.clipboard.writeText(formatted);
    setCopiedId(String(index));
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePublishTransmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftHeadline.trim() || !draftSummary.trim()) return;

    const newDispatch: Dispatch = {
      id: `disp-${Date.now()}`,
      headline: draftHeadline.trim(),
      date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      summary: draftSummary.trim(),
      whyItMatters: draftWhyItMatters.trim() || 'Accelerates cosmic engineering velocity across the USS Hustle fleet.',
      trillsTake: draftTrillsTake.trim() || "The grind never stops, Commander. Gravity is optional.",
      source: draftSource.trim() || 'USS Hustle Command Fleet'
    };

    onAddDispatch(newDispatch);
    setDraftHeadline('');
    setDraftSummary('');
    setDraftWhyItMatters('');
    setDraftTrillsTake('');
    setDraftSource('');
    setIsComposing(false);
    playCosmicSound('warp');
  };

  const handleStoryChoice = (choice: string) => {
    playCosmicSound('beep');
    setDialogueHistory((prev) => [
      ...prev,
      { speaker: 'Commander', text: choice, choiceMade: choice }
    ]);

    // Advance story node
    const nextIdx = (currentNodeIndex + 1) % STORY_NODES.length;
    setCurrentNodeIndex(nextIdx);

    const nextNode = STORY_NODES[nextIdx];
    setTimeout(() => {
      setDialogueHistory((prev) => [
        ...prev,
        { speaker: nextNode.speaker, text: nextNode.text }
      ]);
      playCosmicSound('levelUp');
      if (onStoryChoiceMade) {
        onStoryChoiceMade(currentNode, choice);
      }
    }, 400);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Sub tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232b47] pb-4">
        <div>
          <h2 className="text-base font-bold text-cyan-300 tracking-wider flex items-center gap-2">
            <span>📡</span>
            <span>TRANSMISSIONS & NOTION STORY MATRIX</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Canonical dispatches by First Officer Trill Astro Buzz and 15-node interactive narrative matrix.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#121626] border border-[#232b47] rounded p-1 text-xs">
            <button
              onClick={() => setActiveSubTab('transmissions')}
              className={`px-3 py-1 rounded transition-colors ${
                activeSubTab === 'transmissions'
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dispatches Log
            </button>
            <button
              onClick={() => setActiveSubTab('story')}
              className={`px-3 py-1 rounded transition-colors ${
                activeSubTab === 'story'
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Story Nodes Matrix (15 Nodes)
            </button>
          </div>

          {activeSubTab === 'transmissions' && (
            <button
              onClick={() => setIsComposing(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Compose</span>
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'transmissions' && (
        <div className="space-y-4">
          {dispatches.map((d, index) => (
            <div
              key={d.id || index}
              className="bg-[#121626] border border-[#232b47] rounded-lg p-5 relative overflow-hidden group hover:border-cyan-600/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#232b47]/80 pb-3 mb-3">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-amber-400 font-bold">🚀 TRILL ASTRO BUZZ TRANSMISSION</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-cyan-400">{d.date}</span>
                </div>

                <button
                  onClick={() => handleCopy(d, index)}
                  className="px-2 py-1 rounded bg-[#0b0d17] hover:bg-[#1a2035] border border-[#232b47] text-slate-300 text-xs flex items-center gap-1 transition-colors"
                  title="Copy standard transmission format"
                >
                  {copiedId === String(index) ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Copy Format</span>
                    </>
                  )}
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-100 mb-2">
                {d.headline}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {d.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
                <div className="p-3 bg-[#0b0d17] rounded border border-[#232b47]">
                  <div className="text-indigo-400 font-bold mb-1 flex items-center gap-1">
                    <span>🧠</span>
                    <span>Why it matters:</span>
                  </div>
                  <p className="text-slate-300">
                    {d.whyItMatters || 'Keeps zero-gravity momentum moving forward.'}
                  </p>
                </div>

                <div className="p-3 bg-[#0b0d17] rounded border border-[#232b47]">
                  <div className="text-amber-400 font-bold mb-1 flex items-center gap-1">
                    <span>🛰️</span>
                    <span>Trill's Take:</span>
                  </div>
                  <p className="text-emerald-300 italic">
                    "{d.trillsTake || 'The galaxy favors the bold.'}"
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <span>🔗 Source:</span>
                <span className="text-cyan-400 truncate">{d.source}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Story Nodes Matrix Subtab */}
      {activeSubTab === 'story' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Dialogue Matrix Transcript */}
          <div className="lg:col-span-8 bg-[#121626] border border-[#232b47] rounded-lg p-5 flex flex-col justify-between min-h-[460px]">
            <div className="flex items-center justify-between border-b border-[#232b47] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-200">
                  Interactive Story Nodes Matrix ({currentNode.id})
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-[#0b0d17] px-2 py-0.5 rounded border border-[#232b47]">
                Trigger: {currentNode.trigger}
              </span>
            </div>

            {/* Message log */}
            <div className="space-y-3 overflow-y-auto max-h-80 pr-2">
              {dialogueHistory.map((item, idx) => {
                const isCommander = item.speaker === 'Commander';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isCommander ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-slate-400 mb-0.5 font-mono">
                      {item.speaker}
                    </div>
                    <div
                      className={`p-3 rounded-lg text-xs leading-relaxed max-w-[85%] ${
                        isCommander
                          ? 'bg-cyan-950/80 border border-cyan-700/60 text-cyan-100 rounded-br-none'
                          : 'bg-[#0b0d17] border border-[#232b47] text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {item.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current Choices */}
            <div className="mt-5 pt-4 border-t border-[#232b47] space-y-2">
              <div className="text-xs font-bold text-amber-300 font-mono">
                Commander's Response ({currentNode.speaker} awaits orders):
              </div>
              <div className="flex flex-wrap gap-2">
                {currentNode.choices.map((choice, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => handleStoryChoice(choice)}
                    className="px-3.5 py-2 rounded bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-200 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow"
                  >
                    <span>{choice}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Node Index Matrix */}
          <div className="lg:col-span-4 bg-[#121626] border border-[#232b47] rounded-lg p-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Story Nodes Matrix (15 Nodes)
            </h3>
            <div className="space-y-1.5 overflow-y-auto max-h-[420px] pr-1">
              {STORY_NODES.map((node, nIdx) => {
                const isActive = nIdx === currentNodeIndex;
                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      setCurrentNodeIndex(nIdx);
                      setDialogueHistory(prev => [
                        ...prev,
                        { speaker: node.speaker, text: node.text }
                      ]);
                      playCosmicSound('beep');
                    }}
                    className={`p-2 rounded border text-xs cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200'
                        : 'bg-[#0b0d17] border-[#232b47] hover:bg-[#1a2035] text-slate-400'
                    }`}
                  >
                    <div className="flex justify-between items-center font-mono text-[11px]">
                      <span className="font-bold text-amber-300">{node.id}</span>
                      <span className="text-[10px] text-slate-500">{node.trigger}</span>
                    </div>
                    <div className="truncate text-slate-300 font-medium mt-0.5">
                      {node.speaker}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Compose Transmission Modal */}
      {isComposing && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#121626] border border-cyan-500/60 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#232b47] pb-3">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <span>🚀</span>
                <span>COMPOSE TRILL ASTRO BUZZ TRANSMISSION</span>
              </h3>
              <button
                onClick={() => setIsComposing(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishTransmission} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zero-Gravity CI/CD Pipeline Deployed"
                  value={draftHeadline}
                  onChange={(e) => setDraftHeadline(e.target.value)}
                  className="w-full bg-[#0b0d17] border border-[#232b47] focus:border-cyan-400 rounded p-2 text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Summary (2-4 sentences)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain the technical milestone or orbital progress..."
                  value={draftSummary}
                  onChange={(e) => setDraftSummary(e.target.value)}
                  className="w-full bg-[#0b0d17] border border-[#232b47] focus:border-cyan-400 rounded p-2 text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">🧠 Why it matters</label>
                <input
                  type="text"
                  placeholder="Why this unlocks engineering velocity..."
                  value={draftWhyItMatters}
                  onChange={(e) => setDraftWhyItMatters(e.target.value)}
                  className="w-full bg-[#0b0d17] border border-[#232b47] focus:border-cyan-400 rounded p-2 text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">🛰️ Trill's Take</label>
                <input
                  type="text"
                  placeholder="Humorous or sharp astronaut observation..."
                  value={draftTrillsTake}
                  onChange={(e) => setDraftTrillsTake(e.target.value)}
                  className="w-full bg-[#0b0d17] border border-[#232b47] focus:border-cyan-400 rounded p-2 text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">🔗 Source link or file</label>
                <input
                  type="text"
                  placeholder="e.g. https://github.com/cybersoulja/uss-hustle"
                  value={draftSource}
                  onChange={(e) => setDraftSource(e.target.value)}
                  className="w-full bg-[#0b0d17] border border-[#232b47] focus:border-cyan-400 rounded p-2 text-slate-200 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#232b47]">
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="px-3 py-1.5 rounded text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow"
                >
                  Publish Transmission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
