import React from 'react';
import { ShieldCheck, UserCheck, LogOut, User, Users } from 'lucide-react';
import { DoctorProfile } from '../types';

interface NavbarProps {
  verifiedCount?: number;
  activeDoctor?: DoctorProfile | null;
  allDoctors?: DoctorProfile[];
  onLogout?: () => void;
  onSelectDoctor?: (doctor: DoctorProfile) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  verifiedCount = 0,
  activeDoctor,
  allDoctors = [],
  onLogout,
  onSelectDoctor,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 px-4 py-1.5 text-xs border-b border-emerald-900/40 flex flex-wrap items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-emerald-300">MedAuth Gateway Active:</span>
          <span>Official Medical Licensing Council & NPI Registry Verification</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span><strong className="text-white">{verifiedCount}</strong> Active Verified Credentials</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-xl shadow-lg shadow-emerald-500/20 text-slate-950">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">Doctor or Physician Portal</span>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-medium border border-emerald-500/20">
                  Official Verification Gateway
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Submit physician credentials, NPI, licenses, and board certifications for instant verification.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeDoctor ? (
              <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
                <div className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs flex items-center gap-2">
                  <div className="p-1 bg-emerald-500 text-slate-950 rounded-lg">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-xs leading-tight">{activeDoctor.fullName}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">NPI: {activeDoctor.npiNumber}</span>
                  </div>
                </div>

                {/* Doctor Switcher Dropdown */}
                {allDoctors.length > 1 && onSelectDoctor && (
                  <select
                    value={activeDoctor.id}
                    onChange={(e) => {
                      const doc = allDoctors.find((d) => d.id === e.target.value);
                      if (doc) onSelectDoctor(doc);
                    }}
                    className="bg-slate-900 text-emerald-300 font-bold border border-slate-700 rounded-xl px-2 py-1.5 text-xs outline-none cursor-pointer hover:border-emerald-500"
                    title="Switch doctor profile"
                  >
                    {allDoctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        Switch: {d.fullName.split(',')[0]}
                      </option>
                    ))}
                  </select>
                )}

                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-rose-500/30 flex items-center gap-1.5"
                    title="Log out of active doctor session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                )}
              </div>
            ) : (
              <span className="bg-emerald-900/60 text-emerald-300 px-3 py-1 rounded-lg text-xs font-mono border border-emerald-700/50 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                VERIFICATION ONLINE
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

