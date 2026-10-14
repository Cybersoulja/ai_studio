export interface Commander {
  callsign: string;
  rank: string;
  level: number;
  xp: number;
  xp_to_next: number;
  streak_days: number;
  status: string;
}

export interface PlayerStats {
  bugs_fixed: number;
  deployments: number;
  tests_written: number;
  meetings_led: number;
  weekly_deploys: number;
}

export type EvolutionStage = 'Genesis' | 'Awakened' | 'Enlightened' | 'Transcended';

export interface Agent {
  id: string;
  name: string;
  role: string;
  title: string;
  rank: string;
  stars: string;
  level: number;
  xp: number;
  loyalty: number; // 0 - 100
  energy: number; // 0 - 100
  stage: EvolutionStage;
  power: string;
  catchphrase: string;
  unlocked: boolean;
  avatar?: string;
  unlockRequirement?: string;
}

export interface Mission {
  id: string;
  title: string;
  category: 'Bug' | 'DevOps' | 'QA' | 'Project' | 'Feature';
  priority: string; // '🔥 Cosmic P1' | '⚡ High Orbit' | '🔬 Standard' | etc.
  xp: number;
  assigned_to: string;
  status: 'Queued' | 'In Orbit (75%)' | 'Warp Speed' | 'Completed';
  description?: string;
  runtime?: 'Codex' | 'Jules' | 'Craft' | 'Zapier' | 'Local';
  jira_key?: string;
}

export interface InventoryItem {
  id?: string;
  name: string;
  count: number;
  desc: string;
  icon?: string;
}

export interface Dispatch {
  id?: string;
  headline: string;
  date: string;
  summary: string;
  source: string;
  whyItMatters?: string;
  trillsTake?: string;
}

export interface StoryNode {
  id: string;
  trigger: string;
  speaker: string;
  text: string;
  choices: string[];
}

export interface AutomationItem {
  id: string;
  name: string;
  trigger: string;
  cron?: string;
  source?: string;
  filter?: Record<string, string>;
  action: string;
  params: {
    title: string;
    agent?: string;
    skill?: string;
    prompt?: string;
    initialPrompt?: string;
    notify?: {
      enabled: boolean;
      groupType: string;
      title: string;
      defaultQuote?: string;
    };
  };
}

export interface OperationDraft {
  id: string;
  chat_id: number;
  requested_by_telegram_id: number;
  title: string;
  description: string | null;
  priority: string;
  due_at: string | null;
  crew_code: string;
  teammate_id: string | null;
  state: 'PENDING' | 'EXECUTING' | 'APPROVED' | 'CANCELLED' | 'EXPIRED' | 'FAILED';
  jira_project_key: string | null;
  jira_issue_key: string | null;
  expires_at: string;
}
