import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RegistrationForm } from './components/RegistrationForm';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { initialDoctors } from './data/sampleDoctors';
import { DoctorProfile } from './types';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>(initialDoctors);
  const [verifiedDoctor, setVerifiedDoctor] = useState<DoctorProfile | null>(null);

  // Handle new registration or instant authentication success
  const handleRegisterSuccess = (doc: DoctorProfile) => {
    setDoctors((prev) => {
      const exists = prev.some((d) => d.id === doc.id);
      return exists ? prev : [doc, ...prev];
    });
    setVerifiedDoctor(doc);
  };

  const verifiedCount = doctors.filter((d) => d.status === 'VERIFIED').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar 
        verifiedCount={verifiedCount} 
        activeDoctor={verifiedDoctor}
        allDoctors={doctors}
        onLogout={() => setVerifiedDoctor(null)}
        onSelectDoctor={(doc) => setVerifiedDoctor(doc)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {verifiedDoctor ? (
          <ProfessionalDashboard
            doctor={verifiedDoctor}
            onNewSubmission={() => setVerifiedDoctor(null)}
          />
        ) : (
          <RegistrationForm onRegisterSuccess={handleRegisterSuccess} />
        )}
      </main>

      {/* Global Footer (shown on auth portal page) */}
      {!verifiedDoctor && (
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-white text-sm">Doctor or Physician Portal</span>
              <span className="text-slate-500">•</span>
              <span>Credentials Authentication Gateway</span>
            </div>

            <p className="text-slate-500">
              Official NPI, Medical Council & License Verification System.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
