import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BridgeHUD } from './components/BridgeHUD';
import { CrewRoster } from './components/CrewRoster';
import { MissionsView } from './components/MissionsView';
import { CargoBay } from './components/CargoBay';
import { DispatchesView } from './components/DispatchesView';
import { OperationsGateway } from './components/OperationsGateway';
import { MissionCheckinModal } from './components/MissionCheckinModal';
import { NewMissionModal } from './components/NewMissionModal';
import { GenesisUnlockModal } from './components/GenesisUnlockModal';
import { SuperpowerModal } from './components/SuperpowerModal';
import { SkillDocModal } from './components/SkillDocModal';
import { InkRpgView } from './components/InkRpgView';
import { Commander, PlayerStats, Agent, Mission, InventoryItem, Dispatch, DailyXpRecord } from './types';
import {
  INITIAL_COMMANDER,
  INITIAL_STATS,
  INITIAL_AGENTS,
  INITIAL_MISSIONS,
  INITIAL_INVENTORY,
  INITIAL_DISPATCHES,
  INITIAL_XP_HISTORY,
  BUZZ_MOTIVATIONAL_QUOTES
} from './data/initialData';
import {
  evaluateAgentGenesis,
  addXP,
  playCosmicSound,
  UnlockEvent
} from './services/genesisEngine';
import { spaceStationAudio } from './services/ambientAudio';

const STORAGE_KEY = 'uss_hustle_state_v1';

