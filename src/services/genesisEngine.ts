import { PlayerStats, Agent, Commander } from '../types';

export interface UnlockEvent {
  agentId: string;
  agentName: string;
  dialogueNodeId: string;
  announcement: string;
  superpower: string;
}

export function evaluateAgentGenesis(
  stats: PlayerStats,
  currentAgents: Agent[]
): { updatedAgents: Agent[]; newUnlocks: UnlockEvent[] } {
  const newUnlocks: UnlockEvent[] = [];
  const updatedAgents = currentAgents.map((agent) => {
    if (agent.unlocked) return agent;

    let shouldUnlock = false;
    let event: UnlockEvent | null = null;

    if (agent.id === 'nova' && stats.bugs_fixed >= 5) {
      shouldUnlock = true;
      event = {
        agentId: 'nova',
        agentName: 'Nova Starwind',
        dialogueNodeId: 'NODE_003',
        announcement: '🌠 NOVA STARWIND HAS EMERGED FROM YOUR CODE SYNTAX!',
        superpower: 'Slingshot Refactor (Complexity breakdown & +25 XP)'
      };
    } else if (agent.id === 'orion' && stats.deployments >= 3) {
      shouldUnlock = true;
      event = {
        agentId: 'orion',
        agentName: 'Orion Codex',
        dialogueNodeId: 'NODE_004',
        announcement: '🔭 ORION CODEX HAS ACTIVATED THE PLASMA SHIELD!',
        superpower: 'Plasma Shield (Zero-downtime preflight CI/CD)'
      };
    } else if (agent.id === 'vega' && stats.tests_written >= 10) {
      shouldUnlock = true;
      event = {
        agentId: 'vega',
        agentName: 'Vega Quantum',
        dialogueNodeId: 'NODE_005',
        announcement: '🔬 VEGA QUANTUM HAS CALIBRATED THE TACHYON SCAN!',
        superpower: 'Tachyon Scan (Edge-case discovery & test fixtures)'
      };
    } else if (agent.id === 'zara' && stats.meetings_led >= 2) {
      shouldUnlock = true;
      event = {
        agentId: 'zara',
        agentName: 'Zara Nebula',
        dialogueNodeId: 'NODE_006',
        announcement: '🌌 ZARA NEBULA HAS ENGAGED QUANTUM SYNC!',
        superpower: 'Quantum Sync (Auto-prioritize backlogs & sprints)'
      };
    } else if (agent.id === 'atlas' && stats.weekly_deploys >= 3) {
      shouldUnlock = true;
      event = {
        agentId: 'atlas',
        agentName: 'Atlas Comet',
        dialogueNodeId: 'NODE_007',
        announcement: '☄️ ATLAS COMET HAS INITIATED ZERO DOWNTIME WARP!',
        superpower: 'Zero Downtime (Multi-service release cutover warp)'
      };
    }

    if (shouldUnlock && event) {
      newUnlocks.push(event);
      return { ...agent, unlocked: true };
    }

    return agent;
  });

  return { updatedAgents, newUnlocks };
}

export function addXP(
  commander: Commander,
  xpToAdd: number
): { updatedCommander: Commander; leveledUp: boolean } {
  let newXp = commander.xp + xpToAdd;
  let newLevel = commander.level;
  let newXpToNext = commander.xp_to_next;
  let leveledUp = false;

  while (newXp >= newXpToNext) {
    newXp -= newXpToNext;
    newLevel += 1;
    newXpToNext = Math.round(newXpToNext * 1.35);
    leveledUp = true;
  }

  const ranks = [
    'Hustler-in-Training',
    'Junior Hustler',
    'Senior Hustler',
    'Orbital Specialist',
    'Flight Commander',
    'Cosmic Legend'
  ];
  const newRank = ranks[Math.min(ranks.length - 1, newLevel - 1)];

  return {
    updatedCommander: {
      ...commander,
      xp: newXp,
      level: newLevel,
      xp_to_next: newXpToNext,
      rank: newRank
    },
    leveledUp
  };
}

// Cosmic Web Audio Synthesizer for retro HUD SFX
export function playCosmicSound(type: 'beep' | 'levelUp' | 'unlock' | 'warp' | 'coffee') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'levelUp') {
      [440, 554, 659, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const start = ctx.currentTime + idx * 0.1;
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.25);
      });
    } else if (type === 'unlock') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        const start = ctx.currentTime + idx * 0.12;
        gain.gain.setValueAtTime(0.09, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.3);
      });
    } else if (type === 'warp') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'coffee') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch {
    // AudioContext blocked or not supported
  }
}
