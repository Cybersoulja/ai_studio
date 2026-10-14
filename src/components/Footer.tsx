import React from 'react';

interface FooterProps {
  statusBanner: string;
}

export const Footer: React.FC<FooterProps> = ({ statusBanner }) => {
  return (
    <footer className="border-t border-[#232b47] bg-[#0b0d17] text-xs py-2 px-4 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden text-amber-300 font-semibold tracking-wide truncate">
          <span className="text-cyan-400">➤</span>
          <span className="truncate">{statusBanner}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400 text-[11px]">
          <span className="bg-[#121626] border border-[#232b47] px-1.5 py-0.5 rounded text-slate-300 font-mono">
            [1-6] Tabs
          </span>
          <span className="bg-[#121626] border border-[#232b47] px-1.5 py-0.5 rounded text-slate-300 font-mono">
            [C] Check-in
          </span>
          <span className="bg-[#121626] border border-[#232b47] px-1.5 py-0.5 rounded text-slate-300 font-mono">
            [M] Motivation
          </span>
          <span className="bg-[#121626] border border-[#232b47] px-1.5 py-0.5 rounded text-slate-300 font-mono">
            [N] New Mission
          </span>
          <span className="hidden lg:inline text-slate-500">
            • Oneseco Media: Gravity is optional. Delivery is mandatory. 🫡
          </span>
        </div>
      </div>
    </footer>
  );
};
