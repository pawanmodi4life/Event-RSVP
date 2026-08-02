import React from 'react';
import { Anchor, Ticket, Compass } from 'lucide-react';

export type ActiveTab = 'invitation' | 'boarding-pass';

interface HeaderNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  hasConfirmedPass: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onTabChange,
  hasConfirmedPass,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#001b3a]/90 backdrop-blur-md border-b border-[#c5a059]/30 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* SCI Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('invitation')}>
          <div className="w-10 h-10 bg-[#003366] rounded-full flex items-center justify-center border border-[#c5a059]/40 shadow-lg">
            <Anchor className="w-5 h-5 text-[#c5a059]" />
          </div>
          <div>
            <span className="text-[10px] tracking-[0.2em] font-mono text-[#c5a059] uppercase font-bold block">
              SCI 65th FOUNDATION DAY
            </span>
            <span className="text-sm font-serif font-bold text-slate-100 tracking-wide">
              The Shipping Corporation of India Ltd.
            </span>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <nav className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
          <button
            onClick={() => onTabChange('invitation')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'invitation'
                ? 'bg-[#c5a059] text-[#001b3a] shadow-md font-bold'
                : 'bg-[#003366]/60 text-slate-200 hover:text-[#c5a059] border border-white/10'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>RSVP Registration</span>
          </button>

          <button
            onClick={() => onTabChange('boarding-pass')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'boarding-pass'
                ? 'bg-[#c5a059] text-[#001b3a] shadow-md font-bold'
                : 'bg-[#003366]/60 text-slate-200 hover:text-[#c5a059] border border-white/10'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Boarding Pass</span>
            {hasConfirmedPass && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

