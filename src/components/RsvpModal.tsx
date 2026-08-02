import React, { useState } from 'react';
import { Guest, GuestCategory, DeckClass } from '../types';
import { X, Anchor, User, Mail, Phone, Building, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest;
  onSaveRsvp: (updatedGuest: Guest) => void;
}

export const RsvpModal: React.FC<RsvpModalProps> = ({
  isOpen,
  onClose,
  guest,
  onSaveRsvp,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<Guest>({ ...guest });
  const [step, setStep] = useState<1 | 2>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#c5a059', '#003366', '#001b3a', '#FFFFFF'],
    });

    const updated: Guest = {
      ...formData,
      rsvpStatus: 'Confirmed',
    };

    onSaveRsvp(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001b3a]/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#001b3a] border-2 border-[#c5a059]/40 rounded-[32px] shadow-2xl shadow-[#003366]/50 overflow-hidden my-8 text-white">
        {/* Header */}
        <div className="bg-[#003366] border-b border-[#c5a059]/30 p-5 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#001b3a] border border-[#c5a059]/40 text-[#c5a059] rounded-xl flex items-center justify-center">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] tracking-widest text-[#c5a059] font-mono uppercase font-bold">Official RSVP Registration</p>
              <h3 className="text-base font-serif font-bold text-white">SCI 65th Foundation Day Pass</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-[#001b3a]/80 px-6 py-3 border-b border-white/10 flex items-center justify-between text-xs font-mono">
          <span className={step === 1 ? 'text-[#c5a059] font-bold' : 'text-slate-400'}>
            01. Personal & Contact Info
          </span>
          <span className="text-slate-600">•</span>
          <span className={step === 2 ? 'text-[#c5a059] font-bold' : 'text-slate-400'}>
            02. Attendance & Preferences
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#c5a059] font-bold mb-1">
                  Full Name (As on Boarding Pass) *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#003366]/40 border border-[#c5a059]/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#c5a059] font-bold mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Master Mariner / Director"
                    className="w-full bg-[#003366]/40 border border-[#c5a059]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#c5a059] font-bold mb-1">
                    Organization / Ministry
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. INSA / Ministry of Ports"
                      className="w-full bg-[#003366]/40 border border-[#c5a059]/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#c5a059] font-bold mb-1">
                    Email Address (For Pass Delivery) *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#003366]/40 border border-[#c5a059]/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#c5a059] font-bold mb-1">
                    WhatsApp Number (For Instant QR) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#003366]/40 border border-[#c5a059]/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#c5a059] font-bold mb-1">
                  Guest Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as GuestCategory })}
                  className="w-full bg-[#003366]/40 border border-[#c5a059]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                >
                  <option value="VVIP / Dignitary" className="bg-[#001b3a] text-white">VVIP / Dignitary</option>
                  <option value="Fleet Officer / Alumni" className="bg-[#001b3a] text-white">Fleet Officer / Alumni</option>
                  <option value="Corporate Partner" className="bg-[#001b3a] text-white">Corporate Partner</option>
                  <option value="Media & Press" className="bg-[#001b3a] text-white">Media & Press</option>
                  <option value="Special Guest" className="bg-[#001b3a] text-white">Special Guest</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-[#c5a059] hover:bg-[#d6b16a] text-[#001b3a] font-bold text-xs uppercase tracking-wider rounded-xl transition"
                >
                  Next: Preferences →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {/* Plus One Checkbox */}
              <div className="bg-[#003366]/40 p-4 border border-white/10 rounded-xl space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.plusOne}
                    onChange={(e) => setFormData({ ...formData, plusOne: e.target.checked })}
                    className="w-4 h-4 accent-[#c5a059] rounded"
                  />
                  <span className="text-sm font-medium text-slate-100">
                    Accompanying Spouse / Plus One (+1 Guest)
                  </span>
                </label>

                {formData.plusOne && (
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Spouse / Accompanying Guest Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.plusOneName || ''}
                      onChange={(e) => setFormData({ ...formData, plusOneName: e.target.value })}
                      placeholder="e.g. Mrs. Sunita Sharma"
                      className="w-full bg-[#001b3a] border border-[#c5a059]/40 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                )}
              </div>

              {/* Seating / Deck Preference */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#c5a059] font-bold mb-1">
                  Deck & Seating Preference
                </label>
                <select
                  value={formData.deck}
                  onChange={(e) => setFormData({ ...formData, deck: e.target.value as DeckClass })}
                  className="w-full bg-[#003366]/40 border border-[#c5a059]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                >
                  <option value="Naval Officer Lounge" className="bg-[#001b3a] text-white">Naval Officer Lounge (Reserved Mariners)</option>
                  <option value="Horizon Executive Deck" className="bg-[#001b3a] text-white">Horizon Executive Deck (Corporate & Press)</option>
                  <option value="Admiral Suite" className="bg-[#001b3a] text-white">Admiral Suite (VVIP & Government Dignitaries)</option>
                  <option value="Maritime Pavilion" className="bg-[#001b3a] text-white">Maritime Pavilion (General Guest Pavilion)</option>
                </select>
              </div>

              {/* Dietary Requirement */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#c5a059] font-bold mb-1">
                  Gala Dinner Dietary Requirement
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Vegetarian', 'Non-Vegetarian', 'Jain', 'Vegan'] as const).map((diet) => (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => setFormData({ ...formData, dietaryPreference: diet })}
                      className={`p-2.5 text-xs rounded-xl border font-medium transition ${
                        formData.dietaryPreference === diet
                          ? 'bg-[#c5a059] text-[#001b3a] border-[#c5a059] font-bold'
                          : 'bg-[#003366]/40 text-slate-200 border-white/10 hover:border-[#c5a059]/40'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Accessibility Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer bg-[#003366]/40 p-3 border border-white/10 rounded-xl">
                <input
                  type="checkbox"
                  checked={formData.specialAssistance}
                  onChange={(e) => setFormData({ ...formData, specialAssistance: e.target.checked })}
                  className="w-4 h-4 accent-[#c5a059] rounded"
                />
                <span className="text-xs text-slate-200">
                  Request Wheelchair / Special Accessibility assistance at NCPA Entrance
                </span>
              </label>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-xs text-slate-300 hover:text-[#c5a059] transition"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 bg-[#c5a059] hover:bg-[#d6b16a] text-[#001b3a] font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Digital Pass</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

