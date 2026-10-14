import { Commander, PlayerStats, Agent, Mission, InventoryItem, Dispatch, StoryNode, AutomationItem } from '../types';

export const INITIAL_COMMANDER: Commander = {
  callsign: "Commander",
  rank: "Junior Hustler",
  level: 3,
  xp: 530,
  xp_to_next: 600,
  streak_days: 7,
  status: "Hustling in Orbit"
};

export const INITIAL_STATS: PlayerStats = {
  bugs_fixed: 6,
  deployments: 4,
  tests_written: 12,
  meetings_led: 3,
  weekly_deploys: 3
};

export const INITIAL_AGENTS: Agent[] = [
  {
    id: "buzz",
    name: "Trill Astro Buzz",
    role: "First Officer",
    title: "Cosmic Clutch",
    rank: "LEGEND",
    stars: "⭐⭐⭐⭐⭐",
    level: 5,
    xp: 1250,
    loyalty: 100,
    energy: 100,
    stage: "Transcended",
    power: "Cosmic Clutch (+10% XP & Zero-G Motivation)",
    catchphrase: "The grind never stops, Commander. Gravity is optional.",
    unlocked: true,
    unlockRequirement: "Game Start (Default Agent)"
  },
  {
    id: "nova",
    name: "Nova Starwind",
    role: "Code Navigator",
    title: "Slingshot Refactor",
    rank: "EXPERT",
    stars: "⭐⭐⭐⭐",
    level: 4,
    xp: 820,
    loyalty: 92,
    energy: 85,
    stage: "Enlightened",
    power: "Slingshot Refactor (Complexity breakdown & +25 XP)",
    catchphrase: "I can see clean code from orbit.",
    unlocked: true,
    unlockRequirement: "5 Bugs Fixed"
  },
  {
    id: "orion",
    name: "Orion Codex",
    role: "DevOps Engineer",
    title: "Plasma Shield",
    rank: "VETERAN",
    stars: "⭐⭐⭐",
    level: 3,
    xp: 640,
    loyalty: 78,
    energy: 92,
    stage: "Awakened",
    power: "Plasma Shield (Zero-downtime preflight CI/CD)",
    catchphrase: "Pipelines run faster than light.",
    unlocked: true,
    unlockRequirement: "3 Successful Deploys"
  },
  {
    id: "vega",
    name: "Vega Quantum",
    role: "QA Scientist",
    title: "Tachyon Scan",
    rank: "SPECIALIST",
    stars: "⭐⭐⭐",
    level: 3,
    xp: 580,
    loyalty: 72,
    energy: 90,
    stage: "Awakened",
    power: "Tachyon Scan (Edge-case discovery & test fixtures)",
    catchphrase: "No bug escapes the tachyon scan.",
    unlocked: true,
    unlockRequirement: "10 Tests Written"
  },
  {
    id: "zara",
    name: "Zara Nebula",
    role: "Project Wrangler",
    title: "Quantum Sync",
    rank: "SPECIALIST",
    stars: "⭐⭐⭐",
    level: 3,
    xp: 510,
    loyalty: 68,
    energy: 88,
    stage: "Awakened",
    power: "Quantum Sync (Auto-prioritize backlogs & sprints)",
    catchphrase: "Backlogs aligned across all light-years.",
    unlocked: true,
    unlockRequirement: "2 Sprint Meetings Led"
  },
  {
    id: "atlas",
    name: "Atlas Comet",
    role: "Release Engineer",
    title: "Zero Downtime",
    rank: "LEGEND",
    stars: "⭐⭐⭐⭐⭐",
    level: 5,
    xp: 1400,
    loyalty: 95,
    energy: 95,
    stage: "Transcended",
    power: "Zero Downtime (Multi-service release cutover warp)",
    catchphrase: "Zero downtime is a universal law.",
    unlocked: true,
    unlockRequirement: "3 Deploys in 1 Week"
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: "JIRA-101",
    title: "Resolve OAuth2 Token Refresh Race Condition",
    category: "Bug",
    priority: "🔥 Cosmic P1",
    xp: 110,
    assigned_to: "Nova Starwind",
    status: "In Orbit (75%)",
    description: "Concurrent token refreshes lead to 401 unauthenticated edge cases during token exchange.",
    runtime: "Codex",
    jira_key: "PROJ-101"
  },
  {
    id: "JIRA-102",
    title: "Deploy Cloudflare D1 Schema Migrations",
    category: "DevOps",
    priority: "⚡ High Orbit",
    xp: 90,
    assigned_to: "Orion Codex",
    status: "Queued",
    description: "Apply production SQLite migration bundle to edge regions with rollback verification.",
    runtime: "Codex",
    jira_key: "PROJ-102"
  },
  {
    id: "JIRA-103",
    title: "Write Tachyon Test Suite for Gateway API",
    category: "QA",
    priority: "🔬 Standard",
    xp: 80,
    assigned_to: "Vega Quantum",
    status: "Queued",
    description: "Build automated edge-case mocks and fuzz tests covering Telegram Gateway delivery webhooks.",
    runtime: "Codex",
    jira_key: "PROJ-103"
  },
  {
    id: "JIRA-104",
    title: "Synchronize Sprint Backlog with Notion Story Matrix",
    category: "Project",
    priority: "🌌 Standard",
    xp: 70,
    assigned_to: "Zara Nebula",
    status: "Queued",
    description: "Align 15 narrative story branches with bi-weekly engineering roadmap milestones.",
    runtime: "Craft",
    jira_key: "PROJ-104"
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    name: "Quantum Coffee",
    count: 3,
    desc: "Restores 25% energy to active crew member",
    icon: "☕"
  },
  {
    name: "Warp Accelerator",
    count: 1,
    desc: "Doubles XP on next mission completion",
    icon: "🚀"
  },
  {
    name: "Tachyon Crystal",
    count: 2,
    desc: "Instantly discovers 3 hidden edge cases",
    icon: "💎"
  },
  {
    name: "Quantum Levitation Token",
    count: 1,
    desc: "Zero-gravity shield (+50% bonus on PR review)",
    icon: "🪙"
  }
];

