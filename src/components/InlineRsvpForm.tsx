import React, { useState } from 'react';
import { Guest, GuestCategory, DeckClass } from '../types';
import { Anchor, Sparkles, Check, User, Mail, Phone, Building, ShieldCheck, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';

interface InlineRsvpFormProps {
  currentGuest: Guest;
  onSaveRsvp: (updatedGuest: Guest) => void;
}

export const InlineRsvpForm: React.FC<InlineRsvpFormProps> = ({
  currentGuest,
  onSaveRsvp,
}) => {
  const [formData, setFormData] = useState<Partial<Guest>>({
    name: currentGuest.name || '',
    designation: currentGuest.designation || '',
    organization: currentGuest.organization || '',
    email: currentGuest.email || '',
    phone: currentGuest.phone || '',
    category: currentGuest.category || 'VVIP / Dignitary',
    plusOne: currentGuest.plusOne || false,
    plusOneName: currentGuest.plusOneName || '',
    deck: currentGuest.deck || 'Admiral Suite',
    dietaryPreference: currentGuest.dietaryPreference || 'Non-Veg',
    specialAssistance: currentGuest.specialAssistance || false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger Gold/Navy Confetti Celebration
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#c5a059', '#003366', '#001b3a', '#ffffff'],
    });

    const updatedGuest: Guest = {
      ...currentGuest,
      name: formData.name || 'Honored Guest',
      designation: formData.designation || 'Dignitary',
      organization: formData.organization || 'Maritime Sector',
      email: formData.email || 'guest@sci.co.in',
      phone: formData.phone || '+91 98765 43210',
      category: (formData.category as GuestCategory) || 'VVIP / Dignitary',
      plusOne: formData.plusOne || false,
      plusOneName: formData.plusOne ? formData.plusOneName : '',
      deck: (formData.deck as DeckClass) || 'Admiral Suite',
      dietaryPreference: formData.dietaryPreference || 'Non-Veg',
      specialAssistance: formData.specialAssistance || false,
      rsvpStatus: 'Confirmed',
    };

    setSubmitted(true);
    setTimeout(() => {
      onSaveRsvp(updatedGuest);
    }, 600);
  };

  return (
    <div className="w-full bg-white text-slate-800 rounded-[32px] shadow-2xl shadow-[#003366]/30 border border-[#c5a059]/40 overflow-hidden">
      {/* Gold Header Bar */}
      <div className="bg-[#003366] px-6 py-5 border-b-2 border-[#c5a059] flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#001b3a] text-[#c5a059] rounded-xl flex items-center justify-center border border-[#c5a059]/40 shadow-md">
            <Anchor className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-[0.2em] font-bold text-[#c5a059] uppercase block">
              USER END RSVP FORM
            </span>
            <h3 className="text-base font-serif font-bold text-white tracking-wide">
              Fill Attendance Details to Generate Boarding Pass
            </h3>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#c5a059] text-[#001b3a] rounded-full text-xs font-mono font-bold uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>INSTANT PASS GENERATOR</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-[#003366]/10 text-[#003366] rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Please fill out your official registration details below. Upon submitting, your verified <strong className="text-[#003366]">SCI 65th Foundation Day Digital Boarding Pass</strong> will be issued immediately with seat allocation and scannable QR code.
          </p>
        </div>

        {/* Form Fields Grid */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#003366] font-bold mb-1.5">
              Full Name (As on Boarding Pass) *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Capt. Rajesh Sharma"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366]"
              />
            </div>
          </div>

          {/* Designation & Organization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#003366] font-bold mb-1.5">
                Designation / Title
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Director General / Chief Engineer"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#003366]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#003366] font-bold mb-1.5">
                Organization / Ministry
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g. Ministry of Ports, Shipping & Waterways"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#003366]"
                />
              </div>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#003366] font-bold mb-1.5">
                Email Address (For Pass Copy) *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rajesh.sharma@sci.co.in"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#003366]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#003366] font-bold mb-1.5">
                WhatsApp Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#003366]"
                />
              </div>
            </div>
          </div>

          {/* Guest Category & Deck Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#003366] font-bold mb-1.5">
                Guest Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as GuestCategory })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#003366]"
              >
                <option value="VVIP / Dignitary">VVIP / Dignitary</option>
                <option value="Fleet Officer / Alumni">Fleet Officer / Alumni</option>
                <option value="Corporate Partner">Corporate Partner</option>
                <option value="Media & Press">Media & Press</option>
                <option value="Special Guest">Special Guest</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#003366] font-bold mb-1.5">
                Deck & Seating Class
              </label>
              <select
                value={formData.deck}
                onChange={(e) => setFormData({ ...formData, deck: e.target.value as DeckClass })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#003366]"
              >
                <option value="Admiral Suite">Admiral Suite (VVIP & Ministry)</option>
                <option value="Naval Officer Lounge">Naval Officer Lounge (Mariners & Alumni)</option>
                <option value="Horizon Executive Deck">Horizon Executive Deck (Corporate & Press)</option>
                <option value="Maritime Pavilion">Maritime Pavilion (General Guest Pavilion)</option>
              </select>
            </div>
          </div>

          {/* Plus One Checkbox */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.plusOne}
                onChange={(e) => setFormData({ ...formData, plusOne: e.target.checked })}
                className="w-4 h-4 accent-[#003366] rounded cursor-pointer"
              />
              <span className="text-sm font-semibold text-[#003366]">
                Accompanying Spouse / Plus One (+1 Guest Pass)
              </span>
            </label>

            {formData.plusOne && (
              <div className="pt-1">
                <label className="block text-xs font-mono text-slate-500 mb-1">
                  Spouse / Accompanying Guest Full Name
                </label>
                <input
                  type="text"
                  value={formData.plusOneName || ''}
                  onChange={(e) => setFormData({ ...formData, plusOneName: e.target.value })}
                  placeholder="e.g. Mrs. Sunita Sharma"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#003366]"
                />
              </div>
            )}
          </div>

          {/* Gala Dinner Preference */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#003366] font-bold mb-1.5">
              Gala Dinner Dietary Requirement
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Non-Veg', 'Vegetarian', 'Jain Veg', 'Vegan'].map((diet) => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => setFormData({ ...formData, dietaryPreference: diet })}
                  className={`py-2.5 px-3 text-xs rounded-xl border font-bold transition ${
                    formData.dietaryPreference === diet
                      ? 'bg-[#003366] text-white border-[#003366] shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#003366]/40'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <input
              type="checkbox"
              checked={formData.specialAssistance}
              onChange={(e) => setFormData({ ...formData, specialAssistance: e.target.checked })}
              className="w-4 h-4 accent-[#003366] rounded cursor-pointer"
            />
            <span className="text-xs text-slate-700 font-medium">
              Request Wheelchair / Accessibility assistance at NCPA Gate
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitted}
            className="w-full py-4 bg-[#003366] hover:bg-[#002244] text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-[#003366]/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
          >
            <Ticket className="w-4 h-4 text-[#c5a059]" />
            <span>{submitted ? 'Generating Boarding Pass...' : 'Submit RSVP & Generate Boarding Pass'}</span>
            <Sparkles className="w-4 h-4 text-[#c5a059] group-hover:scale-125 transition transform" />
          </button>
        </div>
      </form>
    </div>
  );
};
