import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { TrendingUp, Zap, Calendar, Sparkles } from 'lucide-react';
import { DailyXpRecord } from '../types';

interface XPBarChartProps {
  xpHistory: DailyXpRecord[];
}

export const XPBarChart: React.FC<XPBarChartProps> = ({ xpHistory }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'cumulative'>('daily');

  // Compute summary metrics
  const totalXp = xpHistory.reduce((acc, curr) => acc + curr.xpGained, 0);
  const avgDailyXp = Math.round(totalXp / Math.max(1, xpHistory.length));
  const peakDay = xpHistory.reduce(
    (max, curr) => (curr.xpGained > max.xpGained ? curr : max),
    xpHistory[0] || { xpGained: 0, date: 'N/A' }
  );

  return (
    <div className="bg-[#121626] border border-[#232b47] rounded-lg p-5 relative overflow-hidden shadow-lg">
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232b47] pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-300 tracking-wider uppercase flex items-center gap-2">
              <span>7-Day Orbital XP Growth</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono normal-case">
                Live Telemetry
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Commander velocity logged across the unbroken 7-day streak
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-[#0b0d17] border border-[#232b47] rounded p-0.5 text-xs self-start sm:self-auto font-mono">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-2.5 py-1 rounded transition-colors ${
              viewMode === 'daily'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/80 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daily Velocity
          </button>
          <button
            onClick={() => setViewMode('cumulative')}
            className={`px-2.5 py-1 rounded transition-colors ${
              viewMode === 'cumulative'
                ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-800/80 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cumulative XP
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 text-xs font-mono">
        <div className="bg-[#0b0d17] p-2.5 rounded border border-[#232b47]">
          <div className="text-slate-400 text-[10px] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>7-Day Total</span>
          </div>
          <div className="text-amber-300 font-bold text-sm mt-0.5">
            {totalXp} XP
          </div>
        </div>

        <div className="bg-[#0b0d17] p-2.5 rounded border border-[#232b47]">
          <div className="text-slate-400 text-[10px] flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Daily Velocity</span>
          </div>
          <div className="text-cyan-300 font-bold text-sm mt-0.5">
            ~{avgDailyXp} XP/day
          </div>
        </div>

        <div className="bg-[#0b0d17] p-2.5 rounded border border-[#232b47]">
          <div className="text-slate-400 text-[10px] flex items-center gap-1">
            <Calendar className="w-3 h-3 text-indigo-400" />
            <span>Peak Orbit</span>
          </div>
          <div className="text-indigo-300 font-bold text-xs mt-0.5 truncate">
            {peakDay.date} (+{peakDay.xpGained} XP)
          </div>
        </div>

        <div className="bg-[#0b0d17] p-2.5 rounded border border-[#232b47]">
          <div className="text-slate-400 text-[10px]">Active Streak</div>
          <div className="text-emerald-400 font-bold text-sm mt-0.5 flex items-center gap-1">
            <span>🔥</span>
            <span>7 Days</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="w-full h-56 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={xpHistory}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#232b47"
              vertical={false}
              opacity={0.7}
            />
            <XAxis
              dataKey="dayLabel"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={{ stroke: '#232b47' }}
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
            />
            <YAxis
              stroke="#94a3b8"
              tickLine={false}
              axisLine={{ stroke: '#232b47' }}
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              width={35}
            />
            <Tooltip
              cursor={{ fill: 'rgba(6, 182, 212, 0.08)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as DailyXpRecord;
                  return (
                    <div className="bg-[#0b0d17] border border-cyan-500/70 rounded-lg p-3 shadow-2xl text-xs font-mono space-y-1.5 z-50">
                      <div className="flex items-center justify-between gap-3 border-b border-[#232b47] pb-1">
                        <span className="font-bold text-cyan-300">
                          {data.date} ({data.dayLabel})
                        </span>
                        {data.dayLabel === 'Today' && (
                          <span className="text-[10px] px-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
                            Current Cycle
                          </span>
                        )}
                      </div>
                      <div className="text-slate-200 flex justify-between gap-4">
                        <span className="text-slate-400">XP Earned:</span>
                        <span className="text-amber-400 font-bold">+{data.xpGained} XP</span>
                      </div>
                      <div className="text-slate-200 flex justify-between gap-4">
                        <span className="text-slate-400">Cumulative:</span>
                        <span className="text-indigo-300 font-bold">{data.cumulativeXp} XP</span>
                      </div>
                      <div className="text-slate-400 flex justify-between gap-4 text-[10px] pt-1 border-t border-[#232b47]">
                        <span>Tasks Completed:</span>
                        <span className="text-emerald-400 font-bold">{data.tasksCompleted}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey={viewMode === 'daily' ? 'xpGained' : 'cumulativeXp'}
              radius={[4, 4, 0, 0]}
              animationDuration={800}
            >
              {xpHistory.map((entry, index) => {
                const isToday = entry.dayLabel === 'Today';
                // Distinct gradient colors: Today glows gold/amber, past days are vibrant cosmic cyan/indigo
                let fillColor = '#06b6d4';
                if (isToday) {
                  fillColor = '#fbbf24'; // Gold highlight for today
                } else if (viewMode === 'cumulative') {
                  fillColor = '#6366f1'; // Indigo for cumulative growth
                }
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={fillColor}
                    fillOpacity={isToday ? 0.95 : 0.75 + (index * 0.03)}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend / Footer note */}
      <div className="mt-3 pt-2.5 border-t border-[#232b47]/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 inline-block" />
            <span>Past Orbit Cycles</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" />
            <span>Today's Orbital Gain</span>
          </div>
        </div>
        <span className="text-slate-500">
          *Logging work or completing missions updates velocity live.
        </span>
      </div>
    </div>
  );
};
