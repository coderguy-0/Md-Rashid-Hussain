import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RegistrationForm } from './components/RegistrationForm';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { initialDoctors } from './data/sampleDoctors';
import { DoctorProfile } from './types';
import { ShieldCheck } from 'lucide-react';

const STORAGE_KEY_DOCTORS = 'medauth_doctors_list_v1';
const STORAGE_KEY_ACTIVE_DOC = 'medauth_active_doctor_v1';

export default function App() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOCTORS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load saved doctors from localStorage', e);
    }
    return initialDoctors;
  });

  const [verifiedDoctor, setVerifiedDoctor] = useState<DoctorProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_DOC);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load active doctor session', e);
    }
    return null;
  });

  // Sync doctors list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DOCTORS, JSON.stringify(doctors));
    } catch (e) {
      console.warn('Failed to save doctors to localStorage', e);
    }
  }, [doctors]);

  // Sync active session to localStorage
  useEffect(() => {
    try {
      if (verifiedDoctor) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_DOC, JSON.stringify(verifiedDoctor));
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE_DOC);
      }
    } catch (e) {
      console.warn('Failed to save active doctor session', e);
    }
  }, [verifiedDoctor]);

  // Handle new registration or instant authentication success
  const handleRegisterSuccess = (doc: DoctorProfile) => {
    setDoctors((prev) => {
      const exists = prev.some((d) => d.id === doc.id);
      const updated = exists 
        ? prev.map((d) => (d.id === doc.id ? doc : d))
        : [doc, ...prev];
      return updated;
    });
    setVerifiedDoctor(doc);
  };

  const handleLogout = () => {
    setVerifiedDoctor(null);
  };

  const verifiedCount = doctors.filter((d) => d.status === 'VERIFIED').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar 
        verifiedCount={verifiedCount} 
        activeDoctor={verifiedDoctor}
        allDoctors={doctors}
        onLogout={handleLogout}
        onSelectDoctor={(doc) => setVerifiedDoctor(doc)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {verifiedDoctor ? (
          <ProfessionalDashboard
            doctor={verifiedDoctor}
            onNewSubmission={handleLogout}
          />
        ) : (
          <RegistrationForm 
            registeredDoctors={doctors}
            onRegisterSuccess={handleRegisterSuccess} 
          />
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