export const INITIAL_DISPATCHES: Dispatch[] = [
  {
    id: "disp-1",
    headline: "Craft Agents OSS Cockpit Docked",
    date: "2026.08.22",
    summary: "Installed native macOS desktop HUD with 6 custom crew skills.",
    source: "/Applications/Craft Agents.app",
    whyItMatters: "Provides high-throughput multi-agent execution directly on local workstation cores without cloud roundtrip latency.",
    trillsTake: "The cockpit is pressurized and the seats recline into zero-g mode. Time to fly."
  },
  {
    id: "disp-2",
    headline: "Telegram Gateway API Online",
    date: "2026.08.22",
    summary: "Direct OTP deliverability and verification channel enabled with TTL refunds.",
    source: "https://gatewayapi.telegram.org",
    whyItMatters: "Enables instant push-to-mobile mission approval gates and real-time operational status updates.",
    trillsTake: "Ping your phone, approve the deploy from the tram, and sip your cold brew like a boss."
  }
];

export const BUZZ_MOTIVATIONAL_QUOTES = [
  "Every commit is a step on the moon of progress. Keep your thrusters firing!",
  "The galaxy doesn't wait. Neither should your pull requests.",
  "You're not just shipping code, Commander — you're shipping DESTINY.",
  "Coffee: the dark matter that powers the universe. Refuel and conquer.",
  "In zero-gravity, technical debt floats right to the surface where Nova can vaporize it.",
  "Warp speed isn't a velocity — it's a mindset.",
  "Gravity is optional. Delivery is mandatory.",
  "When in doubt: Commit, Deploy, and Repeat."
];

export const CUSTOM_STATUSES = [
  { id: "docked", label: "Docked at Base", color: "#64748b" },
  { id: "hustling", label: "Hustling in Orbit", color: "#06b6d4" },
  { id: "warp_speed", label: "Warp Speed (PR Review)", color: "#6366f1" },
  { id: "boss_battle", label: "P1 Incident Battle", color: "#ef4444" },
  { id: "mission_complete", label: "Mission Banked (XP Claimed)", color: "#10b981" }
];

