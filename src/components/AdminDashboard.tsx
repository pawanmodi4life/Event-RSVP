import React, { useState } from 'react';
import { Guest } from '../types';
import { QrCode, Search, CheckCircle2, XCircle, Download, ShieldCheck } from 'lucide-react';

interface AdminDashboardProps {
  guests: Guest[];
  onCheckInGuest: (guestId: string) => void;
  onAddGuest: (newGuest: Guest) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  guests,
  onCheckInGuest,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'CheckedIn' | 'Pending'>('All');
  const [scanInputCode, setScanInputCode] = useState('');
  const [lastScannedResult, setLastScannedResult] = useState<{ success: boolean; guest?: Guest; msg: string } | null>(null);

  // Stats calculation
  const totalInvites = guests.length;
  const confirmedRsvps = guests.filter((g) => g.rsvpStatus === 'Confirmed').length;
  const checkedInCount = guests.filter((g) => g.checkedIn).length;
  const totalPlusOnes = guests.filter((g) => g.plusOne && g.rsvpStatus === 'Confirmed').length;

  // Filtered guest list
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.passCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.organization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || g.category === categoryFilter;

    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'CheckedIn'
        ? g.checkedIn
        : !g.checkedIn;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle Manual/Simulated Scanner Submit
  const handleSimulatedScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInputCode.trim()) return;

    const code = scanInputCode.trim().toUpperCase();
    const found = guests.find(
      (g) => g.passCode.toUpperCase() === code || g.id.toUpperCase() === code
    );

    if (found) {
      if (!found.checkedIn) {
        onCheckInGuest(found.id);
        setLastScannedResult({
          success: true,
          guest: found,
          msg: `VERIFIED & CHECKED-IN: ${found.name} (${found.deck})`,
        });
      } else {
        setLastScannedResult({
          success: true,
          guest: found,
          msg: `ALREADY CHECKED-IN AT ${found.checkInTime || 'Earlier'}: ${found.name}`,
        });
      }
    } else {
      setLastScannedResult({
        success: false,
        msg: `INVALID PASS CODE: "${code}" - No guest record found.`,
      });
    }

    setScanInputCode('');
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = ['Pass Code', 'Name', 'Designation', 'Organization', 'Category', 'Deck', 'Seat', 'Plus One', 'Dietary', 'RSVP Status', 'Checked In', 'Check-In Time'];
    const rows = guests.map((g) => [
      g.passCode,
      `"${g.name}"`,
      `"${g.designation}"`,
      `"${g.organization}"`,
      g.category,
      g.deck,
      g.seat,
      g.plusOne ? `Yes (${g.plusOneName || ''})` : 'No',
      g.dietaryPreference,
      g.rsvpStatus,
      g.checkedIn ? 'Yes' : 'No',
      g.checkInTime || 'N/A',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SCI_65th_Guest_CheckIn_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Badge */}
      <div className="bg-[#003366]/40 border border-[#c5a059]/30 rounded-[28px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#001b3a] border border-[#c5a059]/40 text-[#c5a059] rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono tracking-widest text-[#c5a059] font-bold">NCPA Registration Console</p>
            <h2 className="text-lg font-serif font-bold text-white">
              65th Foundation Day Guest Check-In & Admin Console
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 bg-[#001b3a] hover:bg-[#002244] text-[#c5a059] border border-[#c5a059]/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Real-time Attendance Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#003366]/40 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
          <p className="text-xs text-slate-300 font-mono uppercase">Total Invites Issued</p>
          <p className="text-2xl font-bold font-mono text-[#c5a059] mt-1">{totalInvites}</p>
          <p className="text-[11px] text-slate-400 mt-1">Expected Attendees</p>
        </div>

        <div className="bg-[#003366]/40 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
          <p className="text-xs text-slate-300 font-mono uppercase">Confirmed RSVPs</p>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{confirmedRsvps}</p>
          <p className="text-[11px] text-emerald-400/80 mt-1">+{totalPlusOnes} Plus Ones</p>
        </div>

        <div className="bg-[#003366]/60 border border-[#c5a059]/40 p-4 rounded-2xl backdrop-blur-md">
          <p className="text-xs text-[#c5a059] font-mono uppercase font-bold">NCPA Desk Check-Ins</p>
          <p className="text-2xl font-bold font-mono text-white mt-1">
            {checkedInCount} <span className="text-xs text-slate-300">/ {confirmedRsvps}</span>
          </p>
          <p className="text-[11px] text-[#c5a059] mt-1">
            {confirmedRsvps > 0 ? `${Math.round((checkedInCount / confirmedRsvps) * 100)}% checked-in` : '0%'}
          </p>
        </div>

        <div className="bg-[#003366]/40 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
          <p className="text-xs text-slate-300 font-mono uppercase">Pending Check-Ins</p>
          <p className="text-2xl font-bold font-mono text-blue-300 mt-1">
            {confirmedRsvps - checkedInCount}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting Gate Arrival</p>
        </div>
      </div>

      {/* Registration Scanner Input Tool */}
      <div className="bg-[#003366]/40 border border-[#c5a059]/30 rounded-[28px] p-6 space-y-4 backdrop-blur-md">
        <div className="flex items-center gap-2 text-[#c5a059] font-mono text-xs uppercase font-bold">
          <QrCode className="w-4 h-4 text-[#c5a059]" />
          <span>Simulate Boarding Pass QR Scanner at Desk</span>
        </div>

        <form onSubmit={handleSimulatedScan} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={scanInputCode}
              onChange={(e) => setScanInputCode(e.target.value)}
              placeholder="Scan or type Pass Code (e.g. SCI-65-MUM-1001)..."
              className="w-full bg-[#001b3a] border border-[#c5a059]/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059] font-mono"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-[#c5a059] hover:bg-[#d6b16a] text-[#001b3a] font-bold text-xs uppercase tracking-wider rounded-xl transition shrink-0"
          >
            Verify Pass
          </button>
        </form>

        {/* Scan Result Feedback */}
        {lastScannedResult && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs font-mono ${
              lastScannedResult.success
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {lastScannedResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <span>{lastScannedResult.msg}</span>
            </div>

            <button
              onClick={() => setLastScannedResult(null)}
              className="text-slate-300 hover:text-white text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Guest Directory & Filters */}
      <div className="bg-[#003366]/40 border border-[#c5a059]/30 rounded-[28px] p-6 space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
            <span>Guest Directory</span>
            <span className="text-xs font-mono font-bold text-[#001b3a] bg-[#c5a059] px-2.5 py-0.5 rounded-full">
              {filteredGuests.length} Guests
            </span>
          </h3>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, code, org..."
                className="w-full bg-[#001b3a] border border-[#c5a059]/40 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#001b3a] border border-[#c5a059]/40 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
            >
              <option value="All" className="bg-[#001b3a] text-white">All Categories</option>
              <option value="VVIP / Dignitary" className="bg-[#001b3a] text-white">VVIP / Dignitary</option>
              <option value="Fleet Officer / Alumni" className="bg-[#001b3a] text-white">Fleet Officer / Alumni</option>
              <option value="Corporate Partner" className="bg-[#001b3a] text-white">Corporate Partner</option>
              <option value="Media & Press" className="bg-[#001b3a] text-white">Media & Press</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'All' | 'CheckedIn' | 'Pending')}
              className="bg-[#001b3a] border border-[#c5a059]/40 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
            >
              <option value="All" className="bg-[#001b3a] text-white">All Gate Status</option>
              <option value="CheckedIn" className="bg-[#001b3a] text-white">Checked-In Only</option>
              <option value="Pending" className="bg-[#001b3a] text-white">Awaiting Check-In</option>
            </select>
          </div>
        </div>

        {/* Guest Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[#c5a059] font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Pass ID</th>
                <th className="py-3 px-3">Guest Name</th>
                <th className="py-3 px-3">Deck & Seat</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Plus One</th>
                <th className="py-3 px-3">Dietary</th>
                <th className="py-3 px-3 text-right">Check-In Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredGuests.length > 0 ? (
                filteredGuests.map((g) => (
                  <tr key={g.id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-3 font-mono text-[#c5a059] font-bold">{g.passCode}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-white">{g.name}</p>
                      <p className="text-[10px] text-slate-300">{g.designation} {g.organization ? `(${g.organization})` : ''}</p>
                    </td>
                    <td className="py-3 px-3 text-slate-200">
                      <span className="block font-medium">{g.deck}</span>
                      <span className="text-[10px] text-[#c5a059] font-mono">{g.seat}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-[#001b3a] border border-[#c5a059]/30 text-slate-200 rounded text-[10px]">
                        {g.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-200">
                      {g.plusOne ? (
                        <span className="text-emerald-400 font-medium">+1 ({g.plusOneName || 'Included'})</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-200">{g.dietaryPreference}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onCheckInGuest(g.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold font-mono transition ${
                          g.checkedIn
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-[#c5a059] hover:bg-[#d6b16a] text-[#001b3a] shadow'
                        }`}
                      >
                        {g.checkedIn ? '✓ Checked-In' : 'Mark Checked-In'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-mono">
                    No matching guest records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

