import React, { useState } from 'react';
import {
  Terminal,
  Send,
  CheckCircle2,
  Shield,
  Bell,
  Zap,
  Play,
  RefreshCw,
  Cpu,
  Volume2,
  VolumeX,
  Radio,
  Activity,
  Sliders
} from 'lucide-react';
import { AutomationItem, OperationDraft } from '../types';
import { SYSTEM_AUTOMATIONS } from '../data/initialData';
import { playCosmicSound } from '../services/genesisEngine';

interface OperationsGatewayProps {
  onTriggerDailyBriefing: () => void;
  isAmbientPlaying: boolean;
  ambientVolume: number;
  onToggleAmbient: () => void;
  onSetAmbientVolume: (vol: number) => void;
}

export const OperationsGateway: React.FC<OperationsGatewayProps> = ({
  onTriggerDailyBriefing,
  isAmbientPlaying,
  ambientVolume,
  onToggleAmbient,
  onSetAmbientVolume,
}) => {
  const [drafts, setDrafts] = useState<OperationDraft[]>([
    {
      id: 'OP-49A1',
      chat_id: 1001,
      requested_by_telegram_id: 42,
      title: 'Upgrade Edge Worker to Node 22 Compat',
      description: 'Ensure wrangler d1 bindings support prepared statements without latency spikes.',
      priority: 'High',
      due_at: '2026-10-20T17:00:00Z',
      crew_code: 'orion',
      teammate_id: '@orion_dev',
      state: 'PENDING',
      jira_project_key: null,
      jira_issue_key: null,
      expires_at: new Date(Date.now() + 1800000).toISOString()
    }
  ]);

  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '🛸 USS Hustle Operations Gateway Online (Cloudflare D1 + Telegram Bot)',
    'Type /help for available operations commands, or test an automation trigger below.',
    'System ready: /task Title | description, /approve DRAFT-ID PROJECTKEY'
  ]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    playCosmicSound('beep');
    setTerminalLogs((prev) => [...prev, `> ${cmd}`]);
    setTerminalInput('');

    if (cmd === '/help' || cmd === '/start') {
      setTerminalLogs((prev) => [
        ...prev,
        '🛸 Opxero Operations Bot Commands:',
        '  /task Title | description | [due_at] — Create new approval-gated draft',
        '  /delegate DRAFT-ID @teammate [crew] — Assign teammate & advisor',
        '  /approve DRAFT-ID PROJECTKEY — Review and generate Jira issue',
        '  /cancel DRAFT-ID — Cancel pending draft safely',
        '  /status [JIRA-KEY] — Check tracked operations',
        '  /ambient — Toggle space station ambient soundscape',
        '  /briefing — Run 24h operations briefing',
        '  /clear — Clear terminal buffer'
      ]);
    } else if (cmd === '/clear') {
      setTerminalLogs(['🛸 Terminal buffer cleared.']);
    } else if (cmd === '/ambient' || cmd.startsWith('/ambient') || cmd.startsWith('/audio')) {
      onToggleAmbient();
      setTerminalLogs((prev) => [
        ...prev,
        isAmbientPlaying
          ? '🔇 Ambient space station soundscape paused.'
          : '🛰️ Ambient space station soundscape engaged: Zero-G Reactor Core Hum & Ventilation online.'
      ]);
    } else if (cmd.startsWith('/task')) {
      const payload = cmd.slice(5).trim();
      if (!payload) {
        setTerminalLogs((prev) => [...prev, '⚠️ Usage: /task Title | optional description | optional ISO due date']);
        return;
      }
      const parts = payload.split('|');
      const title = parts[0]?.trim();
      const description = parts[1]?.trim() || 'Quick task logged via Telegram';
      const dueAt = parts[2]?.trim() || new Date(Date.now() + 86400000).toISOString();
      const newId = `OP-${Math.floor(1000 + Math.random() * 9000)}`;

      // select crew
      let crew = 'trill';
      const lower = `${title} ${description}`.toLowerCase();
      if (/deploy|production|rollback/.test(lower)) crew = 'orion';
      else if (/test|qa|coverage/.test(lower)) crew = 'vega';
      else if (/sprint|plan|backlog/.test(lower)) crew = 'zara';
      else if (/release|rollout/.test(lower)) crew = 'atlas';
      else if (/bug|fix|error/.test(lower)) crew = 'nova';

      const newDraft: OperationDraft = {
        id: newId,
        chat_id: 1001,
        requested_by_telegram_id: 42,
        title,
        description,
        priority: 'Medium',
        due_at: dueAt,
        crew_code: crew,
        teammate_id: null,
        state: 'PENDING',
        jira_project_key: null,
        jira_issue_key: null,
        expires_at: new Date(Date.now() + 1800000).toISOString()
      };

      setDrafts((prev) => [newDraft, ...prev]);
      setTerminalLogs((prev) => [
        ...prev,
        `📝 Pending task draft created: ${newId}`,
        `Title: ${title}`,
        `Advisor: ${crew.toUpperCase()}`,
        `Status: PENDING approval. Use /approve ${newId} HUSTLE to create Jira issue.`
      ]);
    } else if (cmd.startsWith('/approve')) {
      const parts = cmd.slice(8).trim().split(/\s+/);
      const draftId = parts[0]?.toUpperCase();
      const projKey = parts[1]?.toUpperCase() || 'HUSTLE';

      const draft = drafts.find((d) => d.id === draftId);
      if (!draft) {
        setTerminalLogs((prev) => [...prev, `❌ Draft ${draftId} not found.`]);
        return;
      }
      if (draft.state === 'APPROVED') {
        setTerminalLogs((prev) => [...prev, `⚠️ Already approved as ${draft.jira_issue_key}`]);
        return;
      }

      const jiraKey = `${projKey}-${Math.floor(100 + Math.random() * 900)}`;
      setDrafts((prev) =>
        prev.map((d) =>
          d.id === draftId
            ? { ...d, state: 'APPROVED', jira_issue_key: jiraKey, jira_project_key: projKey }
            : d
        )
      );
      playCosmicSound('levelUp');
      setTerminalLogs((prev) => [
        ...prev,
        `✅ Approved! Zapier & Jira webhook dispatched.`,
        `Jira issue ${jiraKey} created in project ${projKey}.`,
        `Notification push sent to Telegram Chat ID ${draft.chat_id}.`
      ]);
    } else if (cmd.startsWith('/cancel')) {
      const draftId = cmd.slice(7).trim().toUpperCase();
      setDrafts((prev) =>
        prev.map((d) => (d.id === draftId ? { ...d, state: 'CANCELLED' } : d))
      );
      setTerminalLogs((prev) => [...prev, `🛑 Cancelled draft ${draftId}. No external action taken.`]);
    } else if (cmd.startsWith('/status')) {
      const lines = drafts.map(
        (d) => `• ${d.jira_issue_key || d.id} — [${d.state}] ${d.title} (Crew: ${d.crew_code.toUpperCase()})`
      );
      setTerminalLogs((prev) => [
        ...prev,
        '🛰️ Recent Operations Status:',
        ...lines
      ]);
    } else if (cmd.startsWith('/briefing')) {
      setTerminalLogs((prev) => [
        ...prev,
        '🌅 Operations Briefing triggered. Dispatching to connected devices...',
        `Tracked drafts: ${drafts.length} (${drafts.filter((d) => d.state === 'APPROVED').length} approved)`
      ]);
      onTriggerDailyBriefing();
    } else {
      setTerminalLogs((prev) => [
        ...prev,
        `Unknown command "${cmd}". Type /help for list of commands.`
      ]);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232b47] pb-4">
        <div>
          <h2 className="text-base font-bold text-cyan-300 tracking-wider flex items-center gap-2">
            <span>🛰️</span>
            <span>OPERATIONS GATEWAY & AUTOMATIONS HUB</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cloudflare D1, Zapier webhooks, Telegram bot gateway, and automated cron briefings.
          </p>
        </div>

        <button
          onClick={() => {
            playCosmicSound('warp');
            onTriggerDailyBriefing();
          }}
          className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Bell className="w-4 h-4" />
          <span>Dispatch 09:00 Briefing Push</span>
        </button>
      </div>

      {/* Space Station Ambient Soundscape Console Card */}
      <div className="bg-gradient-to-r from-[#121626] via-[#101428] to-[#121626] border border-cyan-800/60 rounded-xl p-4 md:p-5 shadow-[0_0_25px_rgba(6,182,212,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border transition-all shrink-0 ${
                isAmbientPlaying
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-pulse'
                  : 'bg-[#0b0d17] border-[#232b47] text-slate-500'
              }`}
            >
              {isAmbientPlaying ? (
                <Volume2 className="w-6 h-6 text-cyan-300" />
              ) : (
                <VolumeX className="w-6 h-6 text-slate-500" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Space Station Ambient Soundscape</span>
                </h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 ${
                    isAmbientPlaying
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                      : 'bg-slate-900 text-slate-400 border border-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isAmbientPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
                    }`}
                  />
                  {isAmbientPlaying ? 'ACTIVE' : 'STANDBY'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {isAmbientPlaying
                  ? 'Reactor Hum (55Hz / 57.2Hz Binaural) • Cabin Airflow Ventilation • Harmonic Resonance'
                  : 'Zero-G background audio offline. Toggle on to play low-volume space station soundscape.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Volume presets and slider */}
            <div className="flex items-center gap-2 bg-[#0b0d17] border border-[#232b47] rounded-lg px-3 py-1.5 text-xs font-mono">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 text-[11px]">Vol:</span>
              <input
                type="range"
                min="0.05"
                max="0.4"
                step="0.01"
                value={ambientVolume}
                onChange={(e) => onSetAmbientVolume(parseFloat(e.target.value))}
                className="w-20 accent-cyan-400 cursor-pointer"
                title={`Ambient Volume: ${Math.round(ambientVolume * 100)}%`}
              />
              <span className="text-cyan-300 font-bold min-w-8 text-right">
                {Math.round(ambientVolume * 100)}%
              </span>
            </div>

            {/* Quick volume presets */}
            <div className="hidden sm:flex items-center bg-[#0b0d17] border border-[#232b47] rounded-lg p-0.5 text-[10px] font-mono">
              <button
                onClick={() => onSetAmbientVolume(0.1)}
                className={`px-2 py-1 rounded transition-colors ${
                  ambientVolume <= 0.12 ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Subtle
              </button>
              <button
                onClick={() => onSetAmbientVolume(0.18)}
                className={`px-2 py-1 rounded transition-colors ${
                  ambientVolume > 0.12 && ambientVolume <= 0.25 ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Nominal
              </button>
              <button
                onClick={() => onSetAmbientVolume(0.32)}
                className={`px-2 py-1 rounded transition-colors ${
                  ambientVolume > 0.25 ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Deep
              </button>
            </div>

            {/* Main Toggle Button */}
            <button
              onClick={() => {
                onToggleAmbient();
                playCosmicSound('beep');
              }}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 ${
                isAmbientPlaying
                  ? 'bg-rose-950/70 hover:bg-rose-900/90 text-rose-300 border border-rose-700/80 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                  : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              }`}
            >
              {isAmbientPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isAmbientPlaying ? 'Silence Soundscape' : 'Engage Station Soundscape'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Telegram Bot Operations Terminal */}
        <div className="lg:col-span-7 bg-[#121626] border border-[#232b47] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#232b47] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-200">
                  Telegram Operations Bot Terminal Simulator
                </h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Connected • /task active
              </span>
            </div>

            {/* Terminal output */}
            <div className="bg-[#0b0d17] border border-[#232b47] rounded-lg p-3 font-mono text-xs text-slate-300 h-64 overflow-y-auto space-y-1">
              {terminalLogs.map((log, lIdx) => (
                <div
                  key={lIdx}
                  className={`${
                    log.startsWith('>')
                      ? 'text-cyan-400 font-bold'
                      : log.startsWith('✅')
                      ? 'text-emerald-400'
                      : log.startsWith('📝')
                      ? 'text-amber-300'
                      : 'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Terminal Input */}
          <form onSubmit={handleCommand} className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-cyan-400 font-mono text-xs font-bold">{'>'}</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Try /task Fix OAuth bug | High urgency, or /help"
                className="w-full bg-[#0b0d17] border border-[#232b47] focus:border-cyan-400 rounded pl-7 pr-3 py-2 text-xs font-mono text-slate-200 outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold text-xs flex items-center gap-1 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Right Column: Automations & Configured Drafts */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Automations */}
          <div className="bg-[#121626] border border-[#232b47] rounded-lg p-4">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>Configured System Automations</span>
            </h3>

            <div className="space-y-2.5">
              {SYSTEM_AUTOMATIONS.map((auto) => (
                <div
                  key={auto.id}
                  className="bg-[#0b0d17] border border-[#232b47] p-3 rounded text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{auto.name}</span>
                    <span className="text-[10px] text-cyan-400 font-mono">{auto.trigger}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Action: <span className="text-indigo-300 font-mono">{auto.action}</span>
                  </p>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        playCosmicSound('beep');
                        setTerminalLogs((prev) => [
                          ...prev,
                          `⚡ Triggered automation: ${auto.name}`,
                          `Dispatched payload: ${auto.params.title}`
                        ]);
                      }}
                      className="px-2 py-0.5 rounded bg-[#1a2035] hover:bg-cyan-950 border border-[#232b47] text-cyan-300 text-[10px] font-mono flex items-center gap-1"
                    >
                      <Play className="w-2.5 h-2.5" />
                      <span>Test Trigger</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Drafts */}
          <div className="bg-[#121626] border border-[#232b47] rounded-lg p-4">
            <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-3">
              Tracked Operations Drafts ({drafts.length})
            </h3>

            <div className="space-y-2">
              {drafts.map((d) => (
                <div
                  key={d.id}
                  className="p-2.5 bg-[#0b0d17] border border-[#232b47] rounded text-xs"
                >
                  <div className="flex justify-between items-center font-mono">
                    <span className="font-bold text-amber-400">{d.id}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        d.state === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-300'
                          : d.state === 'PENDING'
                          ? 'bg-amber-950 text-amber-300'
                          : 'bg-rose-950 text-rose-300'
                      }`}
                    >
                      {d.state}
                    </span>
                  </div>
                  <div className="text-slate-200 font-semibold truncate mt-1">
                    {d.title}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 flex justify-between">
                    <span>Advisor: {d.crew_code.toUpperCase()}</span>
                    <span>{d.jira_issue_key || 'No Jira Key Yet'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
