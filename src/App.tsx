/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Guest } from './types';
import { INITIAL_GUESTS } from './data/initialData';
import { HeaderNav, ActiveTab } from './components/HeaderNav';
import { MaritimeCanvas } from './components/MaritimeCanvas';
import { InlineRsvpForm } from './components/InlineRsvpForm';
import { RsvpModal } from './components/RsvpModal';
import { BoardingPass } from './components/BoardingPass';
import { Anchor } from 'lucide-react';

export default function App() {
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [currentGuestId, setCurrentGuestId] = useState<string>(INITIAL_GUESTS[0].id);
  const [activeTab, setActiveTab] = useState<ActiveTab>('invitation');
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  const currentGuest = guests.find((g) => g.id === currentGuestId) || guests[0];

  // Handle RSVP Submission from inline form or modal
  const handleSaveRsvp = (updatedGuest: Guest) => {
    setGuests((prev) => {
      const exists = prev.some((g) => g.id === updatedGuest.id);
      if (exists) {
        return prev.map((g) => (g.id === updatedGuest.id ? updatedGuest : g));
      }
      return [updatedGuest, ...prev];
    });
    setCurrentGuestId(updatedGuest.id);
    setIsRsvpOpen(false);
    setActiveTab('boarding-pass');
  };

  return (
    <div className="min-h-screen bg-[#001b3a] text-slate-100 font-sans selection:bg-[#c5a059] selection:text-[#001b3a] flex flex-col">
      {/* Header Navigation */}
      <HeaderNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasConfirmedPass={currentGuest.rsvpStatus === 'Confirmed'}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-8">
        {activeTab === 'invitation' && (
          <div className="space-y-8 animate-fade-in">
            {/* Animated Sailing Canvas Hero */}
            <MaritimeCanvas
              onExploreClick={() => {
                const formEl = document.getElementById('user-end-rsvp-section');
                if (formEl) {
                  formEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Direct User End RSVP Form */}
            <div id="user-end-rsvp-section" className="animate-fade-in max-w-3xl mx-auto">
              <InlineRsvpForm
                currentGuest={currentGuest}
                onSaveRsvp={handleSaveRsvp}
              />
            </div>
          </div>
        )}

        {activeTab === 'boarding-pass' && (
          <div className="animate-fade-in py-2">
            <BoardingPass
              guest={currentGuest}
              onEditRsvp={() => {
                setActiveTab('invitation');
              }}
            />
          </div>
        )}
      </main>

      {/* RSVP Modal */}
      <RsvpModal
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        guest={currentGuest}
        onSaveRsvp={handleSaveRsvp}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-[#c5a059]/20 bg-[#001b3a]/90 py-6 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#c5a059] font-serif font-bold">
            <Anchor className="w-4 h-4" />
            <span>THE SHIPPING CORPORATION OF INDIA LTD.</span>
          </div>

          <p className="font-mono text-[11px] text-slate-300">
            65th Foundation Day • 02 October 2026 • NCPA Mumbai
          </p>

          <p className="text-[10px] text-slate-400">
            Soul Communication • Official Event Portal
          </p>
        </div>
      </footer>
    </div>
  );
}

