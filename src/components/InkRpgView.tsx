import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Play,
  RotateCcw,
  Sparkles,
  Save,
  Download,
  Code2,
  ChevronRight,
  Gift,
  Zap,
  Terminal,
  Volume2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import {
  INK_SCENARIOS,
  InkStoryEngine,
  InkDialogueEntry,
  InkChoiceItem,
  InkStoryEvent
} from '../services/inkStoryService';
import { playCosmicSound } from '../services/genesisEngine';

interface InkRpgViewProps {
  onClaimXP: (xp: number, summary: string) => void;
  onAddItem: (itemName: string) => void;
}

export const InkRpgView: React.FC<InkRpgViewProps> = ({
  onClaimXP,
  onAddItem,
}) => {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('mission1');
  const [engine, setEngine] = useState<InkStoryEngine | null>(null);

  // Story transcript & choices
  const [dialogueHistory, setDialogueHistory] = useState<InkDialogueEntry[]>([]);
  const [currentChoices, setCurrentChoices] = useState<InkChoiceItem[]>([]);
  const [isStoryEnded, setIsStoryEnded] = useState<boolean>(false);
  const [activeSpeaker, setActiveSpeaker] = useState<string>('Trill Astro Buzz');

  // Session stats
  const [sessionXpEarned, setSessionXpEarned] = useState<number>(0);
  const [sessionItems, setSessionItems] = useState<string[]>([]);
  const [savedCheckpoint, setSavedCheckpoint] = useState<string | null>(null);

  // Custom Ink script sandbox
  const [showScriptEditor, setShowScriptEditor] = useState<boolean>(false);
  const [customInkText, setCustomInkText] = useState<string>(INK_SCENARIOS.mission1.inkScript);

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Initialize selected scenario
  useEffect(() => {
    const scenario = (INK_SCENARIOS as any)[selectedScenarioKey] || INK_SCENARIOS.mission1;
    initStory(scenario.inkScript);
  }, [selectedScenarioKey]);

  // Scroll to bottom of story log
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogueHistory, currentChoices]);

  const initStory = (inkScript: string) => {
    const newEngine = new InkStoryEngine(inkScript);
    setEngine(newEngine);
    setDialogueHistory([]);
    setCurrentChoices([]);
    setIsStoryEnded(false);
    setSessionXpEarned(0);
    setSessionItems([]);

    advanceStory(newEngine, []);
  };

  const advanceStory = (
    activeEngine: InkStoryEngine,
    currentHistory: InkDialogueEntry[]
  ) => {
    const newEntries: InkDialogueEntry[] = [...currentHistory];
    let latestSpeaker = activeSpeaker;

    while (activeEngine.canContinue()) {
      const step = activeEngine.continueStory();
      if (!step || !step.text) continue;

      const speaker = step.event?.speaker || latestSpeaker || 'Narrator';
      latestSpeaker = speaker;
      setActiveSpeaker(speaker);

      // Handle tags / sound / rewards
      if (step.event?.sound) {
        playCosmicSound(step.event.sound);
      }
      if (step.event?.xp) {
        const xpAmount = step.event.xp;
        onClaimXP(xpAmount, `Ink RPG: ${speaker} milestone`);
        setSessionXpEarned((prev) => prev + xpAmount);
      }
      if (step.event?.item) {
        const itemName = step.event.item;
        onAddItem(itemName);
        setSessionItems((prev) => [...prev, itemName]);
        confetti({ particleCount: 50, spread: 60 });
      }

      newEntries.push({
        id: `dialogue-${Date.now()}-${Math.random()}`,
        speaker,
        text: step.text,
        tags: step.tags,
        event: step.event
      });
    }

    setDialogueHistory(newEntries);

    const choices = activeEngine.getChoices();
    setCurrentChoices(choices);
    if (choices.length === 0 && !activeEngine.canContinue()) {
      setIsStoryEnded(true);
    }
  };

  const handleMakeChoice = (choiceIndex: number, choiceText: string) => {
    if (!engine) return;

    playCosmicSound('beep');

    // Add player's choice to dialogue history
    const updatedHistory: InkDialogueEntry[] = [
      ...dialogueHistory,
      {
        id: `choice-${Date.now()}`,
        speaker: 'Commander',
        text: choiceText,
        tags: ['choice'],
        choicesMade: choiceText
      }
    ];

    engine.chooseChoice(choiceIndex);
    advanceStory(engine, updatedHistory);
  };

  const handleRestart = () => {
    playCosmicSound('beep');
    const scenario = (INK_SCENARIOS as any)[selectedScenarioKey] || INK_SCENARIOS.mission1;
    initStory(showScriptEditor ? customInkText : scenario.inkScript);
  };

  const handleSaveState = () => {
    if (!engine) return;
    const jsonState = engine.saveState();
    setSavedCheckpoint(jsonState);
    playCosmicSound('levelUp');
  };

  const handleLoadState = () => {
    if (!engine || !savedCheckpoint) return;
    engine.loadState(savedCheckpoint);
    playCosmicSound('warp');
    advanceStory(engine, dialogueHistory);
  };

  const handleApplyCustomScript = () => {
    playCosmicSound('warp');
    initStory(customInkText);
  };

  // Keyboard shortcut for choice selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= currentChoices.length) {
        const choice = currentChoices[num - 1];
        if (choice) {
          handleMakeChoice(choice.index, choice.text);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChoices, engine]);

  const getSpeakerStyles = (speaker: string) => {
    switch (speaker) {
      case 'Trill Astro Buzz':
        return {
          icon: '🚀',
          badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-700',
          bubbleBg: 'bg-[#0f1424] border-cyan-800/60'
        };
      case 'Nova Starwind':
        return {
          icon: '🌠',
          badgeColor: 'bg-purple-950 text-purple-300 border-purple-700',
          bubbleBg: 'bg-[#140e24] border-purple-800/60'
        };
      case 'Orion Codex':
        return {
          icon: '🔭',
          badgeColor: 'bg-blue-950 text-blue-300 border-blue-700',
          bubbleBg: 'bg-[#0e1728] border-blue-800/60'
        };
      case 'Vega Quantum':
        return {
          icon: '🔬',
          badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-700',
          bubbleBg: 'bg-[#0a1816] border-emerald-800/60'
        };
      case 'Zara Nebula':
        return {
          icon: '🌌',
          badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-700',
          bubbleBg: 'bg-[#121128] border-indigo-800/60'
        };
      case 'Atlas Comet':
        return {
          icon: '☄️',
          badgeColor: 'bg-amber-950 text-amber-300 border-amber-700',
          bubbleBg: 'bg-[#1a140d] border-amber-800/60'
        };
      case 'Commander':
        return {
          icon: '👨‍🚀',
          badgeColor: 'bg-amber-950 text-amber-200 border-amber-600',
          bubbleBg: 'bg-cyan-950/70 border-cyan-500/80 text-cyan-100'
        };
      default:
        return {
          icon: '📡',
          badgeColor: 'bg-slate-900 text-slate-300 border-slate-700',
          bubbleBg: 'bg-[#0b0d17] border-[#232b47]'
        };
    }
  };

  const currentSpeakerStyle = getSpeakerStyles(activeSpeaker);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Scenario Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#232b47] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎮</span>
            <h2 className="text-base font-bold text-cyan-300 tracking-wider">
              INK.JS BRANCHING RPG LAYER — HOLO-SIMULATOR
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold">
              Ink v21 Engine Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Full-fidelity narrative engine powered by Inkle’s ink.js. Dialogue choices branch storylines, trigger Web Audio synth SFX, grant Commander XP, and drop real inventory loot.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRestart}
            className="px-2.5 py-1.5 rounded bg-[#121626] hover:bg-[#1a2035] border border-[#232b47] text-slate-300 hover:text-slate-100 text-xs font-mono transition-colors flex items-center gap-1"
            title="Restart simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>

          <button
            onClick={handleSaveState}
            className="px-2.5 py-1.5 rounded bg-[#121626] hover:bg-[#1a2035] border border-[#232b47] text-slate-300 hover:text-slate-100 text-xs font-mono transition-colors flex items-center gap-1"
            title="Save story snapshot"
          >
            <Save className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save State</span>
          </button>

          {savedCheckpoint && (
            <button
              onClick={handleLoadState}
              className="px-2.5 py-1.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-mono transition-colors flex items-center gap-1"
              title="Restore saved story state"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Load State</span>
            </button>
          )}

          <button
            onClick={() => setShowScriptEditor(!showScriptEditor)}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors flex items-center gap-1.5 ${
              showScriptEditor
                ? 'bg-amber-950 text-amber-300 border border-amber-600 font-bold'
                : 'bg-[#121626] hover:bg-[#1a2035] border border-[#232b47] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{showScriptEditor ? 'Hide Ink Script' : 'Ink Script Studio'}</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-slate-400 mr-1">Expedition Scenario:</span>
        {Object.entries(INK_SCENARIOS).map(([key, scn]) => (
          <button
            key={key}
            onClick={() => {
              playCosmicSound('beep');
              setSelectedScenarioKey(key);
            }}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              selectedScenarioKey === key
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-[#121626] border-[#232b47] text-slate-400 hover:text-slate-200 hover:bg-[#181e33]'
            }`}
          >
            {scn.title}
          </button>
        ))}
      </div>

      {/* Script Editor Sandbox Drawer */}
      {showScriptEditor && (
        <div className="bg-[#121626] border border-amber-500/60 rounded-xl p-4 space-y-3 animate-in fade-in duration-200 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#232b47] pb-2">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                Ink Language Source Editor & Live Compiler
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Syntax: === knot ===, * [Choice] -&gt; target, # speaker: Name, # sound: beep/warp, # xp: 50, # item: Name
            </span>
          </div>

          <textarea
            rows={8}
            value={customInkText}
            onChange={(e) => setCustomInkText(e.target.value)}
            className="w-full bg-[#0b0d17] border border-[#232b47] focus:border-cyan-400 rounded-lg p-3 font-mono text-xs text-cyan-200 outline-none leading-relaxed"
          />

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => {
                const scn = (INK_SCENARIOS as any)[selectedScenarioKey];
                setCustomInkText(scn.inkScript);
              }}
              className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200"
            >
              Reset to Scenario Default
            </button>
            <button
              onClick={handleApplyCustomScript}
              className="px-4 py-1.5 rounded bg-gradient-to-r from-amber-600 to-cyan-600 hover:opacity-90 text-white font-bold text-xs font-mono shadow"
            >
              Compile & Run Custom Ink Story
            </button>
          </div>
        </div>
      )}

      {/* Main Terminal Holo-deck Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Holo-deck Speaker Dossier & Telemetry */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Speaker Hologram Card */}
          <div className="bg-[#121626] border border-[#232b47] rounded-xl p-5 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-2">
              Holo-Sim Transceiver
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-14 h-14 rounded-xl bg-[#0b0d17] border-2 border-cyan-400/80 flex items-center justify-center text-3xl shadow-inner animate-float shrink-0">
                {currentSpeakerStyle.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 font-mono">
                  {activeSpeaker}
                </h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded border font-mono font-semibold inline-block mt-1 ${currentSpeakerStyle.badgeColor}`}
                >
                  Active Interlocutor
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono pt-3 border-t border-[#232b47]">
              <div className="flex justify-between text-slate-400">
                <span>Simulation Protocol:</span>
                <span className="text-emerald-400 font-bold">Ink Engine v21</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Session XP Earned:</span>
                <span className="text-amber-400 font-bold">+{sessionXpEarned} XP</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Items Unlocked:</span>
                <span className="text-cyan-300 font-bold">
                  {sessionItems.length > 0 ? sessionItems.join(', ') : 'None yet'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Choice Controls Info */}
          <div className="bg-[#121626] border border-[#232b47] rounded-xl p-4 text-xs font-mono space-y-2 text-slate-400">
            <div className="text-slate-200 font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Keyboard Short-Hustle</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Press numeric keys <strong className="text-cyan-300">[1]</strong>, <strong className="text-cyan-300">[2]</strong>, <strong className="text-cyan-300">[3]</strong> on your keyboard to rapidly pick branching responses without touching your mouse.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Story Terminal & Choices */}
        <div className="lg:col-span-8 bg-[#121626] border border-cyan-800/60 rounded-xl p-5 md:p-6 flex flex-col justify-between min-h-[520px] shadow-2xl relative overflow-hidden">
          {/* Transcript Log */}
          <div className="space-y-4 overflow-y-auto max-h-[380px] pr-2 pb-2">
            {dialogueHistory.map((entry) => {
              const isCommander = entry.speaker === 'Commander';
              const style = getSpeakerStyles(entry.speaker);

              return (
                <div
                  key={entry.id}
                  className={`flex flex-col ${isCommander ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-mono mb-1 text-slate-400">
                    <span>{style.icon}</span>
                    <span className="font-bold text-slate-300">{entry.speaker}</span>
                    {entry.event?.xp && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                        +{entry.event.xp} XP
                      </span>
                    )}
                    {entry.event?.item && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold flex items-center gap-1">
                        <Gift className="w-2.5 h-2.5" />
                        {entry.event.item}
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-3.5 rounded-xl text-xs md:text-sm leading-relaxed max-w-[90%] font-mono border ${style.bubbleBg} ${
                      isCommander ? 'rounded-tr-none' : 'rounded-tl-none'
                    }`}
                  >
                    {entry.text}
                  </div>
                </div>
              );
            })}

            <div ref={transcriptEndRef} />
          </div>

          {/* Branching Choices Action Tray */}
          <div className="mt-5 pt-4 border-t border-[#232b47] space-y-3">
            {!isStoryEnded ? (
              <>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>Commander's Tactical Orders:</span>
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Pick an action to branch the story
                  </span>
                </div>

                <div className="space-y-2">
                  {currentChoices.map((choice, idx) => (
                    <button
                      key={choice.index}
                      onClick={() => handleMakeChoice(choice.index, choice.text)}
                      className="w-full text-left p-3 rounded-lg bg-[#0b0d17] hover:bg-cyan-950/70 border border-[#232b47] hover:border-cyan-400 text-slate-200 hover:text-cyan-100 text-xs md:text-sm font-mono transition-all flex items-center justify-between group shadow-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded bg-[#1a2035] group-hover:bg-cyan-900 border border-[#232b47] group-hover:border-cyan-500 flex items-center justify-center text-[11px] font-bold text-amber-300 shrink-0">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{choice.text}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-4 bg-emerald-950/40 border border-emerald-700/60 rounded-xl text-center space-y-2">
                <div className="text-emerald-300 font-bold font-mono text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>EXPEDITION COMPLETED</span>
                </div>
                <p className="text-xs text-slate-300 font-mono">
                  All narrative knots resolved. Session rewards successfully synchronized to your flight dossier.
                </p>
                <div className="pt-2 flex justify-center gap-2 font-mono">
                  <button
                    onClick={handleRestart}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Run Simulation Again</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
