import React from 'react';
import { ShieldCheck, UserCheck, Cpu, Globe, Github } from 'lucide-react';

interface NavbarProps {
  verifiedCount?: number;
  onOpenProveLocally?: () => void;
  onOpenDeploy?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  verifiedCount = 0,
  onOpenProveLocally,
  onOpenDeploy,
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
          {onOpenProveLocally && (
            <button
              onClick={onOpenProveLocally}
              className="text-emerald-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer bg-emerald-950/80 hover:bg-emerald-900 px-2.5 py-0.5 rounded border border-emerald-700/80 transition-colors"
            >
              <Cpu className="w-3 h-3 text-emerald-400" />
              <span>Prove Me Locally</span>
            </button>
          )}
          {onOpenDeploy && (
            <button
              onClick={onOpenDeploy}
              className="text-blue-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer bg-blue-950/80 hover:bg-blue-900 px-2.5 py-0.5 rounded border border-blue-700/80 transition-colors"
            >
              <Globe className="w-3 h-3 text-blue-400" />
              <span>Deploy to GitHub & Netlify</span>
            </button>
          )}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
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

          <div className="flex items-center gap-2">
            {onOpenProveLocally && (
              <button
                onClick={onOpenProveLocally}
                className="bg-emerald-800 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer border border-emerald-600"
              >
                <Cpu className="w-4 h-4 text-emerald-300" />
                <span className="hidden md:inline">Prove Me Locally</span>
              </button>
            )}
            {onOpenDeploy && (
              <button
                onClick={onOpenDeploy}
                className="bg-blue-900 hover:bg-blue-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer border border-blue-700"
              >
                <Github className="w-4 h-4 text-blue-300" />
                <span className="hidden md:inline">Deploy (GitHub & Netlify)</span>
              </button>
            )}
            <span className="bg-emerald-900/60 text-emerald-300 px-3 py-1 rounded-lg text-xs font-mono border border-emerald-700/50 hidden lg:flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              VERIFICATION ONLINE
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
