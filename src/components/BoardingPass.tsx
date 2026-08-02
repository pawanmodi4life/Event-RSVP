import React, { useEffect, useRef, useState } from 'react';
import { Guest } from '../types';
import QRCode from 'qrcode';
import { Anchor, Printer, Calendar, CheckCircle2, MapPin, ShieldCheck, Mail, Send, Sparkles } from 'lucide-react';

interface BoardingPassProps {
  guest: Guest;
  onEditRsvp: () => void;
}

export const BoardingPass: React.FC<BoardingPassProps> = ({ guest, onEditRsvp }) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const passCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Generate actual scannable QR code containing JSON verification payload
    const qrData = JSON.stringify({
      org: 'The Shipping Corporation of India Ltd.',
      event: '65th Foundation Day',
      passCode: guest.passCode,
      name: guest.name,
      deck: guest.deck,
      gate: guest.gate,
      plusOne: guest.plusOne,
      dietary: guest.dietaryPreference,
      verified: true,
    });

    QRCode.toDataURL(qrData, {
      width: 200,
      margin: 1,
      color: {
        dark: '#003366',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error('QR generation error:', err));
  }, [guest]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `⚓ *THE SHIPPING CORPORATION OF INDIA LTD.* - 65th Foundation Day Digital Boarding Pass\n\n` +
      `👤 *Guest Name:* ${guest.name}\n` +
      `🎫 *Pass ID:* ${guest.passCode}\n` +
      `📍 *Venue:* NCPA, Nariman Point, Mumbai\n` +
      `📅 *Date:* 02 October 2026\n` +
      `🚢 *Deck:* ${guest.deck}\n` +
      `🎟️ *Seat:* ${guest.seat}\n` +
      `🚪 *Gate:* ${guest.gate}\n` +
      `${guest.plusOne ? `👥 *Accompanying Guest:* ${guest.plusOneName || 'Included'}\n` : ''}` +
      `\nPlease present this digital QR boarding pass at the gate for entry.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    showToast('WhatsApp invite template ready for sharing!');
  };

  const handleEmailSimulation = () => {
    showToast(`Boarding Pass dispatched to ${guest.email} via SCI Automated Mailer!`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#c5a059] text-[#001b3a] px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-[#d6b16a] animate-bounce">
          <Sparkles className="w-4 h-4 text-[#001b3a]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="bg-[#003366]/40 border border-[#c5a059]/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#c5a059] font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold uppercase tracking-wider">Official Non-Transferable Boarding Pass</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-[#001b3a] hover:bg-[#002244] text-slate-200 border border-white/10 rounded-xl transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="hidden sm:inline">Print Pass</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="px-3.5 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 rounded-xl transition flex items-center gap-1.5 font-medium"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleEmailSimulation}
            className="px-3.5 py-2 bg-[#003366] hover:bg-[#002244] text-white border border-[#c5a059]/30 rounded-xl transition flex items-center gap-1.5 font-medium"
          >
            <Mail className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="hidden sm:inline">Email Pass</span>
          </button>
        </div>
      </div>

      {/* Main Boarding Pass Card Container */}
      <div className="w-full">
        <div
          ref={passCardRef}
          className="bg-white text-slate-800 rounded-[32px] shadow-2xl shadow-[#003366]/40 border border-[#c5a059]/40 overflow-hidden print:border-slate-900 print:text-black"
        >
          {/* Top Metallic Header */}
          <div className="bg-[#003366] px-6 py-4 text-white flex flex-col sm:flex-row items-center justify-between gap-3 font-serif border-b-2 border-[#c5a059]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#001b3a] text-[#c5a059] rounded-full flex items-center justify-center border border-[#c5a059]/40 shadow-md">
                <Anchor className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] font-mono uppercase font-bold text-[#c5a059]">
                  BOARDING PASS • 65th FOUNDATION DAY
                </p>
                <h2 className="text-base sm:text-lg font-bold tracking-tight uppercase">
                  THE SHIPPING CORPORATION OF INDIA LTD.
                </h2>
              </div>
            </div>

            <div className="bg-[#c5a059] text-[#001b3a] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase shadow-md">
              PASS #{guest.passCode}
            </div>
          </div>

          {/* Main Pass Details Layout */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Left 2 Columns: Passenger & Voyage Meta */}
            <div className="md:col-span-2 space-y-6 relative z-10 border-b md:border-b-0 md:border-r border-slate-200 md:pr-6 pb-6 md:pb-0">
              {/* Passenger Profile */}
              <div>
                <p className="text-[10px] uppercase font-mono tracking-widest text-[#c5a059] font-bold mb-1">
                  DISTINGUISHED GUEST
                </p>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#003366]">
                  {guest.name}
                </h1>
                {guest.designation && (
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    {guest.designation} {guest.organization ? `• ${guest.organization}` : ''}
                  </p>
                )}
                <span className="inline-block mt-2 px-2.5 py-1 bg-[#003366]/10 border border-[#003366]/20 text-[#003366] text-[11px] font-mono font-bold rounded-lg">
                  {guest.category}
                </span>
              </div>

              {/* Voyage Seating & Deck Allocation */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">SEATING DECK</p>
                  <p className="text-xs sm:text-sm font-bold text-[#003366]">{guest.deck}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">SEAT / CABIN</p>
                  <p className="text-xs sm:text-sm font-bold text-[#003366]">{guest.seat}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">GATE</p>
                  <p className="text-xs sm:text-sm font-bold text-[#003366]">{guest.gate}</p>
                </div>
              </div>

              {/* Event Schedule & Location Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#003366]">02 October 2026 (Friday)</p>
                    <p className="text-slate-500 text-[11px]">17:30 IST Entry</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#003366]">NCPA, Nariman Point, Mumbai</p>
                    <p className="text-slate-500 text-[11px]">Jamshed Bhabha Theatre</p>
                  </div>
                </div>
              </div>

              {/* Plus One & Dietary Specs */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px]">
                {guest.plusOne && (
                  <div className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Plus One: <strong>{guest.plusOneName || 'Included'}</strong></span>
                  </div>
                )}

                <div className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg font-medium">
                  Meal: <strong>{guest.dietaryPreference}</strong>
                </div>

                {guest.specialAssistance && (
                  <div className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg font-medium">
                    ♿ Wheelchair Assistance Requested
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Scannable Security QR Pass */}
            <div className="flex flex-col items-center justify-center text-center space-y-3 relative z-10 bg-slate-50 p-4 rounded-2xl md:bg-transparent md:p-0">
              <div className="bg-white p-3 rounded-2xl shadow-lg border-2 border-[#c5a059]">
                {qrUrl ? (
                  <img src={qrUrl} alt="Boarding Pass QR" className="w-36 h-36 sm:w-40 sm:h-40 block" />
                ) : (
                  <div className="w-36 h-36 bg-slate-200 animate-pulse rounded-lg" />
                )}
              </div>

              <div>
                <p className="text-[10px] font-mono tracking-widest text-[#c5a059] uppercase font-bold">
                  SECURE QR CODE
                </p>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  Present at Entry Gate
                </p>
              </div>

              {/* Simulated Barcode */}
              <div className="w-full pt-2">
                <div className="h-8 bg-[#003366] rounded-md p-1 flex items-center justify-center gap-1 overflow-hidden">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-full bg-[#c5a059]"
                      style={{ width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1)}px` }}
                    />
                  ))}
                </div>
                <p className="text-[9px] font-mono text-slate-400 mt-1 uppercase tracking-widest font-bold">
                  SCI-65-2026-MUMBAI-VERIFIED
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Footer Ribbon */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[#c5a059] font-bold">MOTTO:</span>
              <span className="italic font-serif text-[#003366] font-semibold">"One Voyage. One Legacy. One Future."</span>
            </div>

            <button
              onClick={onEditRsvp}
              className="text-[#003366] hover:text-[#001b3a] underline font-bold transition"
            >
              Modify RSVP Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