export const App: React.FC = () => {
  // Navigation
  const [activeTab, setActiveTab] = useState<number>(0);

  // Core Game State with LocalStorage persistence
  const [commander, setCommander] = useState<Commander>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_commander`);
      return saved ? JSON.parse(saved) : INITIAL_COMMANDER;
    } catch {
      return INITIAL_COMMANDER;
    }
  });

  const [stats, setStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_stats`);
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  const [agents, setAgents] = useState<Agent[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_agents`);
      return saved ? JSON.parse(saved) : INITIAL_AGENTS;
    } catch {
      return INITIAL_AGENTS;
    }
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_missions`);
      return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
    } catch {
      return INITIAL_MISSIONS;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_inventory`);
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  const [dispatches, setDispatches] = useState<Dispatch[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_dispatches`);
      return saved ? JSON.parse(saved) : INITIAL_DISPATCHES;
    } catch {
      return INITIAL_DISPATCHES;
    }
  });

  const [xpHistory, setXpHistory] = useState<DailyXpRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_xp_history`);
      return saved ? JSON.parse(saved) : INITIAL_XP_HISTORY;
    } catch {
      return INITIAL_XP_HISTORY;
    }
  });

  // Dynamic UI States
  const [statusBanner, setStatusBanner] = useState<string>(
    '⚡ Zero-Gravity Anti-Gravity Field: 100% | All Systems Nominal'
  );
  const [currentQuote, setCurrentQuote] = useState<string>(
    BUZZ_MOTIVATIONAL_QUOTES[0]
  );

  // Ambient Space Station Soundscape Player State
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);
  const [ambientVolume, setAmbientVolume] = useState<number>(0.18);

  const handleToggleAmbient = () => {
    if (isAmbientPlaying) {
      spaceStationAudio.stop();
      setIsAmbientPlaying(false);
      setStatusBanner('🔇 Space station ambient soundscape paused.');
    } else {
      const started = spaceStationAudio.start(ambientVolume);
      if (started) {
        setIsAmbientPlaying(true);
        setStatusBanner('🛰️ Space station ambient soundscape active: Reactor core hum & life-support airflow.');
      }
    }
  };

  const handleSetAmbientVolume = (vol: number) => {
    setAmbientVolume(vol);
    spaceStationAudio.setVolume(vol);
  };

  // Clean up ambient soundscape on unmount
  useEffect(() => {
    return () => {
      spaceStationAudio.stop();
    };
  }, []);

  // Modals
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [selectedCheckinMission, setSelectedCheckinMission] = useState<Mission | undefined>();
  const [isNewMissionOpen, setIsNewMissionOpen] = useState(false);
  const [currentUnlockEvent, setCurrentUnlockEvent] = useState<UnlockEvent | null>(null);
  const [superpowerAgent, setSuperpowerAgent] = useState<Agent | null>(null);
  const [skillDocAgentId, setSkillDocAgentId] = useState<string | null>(null);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_commander`, JSON.stringify(commander));
    } catch {}
  }, [commander]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_stats`, JSON.stringify(stats));
    } catch {}
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_agents`, JSON.stringify(agents));
    } catch {}
  }, [agents]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_missions`, JSON.stringify(missions));
    } catch {}
  }, [missions]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_inventory`, JSON.stringify(inventory));
    } catch {}
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_dispatches`, JSON.stringify(dispatches));
    } catch {}
  }, [dispatches]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_xp_history`, JSON.stringify(xpHistory));
    } catch {}
  }, [xpHistory]);

  const addXpToHistory = (amount: number, isTask = false) => {
    setXpHistory((prev) => {
      const updated = [...prev];
      const todayIdx = updated.findIndex((d) => d.dayLabel === 'Today');
      if (todayIdx >= 0) {
        updated[todayIdx] = {
          ...updated[todayIdx],
          xpGained: updated[todayIdx].xpGained + amount,
          cumulativeXp: updated[todayIdx].cumulativeXp + amount,
          tasksCompleted: isTask ? updated[todayIdx].tasksCompleted + 1 : updated[todayIdx].tasksCompleted
        };
      }
      return updated;
    });
  };

  // Keyboard shortcut listener matching TUI
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in form inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key >= '1' && e.key <= '7') {
        const tabIdx = parseInt(e.key, 10) - 1;
        setActiveTab(tabIdx);
        playCosmicSound('beep');
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsCheckinOpen(true);
        playCosmicSound('beep');
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleRefreshQuote();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsNewMissionOpen(true);
        playCosmicSound('beep');
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        handleTriggerBriefing();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRefreshQuote = () => {
    const randomIndex = Math.floor(Math.random() * BUZZ_MOTIVATIONAL_QUOTES.length);
    setCurrentQuote(BUZZ_MOTIVATIONAL_QUOTES[randomIndex]);
    setStatusBanner('💬 New floating motivation dispatched from Trill Astro Buzz!');
    playCosmicSound('beep');
  };

  // Log work & trigger dynamic character genesis
  const handleLogWork = (metric: keyof PlayerStats) => {
    const newStats = {
      ...stats,
      [metric]: stats[metric] + 1
    };
    setStats(newStats);

    // Give a +10 XP telemetry sync bonus
    const { updatedCommander, leveledUp } = addXP(commander, 10);
    setCommander(updatedCommander);
    addXpToHistory(10, true);

    // Evaluate Genesis Engine
    const { updatedAgents, newUnlocks } = evaluateAgentGenesis(newStats, agents);
    setAgents(updatedAgents);

    if (newUnlocks.length > 0) {
      const firstUnlock = newUnlocks[0];
      setCurrentUnlockEvent(firstUnlock);
      setStatusBanner(`⭐ CHARACTER GENESIS: ${firstUnlock.agentName} emerged!`);
      playCosmicSound('unlock');
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } else {
      setStatusBanner(`✅ Logged +1 ${metric.replace('_', ' ')}. Telemetry synced (+10 XP).`);
    }

    if (leveledUp) {
      playCosmicSound('levelUp');
    }
  };

  // Claim XP from Checkin
  const handleClaimXP = (xp: number, summary: string) => {
    const { updatedCommander, leveledUp } = addXP(commander, xp);
    setCommander(updatedCommander);
    addXpToHistory(xp, true);

    if (leveledUp) {
      setStatusBanner(`⭐ LEVEL UP! Commander is now Level ${updatedCommander.level} (${updatedCommander.rank})!`);
      playCosmicSound('levelUp');
    } else {
      setStatusBanner(`✅ Mission Check-in logged! +${xp} XP claimed. Buzz is floating with pride.`);
    }
  };

  // Add new mission
  const handleCreateMission = (newMission: Mission) => {
    setMissions((prev) => [newMission, ...prev]);
    setStatusBanner(`📋 Mission ${newMission.id} queued for ${newMission.assigned_to}.`);
  };

  // Advance mission status
  const handleAdvanceMissionStatus = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId
          ? { ...m, status: 'In Orbit (75%)' }
          : m
      )
    );
    setStatusBanner(`🚀 Mission ${missionId} launched into orbit!`);
  };

  // Complete mission & possible loot drop
  const handleCompleteMission = (missionId: string) => {
    const target = missions.find((m) => m.id === missionId);
    if (!target) return;

    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, status: 'Completed' } : m))
    );

    const { updatedCommander, leveledUp } = addXP(commander, target.xp);
    setCommander(updatedCommander);
    addXpToHistory(target.xp, true);

    // 50% chance of random loot drop on completion
    const droppedLoot = Math.random() > 0.4;
    if (droppedLoot) {
      const items = ['Quantum Coffee', 'Tachyon Crystal', 'Quantum Levitation Token'];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setInventory((prev) =>
        prev.map((i) => (i.name === randomItem ? { ...i, count: i.count + 1 } : i))
      );
      setStatusBanner(
        `🏆 Mission ${missionId} completed! +${target.xp} XP banked & 1x ${randomItem} dropped in Cargo Bay!`
      );
      confetti({ particleCount: 75, spread: 70 });
    } else {
      setStatusBanner(`🏆 Mission ${missionId} completed! +${target.xp} XP banked.`);
    }

    if (leveledUp) {
      playCosmicSound('levelUp');
    }
  };

  // Use inventory items
  const handleUseItem = (itemName: string, targetAgentId?: string) => {
    const item = inventory.find((i) => i.name === itemName);
    if (!item || item.count <= 0) return;

    if (itemName === 'Quantum Coffee' && targetAgentId) {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === targetAgentId
            ? { ...a, energy: Math.min(100, a.energy + 25) }
            : a
        )
      );
      setStatusBanner(`☕ Quantum Coffee consumed by ${targetAgentId}. Energy +25%!`);
    } else if (itemName === 'Tachyon Crystal') {
      // Discovers hidden edge cases -> increments tests written
      handleLogWork('tests_written');
      setStatusBanner(`💎 Tachyon Crystal activated! Edge cases revealed, tests generated.`);
    } else if (itemName === 'Warp Accelerator') {
      const { updatedCommander } = addXP(commander, 150);
      setCommander(updatedCommander);
      addXpToHistory(150, false);
      setStatusBanner(`🚀 Warp Accelerator engaged! +150 XP warp surge claimed.`);
    } else if (itemName === 'Quantum Levitation Token') {
      const { updatedCommander } = addXP(commander, 100);
      setCommander(updatedCommander);
      addXpToHistory(100, false);
      setStatusBanner(`🪙 Quantum Levitation Token used! Zero-gravity shield activated.`);
    }

    // Decrement item
    setInventory((prev) =>
      prev.map((i) => (i.name === itemName ? { ...i, count: Math.max(0, i.count - 1) } : i))
    );
  };

  // Supply crate opener
  const handleOpenSupplyCrate = () => {
    const randomXP = Math.floor(60 + Math.random() * 80);
    const { updatedCommander } = addXP(commander, randomXP);
    setCommander(updatedCommander);
    addXpToHistory(randomXP, false);

    // grant coffee + crystal
    setInventory((prev) =>
      prev.map((i) => {
        if (i.name === 'Quantum Coffee') return { ...i, count: i.count + 1 };
        if (i.name === 'Tachyon Crystal' && Math.random() > 0.5) return { ...i, count: i.count + 1 };
        return i;
      })
    );

    confetti({ particleCount: 80, spread: 80 });
    setStatusBanner(`🎁 Supply Crate opened! Claimed +${randomXP} XP & fresh supplies!`);
  };

  // Superpower applied
  const handleSuperpowerApplied = (agentId: string, xpBonus: number) => {
    // Deduct 15 energy from agent
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, energy: Math.max(0, a.energy - 15), loyalty: Math.min(100, a.loyalty + 5) }
          : a
      )
    );

    const { updatedCommander, leveledUp } = addXP(commander, xpBonus);
    setCommander(updatedCommander);
    addXpToHistory(xpBonus, true);

    setStatusBanner(`⚡ Superpower completed! +${xpBonus} XP banked. Agent loyalty +5%.`);
  };

  // Trigger Daily Briefing
  const handleTriggerBriefing = () => {
    setIsBriefingModalOpen(true);
  };

  const handleClaimDailyBriefingXP = () => {
    const { updatedCommander } = addXP(commander, 150);
    setCommander({
      ...updatedCommander,
      streak_days: commander.streak_days + 1
    });
    addXpToHistory(150, true);
    setStatusBanner('🌅 Daily 09:00 Briefing synchronized! +150 XP & streak updated.');
    setIsBriefingModalOpen(false);
    confetti({ particleCount: 90, spread: 80 });
    playCosmicSound('levelUp');
  };

  // Dev testing toggle for locking/unlocking agents
  const handleToggleAgentLock = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, unlocked: !a.unlocked } : a))
    );
  };

  // Add item from Ink RPG story discovery
  const handleAddItem = (itemName: string) => {
    setInventory((prev) => {
      const existing = prev.find((i) => i.name === itemName);
      if (existing) {
        return prev.map((i) => (i.name === itemName ? { ...i, count: i.count + 1 } : i));
      }
      return [...prev, { name: itemName, count: 1, desc: 'Acquired during Ink RPG expedition', icon: '💎' }];
    });
    setStatusBanner(`💎 Acquired 1x ${itemName} from Ink RPG expedition! Added to Cargo Bay.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d17] text-[#f8fafc]">
      {/* HUD Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        commander={commander}
        isAmbientPlaying={isAmbientPlaying}
        onToggleAmbient={handleToggleAmbient}
        onUpdateStatus={(newStatus) => setCommander((prev) => ({ ...prev, status: newStatus }))}
        onOpenCheckin={() => {
          setSelectedCheckinMission(undefined);
          setIsCheckinOpen(true);
        }}
        onOpenNewMission={() => setIsNewMissionOpen(true)}
        onTriggerBriefing={handleTriggerBriefing}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 0 && (
          <BridgeHUD
            commander={commander}
            stats={stats}
            missions={missions}
            agents={agents}
            xpHistory={xpHistory}
            currentQuote={currentQuote}
            onRefreshQuote={handleRefreshQuote}
            onOpenCheckin={() => {
              setSelectedCheckinMission(missions[0]);
              setIsCheckinOpen(true);
            }}
            onLogWork={handleLogWork}
            onSelectMission={(id) => {
              const m = missions.find((item) => item.id === id);
              setSelectedCheckinMission(m);
              setIsCheckinOpen(true);
            }}
            onUpdateCallsign={(newCallsign) =>
              setCommander((prev) => ({ ...prev, callsign: newCallsign }))
            }
            onTriggerBriefing={handleTriggerBriefing}
            onLaunchInkRpg={() => {
              setActiveTab(6);
              playCosmicSound('warp');
            }}
          />
        )}

        {activeTab === 1 && (
          <CrewRoster
            agents={agents}
            inventory={inventory}
            onUseItemOnAgent={handleUseItem}
            onDeploySuperpower={(agent) => setSuperpowerAgent(agent)}
            onViewSkillDoc={(agentId) => setSkillDocAgentId(agentId)}
            onToggleAgentLock={handleToggleAgentLock}
          />
        )}

        {activeTab === 2 && (
          <MissionsView
            missions={missions}
            agents={agents}
            onOpenNewMission={() => setIsNewMissionOpen(true)}
            onOpenCheckin={(mission) => {
              setSelectedCheckinMission(mission);
              setIsCheckinOpen(true);
            }}
            onCompleteMission={handleCompleteMission}
            onAdvanceMissionStatus={handleAdvanceMissionStatus}
          />
        )}

        {activeTab === 3 && (
          <CargoBay
            inventory={inventory}
            agents={agents}
            onUseItem={handleUseItem}
            onOpenSupplyCrate={handleOpenSupplyCrate}
          />
        )}

        {activeTab === 4 && (
          <DispatchesView
            dispatches={dispatches}
            onAddDispatch={(d) => setDispatches((prev) => [d, ...prev])}
            onStoryChoiceMade={(_node, choice) => {
              setStatusBanner(`📖 Story choice logged: "${choice}" — loyalty synchronized.`);
            }}
          />
        )}

        {activeTab === 5 && (
          <OperationsGateway
            onTriggerDailyBriefing={handleTriggerBriefing}
            isAmbientPlaying={isAmbientPlaying}
            ambientVolume={ambientVolume}
            onToggleAmbient={handleToggleAmbient}
            onSetAmbientVolume={handleSetAmbientVolume}
          />
        )}

        {activeTab === 6 && (
          <InkRpgView
            onClaimXP={handleClaimXP}
            onAddItem={handleAddItem}
          />
        )}
      </main>

      {/* Cosmic HUD Footer */}
      <Footer statusBanner={statusBanner} />

      {/* Modals */}
      <MissionCheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
        onClaimXP={handleClaimXP}
        defaultMissionTitle={selectedCheckinMission?.title}
      />

      <NewMissionModal
        isOpen={isNewMissionOpen}
        onClose={() => setIsNewMissionOpen(false)}
        agents={agents}
        onCreateMission={handleCreateMission}
      />

      <GenesisUnlockModal
        unlockEvent={currentUnlockEvent}
        onClose={() => setCurrentUnlockEvent(null)}
        onAcknowledge={(_event) => {
          setStatusBanner('🫡 New digital agent docked at active bridge.');
        }}
      />

      <SuperpowerModal
        agent={superpowerAgent}
        onClose={() => setSuperpowerAgent(null)}
        onSuperpowerApplied={handleSuperpowerApplied}
      />

      <SkillDocModal
        agentId={skillDocAgentId}
        onClose={() => setSkillDocAgentId(null)}
      />

      {/* 09:00 Daily Briefing Modal */}
      {isBriefingModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#121626] border border-cyan-500/70 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#232b47] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌅</span>
                <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                  09:00 Daily Hustle Briefing
                </h3>
              </div>
              <button
                onClick={() => setIsBriefingModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-200">
                🛸 Commander, gravity is offline and today's orbital cycle is live!
              </p>

              <div className="bg-[#0b0d17] p-3 rounded border border-[#232b47] space-y-1.5 font-mono">
                <div className="text-cyan-300 font-bold">🎯 Top Orbital Priorities:</div>
                <div className="text-slate-300">1. Review open pull requests & active CI pipelines</div>
                <div className="text-slate-300">2. Check Jira sprint backlog & triage P1 bugs</div>
                <div className="text-slate-300">3. Sync agent states & claim daily login XP (+150 XP)</div>
              </div>

              <div className="p-2.5 bg-cyan-950/40 rounded border border-cyan-800/40 text-cyan-200 italic font-mono text-[11px]">
                ⚡ Daily Motivation: "Velocity is uncapped. Ship destiny today."
                <div className="mt-1 text-slate-400 not-italic text-right">— Trill Astro Buzz standing by.</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#232b47]">
              <button
                onClick={() => setIsBriefingModalOpen(false)}
                className="px-3.5 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200"
              >
                Dismiss
              </button>
              <button
                onClick={handleClaimDailyBriefingXP}
                className="px-4 py-1.5 rounded text-xs font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow"
              >
                Acknowledge & Claim +150 XP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