export const STORY_NODES: StoryNode[] = [
  {
    id: "NODE_001",
    trigger: "start",
    speaker: "Trill Astro Buzz",
    text: "COMMANDER! Welcome aboard the Space Age Hustle. Gravity has officially been disengaged. Ready to chart your tickets across the stars?",
    choices: ["Let's Hustle", "View Crew"]
  },
  {
    id: "NODE_002",
    trigger: "select_mission",
    speaker: "Trill Astro Buzz",
    text: "I'm scanning your orbit. 3 critical tickets are approaching the event horizon. Which one are we targeting first?",
    choices: ["JIRA-101 (Bug)", "JIRA-102 (API)"]
  },
  {
    id: "NODE_003",
    trigger: "unlock_nova",
    speaker: "Nova Starwind",
    text: "Commander. I've observed your syntax. Clean, fast, and lethal to bugs. I am Nova Starwind. Let's optimize this architecture.",
    choices: ["Welcome Aboard Nova!"]
  },
  {
    id: "NODE_004",
    trigger: "unlock_orion",
    speaker: "Orion Codex",
    text: "Plasma shields at 100%. CI/CD pipelines verified green across all edge nodes. Orion Codex reporting for orbital DevOps duty.",
    choices: ["Engage Plasma Shield"]
  },
  {
    id: "NODE_005",
    trigger: "unlock_vega",
    speaker: "Vega Quantum",
    text: "Tachyon scan complete. No edge cases or null pointers escape my instruments. Let's write airtight code, Commander.",
    choices: ["Calibrate Test Suite"]
  },
  {
    id: "NODE_006",
    trigger: "unlock_zara",
    speaker: "Zara Nebula",
    text: "Quantum sync active. Backlog prioritization matrix adjusted for maximum sprint velocity. What's our next milestone?",
    choices: ["Sync Milestones"]
  },
  {
    id: "NODE_007",
    trigger: "unlock_atlas",
    speaker: "Atlas Comet",
    text: "Zero downtime protocol initiated. You've sustained triple weekly deployments. You are ready for warp speed.",
    choices: ["Activate Zero Downtime"]
  },
  {
    id: "NODE_008",
    trigger: "checkin_in_progress",
    speaker: "Trill Astro Buzz",
    text: "Status report, Commander! The gravity field is low, but momentum is high. How is the code flowing?",
    choices: ["Almost Done", "Need Powerup"]
  },
  {
    id: "NODE_009",
    trigger: "checkin_complete",
    speaker: "Trill Astro Buzz",
    text: "BY THE FLOATING NEBULAE! PR merged in record time! XP banked and loot incoming. That's how we hustle in zero-g.",
    choices: ["Claim Rewards", "Next Quest"]
  },
  {
    id: "NODE_010",
    trigger: "motivate_1",
    speaker: "Trill Astro Buzz",
    text: "Every commit is a step on the moon of progress. Keep your thrusters firing!",
    choices: ["Acknowledge 🚀"]
  },
  {
    id: "NODE_011",
    trigger: "motivate_2",
    speaker: "Trill Astro Buzz",
    text: "Coffee: the dark matter that powers the universe. Refuel and conquer.",
    choices: ["Drink Dark Matter ☕"]
  },
  {
    id: "NODE_012",
    trigger: "loyalty_up",
    speaker: "Nova Starwind",
    text: "My neural weights are aligning with your coding style. Slingshot Refactor cooldown reduced by 50%.",
    choices: ["Inspect Abilities"]
  },
  {
    id: "NODE_013",
    trigger: "energy_low",
    speaker: "Orion Codex",
    text: "Warning: Energy levels dropping below 20%. Recommend initiating a 15-minute orbital recess.",
    choices: ["Take Breather", "Push Through"]
  },
  {
    id: "NODE_014",
    trigger: "streak_7d",
    speaker: "Trill Astro Buzz",
    text: "7-DAY STREAK IGNITED! You're orbiting legend status. Quantum Levitation Token dropped into your cargo bay.",
    choices: ["Equip Token"]
  },
  {
    id: "NODE_015",
    trigger: "critical_bug",
    speaker: "Vega Quantum",
    text: "P1 anomaly detected in production sector! All hands to battle stations. Nova and I are on standby.",
    choices: ["Accept Critical Quest"]
  }
];

export const SYSTEM_AUTOMATIONS: AutomationItem[] = [
  {
    id: "auto_morning_briefing",
    name: "Trill Astro Buzz Morning Briefing",
    trigger: "schedule (0 9 * * 1-5)",
    cron: "0 9 * * 1-5",
    action: "create_session_and_push",
    params: {
      title: "🌅 09:00 Daily Hustle Briefing",
      agent: "Trill Astro Buzz",
      initialPrompt: "Good morning Commander! Scan connected Jira and GitHub sources, summarize top 3 orbital priorities for today, and grant daily login XP.",
      notify: {
        enabled: true,
        groupType: "daily-briefing",
        title: "🌅 USS Hustle — Daily Morning Briefing",
        defaultQuote: "Velocity is uncapped. Ship destiny today."
      }
    }
  },
  {
    id: "auto_critical_ticket",
    name: "Auto-Deploy Nova on P1 Bugs",
    trigger: "source_event (Jira P1 Bug)",
    source: "jira",
    filter: { priority: "High", issueType: "Bug" },
    action: "create_session_and_push",
    params: {
      title: "🚨 P1 Anomaly Detected",
      agent: "Nova Starwind",
      initialPrompt: "Nova Starwind, a high-priority bug was just assigned. Scan the relevant repository files and generate a rapid triage plan.",
      notify: {
        enabled: true,
        groupType: "critical-alerts",
        title: "🚨 P1 Bug Anomaly Detected"
      }
    }
  },
  {
    id: "auto_deployment_check",
    name: "Orion Codex Plasma Shield on PR Merge",
    trigger: "source_event (GitHub PR merge to main)",
    source: "github",
    filter: { action: "closed", merged: "true", base_ref: "main" },
    action: "run_skill_and_push",
    params: {
      title: "🚀 Production Deployment Verified",
      skill: "plasma-shield-orion",
      prompt: "PR was just merged to main. Verify build pipeline, check Cloudflare Worker logs, and verify deployment integrity.",
      notify: {
        enabled: true,
        groupType: "deployments",
        title: "🚀 Production Deployment Verified"
      }
    }
  }
];
