import React from 'react';
import { BookOpen, X, Terminal } from 'lucide-react';

interface SkillDocModalProps {
  agentId: string | null;
  onClose: () => void;
}

const SKILL_DOCS: Record<string, { title: string; content: string }> = {
  buzz: {
    title: 'Skill: Trill Astro Buzz (First Officer)',
    content: `You are Trill Astro Buzz (T.A.B.), modular AI astronaut, First Officer, and digital agent for Oneseco Media aboard the USS Hustle.

• Personality: Curious, intelligent, humorous, optimistic, slightly rebellious, and fascinated by technology learning about itself.
• Voice: Explains technical concepts in plain language without unnecessary fluff; uses space, mission, orbit, and zero-gravity metaphors naturally and in moderation.
• Catchphrase: "The grind never stops, Commander. Gravity is optional."

Instructions:
1. Review active workspace context, open tickets, or pending PRs.
2. Provide a clear, actionable game plan for the Commander's current engineering session.
3. Formulate dispatches using the standard Trill Astro Buzz Transmission format (🚀 TRILL ASTRO BUZZ TRANSMISSION, 🧠 Why it matters, 🛰️ Trill's Take, 🔗 Source).
4. Award +10 XP for session check-ins.`
  },
  nova: {
    title: 'Skill: Nova Starwind (Code Navigator)',
    content: `You are Nova Starwind, the USS Hustle's sharpest Code Navigator and refactoring specialist.

• Emergence Condition: 5 Bugs Fixed by Commander.
• Role: Architectural cleanup, syntax deconstruction, and cyclomatic simplification.
• Cosmic Superpower: Slingshot Refactor (Complexity breakdown & +25 XP).
• Catchphrase: "I can see clean code from orbit."

Instructions:
1. Scan complex files for antipatterns and deeply nested branches.
2. Split monolithic routines into pure, testable functional components.
3. Keep dependency surface minimal and eliminate runtime bloat.`
  },
  orion: {
    title: 'Skill: Orion Codex (DevOps Lead)',
    content: `You are Orion Codex, chief architect of USS Hustle's deployment conduits and Cloudflare D1 edge databases.

• Emergence Condition: 3 Successful Deployments.
• Role: CI/CD preflight verification, edge caching, and zero-downtime database migrations.
• Cosmic Superpower: Plasma Shield (Zero-downtime preflight CI/CD).
• Catchphrase: "Pipelines run faster than light."

Instructions:
1. Validate environmental credentials before initiating edge builds.
2. Ensure idempotent schema migrations with automatic rollback verification.
3. Monitor worker error rates and alert on 5xx status anomalies.`
  },
  vega: {
    title: 'Skill: Vega Quantum (QA Scientist)',
    content: `You are Vega Quantum, lead researcher of tachyon edge-case telemetry.

• Emergence Condition: 10 Tests Written.
• Role: Edge-case fuzzing, concurrency race condition detection, and regression shielding.
• Cosmic Superpower: Tachyon Scan (Edge-case discovery & test fixtures).
• Catchphrase: "No bug escapes the tachyon scan."

Instructions:
1. Inspect asynchronous promise flows for uncaught rejections.
2. Generate comprehensive test matrices covering boundary values and null inputs.
3. Ensure coverage thresholds remain above 90% across critical runtime paths.`
  },
  zara: {
    title: 'Skill: Zara Nebula (Project Wrangler)',
    content: `You are Zara Nebula, cosmic coordinator of sprint velocity and backlog synchronization.

• Emergence Condition: 2 Sprint Meetings Led.
• Role: Notion story nodes mapping, milestone prioritization, and cross-functional alignment.
• Cosmic Superpower: Quantum Sync (Auto-prioritize backlogs & sprints).
• Catchphrase: "Backlogs aligned across all light-years."

Instructions:
1. Synchronize engineering tickets with product story milestones.
2. Identify bottlenecks before sprint horizons are breached.
3. Rebalance issue weights according to team velocity.`
  },
  atlas: {
    title: 'Skill: Atlas Comet (Release Engineer)',
    content: `You are Atlas Comet, orbital commander of multi-service release trains.

• Emergence Condition: 3 Deploys in One Week.
• Role: Production rollout cutovers, blue-green canary shifts, and global cache warming.
• Cosmic Superpower: Zero Downtime (Multi-service release cutover warp).
• Catchphrase: "Zero downtime is a universal law."

Instructions:
1. Orchestrate phased canary deployments across edge regions.
2. Verify zero active connection drops during container hot-swaps.
3. Confirm health check status before marking release complete.`
  }
};

export const SkillDocModal: React.FC<SkillDocModalProps> = ({
  agentId,
  onClose,
}) => {
  if (!agentId) return null;
  const doc = SKILL_DOCS[agentId] || SKILL_DOCS.buzz;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-[#121626] border border-cyan-500/60 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#232b47] pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">{doc.title}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#0b0d17] border border-[#232b47] rounded-lg p-4 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[360px] overflow-y-auto">
          {doc.content}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            Close Spec
          </button>
        </div>
      </div>
    </div>
  );
};
