import React from 'react';
import { EVENT_SCHEDULE, SCI_MILESTONES } from '../data/initialData';
import { Clock, MapPin, Landmark, Car, ExternalLink, Award, Navigation } from 'lucide-react';

export const ScheduleAndVenue: React.FC = () => {
  return (
    <div className="w-full space-y-10">
      {/* Event Schedule Section */}
      <div className="bg-[#003366]/40 border border-[#c5a059]/30 rounded-[32px] p-6 sm:p-10 space-y-6 shadow-2xl backdrop-blur-md">
        <div className="border-b border-[#c5a059]/30 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase font-mono tracking-widest text-[#c5a059] font-bold">Official Agenda</p>
            <h2 className="text-2xl font-serif font-bold text-white">65th Foundation Day Event Timeline</h2>
          </div>
          <div className="px-3.5 py-1.5 bg-[#c5a059] text-[#001b3a] rounded-full text-xs font-mono font-bold">
            Friday, 02 October 2026
          </div>
        </div>

        {/* Chronological Agenda Timeline */}
        <div className="space-y-4">
          {EVENT_SCHEDULE.map((item, index) => (
            <div
              key={index}
              className={`p-5 rounded-2xl border transition ${
                item.highlight
                  ? 'bg-gradient-to-r from-[#003366]/80 to-[#001b3a]/90 border-[#c5a059] shadow-lg'
                  : 'bg-[#001b3a]/60 border-white/10 hover:border-[#c5a059]/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-[#c5a059] font-mono text-xs font-bold">
                  <Clock className="w-4 h-4 text-[#c5a059] shrink-0" />
                  <span>{item.time}</span>
                  {item.highlight && (
                    <span className="px-2.5 py-0.5 bg-[#c5a059] text-[#001b3a] text-[10px] font-bold uppercase rounded-full">
                      Key Highlight
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>{item.location}</span>
                </div>
              </div>

              <h3 className="text-base font-serif font-bold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-slate-200 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* NCPA Venue & Directions Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#003366]/40 border border-[#c5a059]/30 rounded-[32px] p-6 sm:p-8 space-y-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="w-10 h-10 bg-[#001b3a] border border-[#c5a059]/40 text-[#c5a059] rounded-xl flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-[#c5a059] uppercase font-bold">Venue Destination</p>
              <h3 className="text-lg font-serif font-bold text-white">NCPA, Nariman Point, Mumbai</h3>
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            National Centre for the Performing Arts (NCPA), NCPA Marg, Nariman Point, Mumbai, Maharashtra 400021.
            Overlooking Marine Drive and the Arabian Sea.
          </p>

          <div className="space-y-3 text-xs pt-2">
            <div className="flex items-start gap-2.5 text-slate-200">
              <Car className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
              <span><strong>Valet Parking:</strong> Available at Gate 1 (NCPA Plaza Entrance) for all invited guests.</span>
            </div>

            <div className="flex items-start gap-2.5 text-slate-200">
              <Navigation className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
              <span><strong>Landmark:</strong> Adjacent to Air India Building & Trident Hotel, Nariman Point.</span>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="https://maps.google.com/?q=NCPA+Nariman+Point+Mumbai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#001b3a] hover:bg-[#002244] text-[#c5a059] border border-[#c5a059]/40 rounded-xl text-xs font-bold transition"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 65 Years Heritage Milestones */}
        <div className="bg-[#003366]/40 border border-[#c5a059]/30 rounded-[32px] p-6 sm:p-8 space-y-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="w-10 h-10 bg-[#001b3a] border border-[#c5a059]/40 text-[#c5a059] rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-[#c5a059] uppercase font-bold">Maritime Heritage</p>
              <h3 className="text-lg font-serif font-bold text-white">65 Years of Moving India</h3>
            </div>
          </div>

          <div className="space-y-3">
            {SCI_MILESTONES.map((m, i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <span className="font-mono font-bold text-[#c5a059] bg-[#001b3a] px-2.5 py-1 rounded-lg border border-[#c5a059]/30 shrink-0">
                  {m.year}
                </span>
                <div>
                  <p className="font-bold text-white">{m.title}</p>
                  <p className="text-[11px] text-slate-300">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

