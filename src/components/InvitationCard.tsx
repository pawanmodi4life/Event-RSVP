import React, { useState, useEffect } from 'react';
import { Guest } from '../types';
import { Calendar, MapPin, Clock, Anchor, Ticket, Sparkles, CheckCircle2, User, ChevronRight, Download } from 'lucide-react';
import { generateIcsFile, getGoogleCalendarLink } from '../utils/icsGenerator';

interface InvitationCardProps {
  currentGuest: Guest;
  onOpenRsvp: () => void;
  onViewBoardingPass: () => void;
  onChangeGuestName: (name: string) => void;
  sampleGuests: Guest[];
  onSelectSampleGuest: (guest: Guest) => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  currentGuest,
  onOpenRsvp,
  onViewBoardingPass,
  onChangeGuestName,
  sampleGuests,
  onSelectSampleGuest,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [customNameInput, setCustomNameInput] = useState(currentGuest.name);

  // Countdown timer calculation to Oct 02, 2026 18:30 IST
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setCustomNameInput(currentGuest.name);
  }, [currentGuest.name]);

  useEffect(() => {
    const eventDate = new Date('2026-10-02T18:30:00+05:30').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (customNameInput.trim()) {
      onChangeGuestName(customNameInput.trim());
      setIsEditingName(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Quick Personalization Toolbar */}
      <div className="bg-[#003366]/40 border border-[#c5a059]/30 rounded-2xl p-4 md:p-5 text-slate-100 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#001b3a] border border-[#c5a059]/40 rounded-xl flex items-center justify-center text-[#c5a059]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#c5a059] font-mono font-bold">Invitation Personalization</p>
              <p className="text-sm font-medium text-slate-100">
                Viewing as: <span className="font-semibold text-white">{currentGuest.name}</span>
                {currentGuest.designation && <span className="text-xs text-slate-300 ml-1.5">({currentGuest.designation})</span>}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Quick Guest Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {sampleGuests.slice(0, 3).map((g) => (
                <button
                  key={g.id}
                  onClick={() => onSelectSampleGuest(g)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition whitespace-nowrap ${
                    g.id === currentGuest.id
                      ? 'bg-[#c5a059] text-[#001b3a] font-bold border-[#c5a059]'
                      : 'bg-[#001b3a]/80 text-slate-200 border-white/10 hover:border-[#c5a059]/50'
                  }`}
                >
                  {g.name.split(' ')[0]} {g.name.split(' ')[1] || ''}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsEditingName(!isEditingName)}
              className="px-3.5 py-1.5 text-xs bg-[#c5a059]/20 hover:bg-[#c5a059]/30 text-[#c5a059] border border-[#c5a059]/40 rounded-lg transition font-medium"
            >
              {isEditingName ? 'Cancel' : 'Change Name'}
            </button>
          </div>
        </div>

        {/* Custom Name Edit Box */}
        {isEditingName && (
          <form onSubmit={handleSaveName} className="mt-4 pt-3 border-t border-white/10 flex items-center gap-3">
            <input
              type="text"
              value={customNameInput}
              onChange={(e) => setCustomNameInput(e.target.value)}
              placeholder="Enter Guest Full Name..."
              className="flex-1 bg-[#001b3a] border border-[#c5a059]/40 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#c5a059]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#c5a059] hover:bg-[#d6b16a] text-[#001b3a] font-bold text-xs rounded-xl transition"
            >
              Update Invite
            </button>
          </form>
        )}
      </div>

      {/* Main Sleek Interface Boarding Pass Card */}
      <div className="relative bg-white text-slate-800 rounded-[32px] sm:rounded-[40px] shadow-2xl shadow-[#003366]/40 ring-1 ring-white/20 overflow-hidden">
        {/* Top Gold Decor Accent Line */}
        <div className="h-2 bg-[#c5a059] w-full" />

        <div className="p-6 sm:p-10 md:p-12 flex flex-col lg:flex-row gap-8 lg:gap-0 relative">
          
          {/* Main Left Invitation Body */}
          <div className="lg:flex-[2.5] lg:pr-10 flex flex-col justify-between space-y-8">
            
            {/* Header: SCI Crest & Organization */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#003366] text-[#c5a059] flex items-center justify-center border border-[#c5a059]/40 shadow-md">
                  <Anchor className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c5a059]" />
                    <span className="text-[11px] font-mono tracking-[0.2em] font-bold text-[#c5a059] uppercase">
                      Official Event Invitation
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-serif font-bold text-[#003366] tracking-wide">
                    THE SHIPPING CORPORATION OF INDIA LTD.
                  </h2>
                </div>
              </div>
              <p className="text-[11px] font-mono uppercase text-slate-500 tracking-wider">
                (A Navratna Government of India Enterprise)
              </p>
            </div>

            {/* Invitation Salutation & Guest Display */}
            <div className="space-y-4">
              <p className="text-xs sm:text-sm font-serif italic text-slate-500">
                cordially invites
              </p>

              <div className="py-3 px-5 bg-slate-50 border-l-4 border-[#c5a059] rounded-r-2xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#003366] tracking-tight">
                  {currentGuest.name}
                </h1>
                {currentGuest.designation && (
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
                    {currentGuest.designation} {currentGuest.organization && `• ${currentGuest.organization}`}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs sm:text-sm font-serif italic text-slate-500">
                  to join us in celebrating
                </p>
                <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#003366] tracking-wide mt-1 uppercase">
                  65th Foundation Day
                </h3>
              </div>
            </div>

            {/* Motto Quote Block */}
            <div className="p-4 bg-[#003366]/5 border border-[#003366]/10 rounded-2xl">
              <p className="text-sm sm:text-base font-serif italic font-semibold text-[#003366] text-center">
                “65 Years of Moving India. Now, Towards New Horizons.”
              </p>
            </div>

            {/* Tagline */}
            <div className="text-center sm:text-left pt-2">
              <p className="text-xs font-mono tracking-[0.2em] text-[#c5a059] font-bold uppercase">
                One Voyage. One Legacy. One Future.
              </p>
            </div>
          </div>

          {/* Perforation Line with Circular Cutouts */}
          <div className="hidden lg:block relative w-0 border-l-2 border-dashed border-slate-200">
            <div className="absolute -top-12 -left-4 w-8 h-8 bg-[#001b3a] rounded-full" />
            <div className="absolute -bottom-12 -left-4 w-8 h-8 bg-[#001b3a] rounded-full" />
          </div>

          {/* Mobile Perforation Horizontal Divider */}
          <div className="lg:hidden relative border-t-2 border-dashed border-slate-200 my-2">
            <div className="absolute -left-10 -top-4 w-8 h-8 bg-[#001b3a] rounded-full" />
            <div className="absolute -right-10 -top-4 w-8 h-8 bg-[#001b3a] rounded-full" />
          </div>

          {/* Right Ticket Stub: Key Details & CTA */}
          <div className="lg:flex-1 lg:pl-10 flex flex-col justify-between bg-slate-50 lg:bg-transparent p-5 lg:p-0 rounded-2xl lg:rounded-none space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Pass Details</span>
                <span className="text-[10px] font-mono font-bold text-[#c5a059] bg-[#c5a059]/10 px-2.5 py-1 rounded-full uppercase">VIP PASS</span>
              </div>

              {/* Meta Fields */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#003366]/10 text-[#003366] rounded-xl">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Date</span>
                    <span className="text-sm font-bold text-[#003366]">02 October 2026</span>
                    <span className="text-[11px] text-slate-500 block">Friday</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#003366]/10 text-[#003366] rounded-xl">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Venue</span>
                    <span className="text-sm font-bold text-[#003366]">NCPA, Mumbai</span>
                    <span className="text-[11px] text-slate-500 block">Nariman Point</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#003366]/10 text-[#003366] rounded-xl">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Time</span>
                    <span className="text-sm font-bold text-[#003366]">18:30 IST</span>
                    <span className="text-[11px] text-slate-500 block">High Tea from 17:30</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="space-y-3 pt-2">
              {currentGuest.rsvpStatus === 'Confirmed' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold text-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ATTENDANCE CONFIRMED</span>
                  </div>
                  <button
                    onClick={onViewBoardingPass}
                    className="w-full py-3.5 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-[#003366]/20 transition flex items-center justify-center gap-2 group"
                  >
                    <Ticket className="w-4 h-4 text-[#c5a059]" />
                    <span>VIEW BOARDING PASS</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenRsvp}
                  className="w-full py-4 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-[#003366]/30 transition flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4 text-[#c5a059]" />
                  <span>CONFIRM YOUR ATTENDANCE</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>
              )}

              {/* Quick Calendar Export */}
              <div className="pt-2 flex flex-col gap-1.5 text-[11px] text-slate-500 font-medium text-center">
                <button
                  onClick={generateIcsFile}
                  className="hover:text-[#003366] underline flex items-center justify-center gap-1 transition"
                >
                  <Download className="w-3 h-3 text-[#c5a059]" /> Download Calendar (.ics)
                </button>
                <a
                  href={getGoogleCalendarLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#003366] underline flex items-center justify-center gap-1 transition"
                >
                  <Calendar className="w-3 h-3 text-[#c5a059]" /> Add to Google Calendar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voyage Countdown Timer */}
      <div className="bg-[#003366]/40 border border-[#c5a059]/30 rounded-2xl p-6 text-center shadow-xl">
        <p className="text-xs uppercase tracking-[0.2em] font-mono text-[#c5a059] font-bold mb-4">
          Voyage Countdown to 02 October 2026 • NCPA Mumbai
        </p>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
          <div className="bg-[#001b3a] border border-[#c5a059]/30 p-3 sm:p-4 rounded-xl">
            <span className="block text-xl sm:text-3xl font-bold font-mono text-[#c5a059]">{timeLeft.days}</span>
            <span className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider font-mono">Days</span>
          </div>
          <div className="bg-[#001b3a] border border-[#c5a059]/30 p-3 sm:p-4 rounded-xl">
            <span className="block text-xl sm:text-3xl font-bold font-mono text-[#c5a059]">{timeLeft.hours}</span>
            <span className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider font-mono">Hours</span>
          </div>
          <div className="bg-[#001b3a] border border-[#c5a059]/30 p-3 sm:p-4 rounded-xl">
            <span className="block text-xl sm:text-3xl font-bold font-mono text-[#c5a059]">{timeLeft.minutes}</span>
            <span className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider font-mono">Mins</span>
          </div>
          <div className="bg-[#001b3a] border border-[#c5a059]/30 p-3 sm:p-4 rounded-xl">
            <span className="block text-xl sm:text-3xl font-bold font-mono text-[#c5a059]">{timeLeft.seconds}</span>
            <span className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider font-mono">Secs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

