import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Code, 
  Copy, 
  Check, 
  Info, 
  Sparkles,
  Award,
  Stethoscope,
  X
} from 'lucide-react';
import { DoctorProfile } from '../types';

interface IntegrationPlaygroundProps {
  doctors: DoctorProfile[];
  initialDoctor?: DoctorProfile;
}

export const IntegrationPlayground: React.FC<IntegrationPlaygroundProps> = ({
  doctors,
  initialDoctor,
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile>(
    initialDoctor || doctors[0]
  );

  const [websiteTheme, setWebsiteTheme] = useState<'clinic' | 'telehealth' | 'hospital'>('clinic');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    const code = `<script src="${window.location.origin}/api/v1/physician/widget.js" data-npi="${selectedDoctor.npiNumber}"></script>`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-3">
            <Globe className="w-3.5 h-3.5" />
            External Website Live Sandbox
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            See How MedAuth Integrates into "Your Other Website"
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            This live simulator renders an external clinic, hospital, or telehealth website with your verified physician credentials embedded into the doctor profile card.
          </p>
        </div>

        {/* Playground Controls */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-3 w-full md:w-auto">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Select Physician Badge:</label>
            <select
              value={selectedDoctor.id}
              onChange={(e) => {
                const found = doctors.find((d) => d.id === e.target.value);
                if (found) setSelectedDoctor(found);
              }}
              className="bg-slate-900 text-white border border-slate-700 rounded-lg px-3 py-1.5 text-xs w-full outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fullName} ({d.speciality})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Select "Your Other Website" Template:</label>
            <div className="flex gap-1.5">
              <button
                onClick={() => setWebsiteTheme('clinic')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  websiteTheme === 'clinic' ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400' : 'bg-slate-900 text-slate-300 border-slate-700'
                }`}
              >
                Heart Clinic
              </button>
              <button
                onClick={() => setWebsiteTheme('telehealth')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  websiteTheme === 'telehealth' ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400' : 'bg-slate-900 text-slate-300 border-slate-700'
                }`}
              >
                Telehealth
              </button>
              <button
                onClick={() => setWebsiteTheme('hospital')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  websiteTheme === 'hospital' ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400' : 'bg-slate-900 text-slate-300 border-slate-700'
                }`}
              >
                Hospital Portal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Browser Frame Mockup */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Browser Top Bar */}
        <div className="bg-slate-800 px-4 py-3 flex items-center gap-3 border-b border-slate-700">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          </div>

          <div className="bg-slate-900 text-slate-300 px-4 py-1 rounded-lg text-xs font-mono flex-1 flex items-center justify-between border border-slate-700">
            <span className="truncate">
              https://www.
              {websiteTheme === 'clinic' ? 'cardiacspecialists' : websiteTheme === 'telehealth' ? 'apextelehealth' : 'citygeneralhospital'}
              .org/physicians/profile?id={selectedDoctor.npiNumber}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              🔒 MedAuth Verified Endpoint Active
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied Embed Code!' : 'Copy Integration Snippet'}</span>
          </button>
        </div>

        {/* Browser Content Frame */}
        <div className="bg-slate-100 text-slate-900 p-6 sm:p-10 min-h-[500px]">
          
          {/* Mock Website Header */}
          <header className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {websiteTheme === 'clinic' && 'Apex Cardiovascular Specialty Center'}
                  {websiteTheme === 'telehealth' && 'MediConnect 24/7 Telehealth Platform'}
                  {websiteTheme === 'hospital' && 'St. Vincent Memorial Hospital'}
                </h2>
                <p className="text-xs text-slate-500">Official Physician & Staff Directory</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-slate-600">
              <span className="hover:text-blue-600 cursor-pointer">Find a Doctor</span>
              <span>•</span>
              <span className="hover:text-blue-600 cursor-pointer">Departments</span>
              <span>•</span>
              <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold cursor-pointer">Book Consultation</span>
            </div>
          </header>

          {/* Doctor Profile View on "Your Other Website" */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 max-w-4xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start gap-6 pb-6 border-b border-slate-100">
              {/* Doctor Avatar / Photo Placeholder */}
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-slate-200 to-blue-100 border border-slate-300 flex items-center justify-center shrink-0 text-blue-700 shadow-inner">
                <Stethoscope className="w-12 h-12 stroke-[1.5]" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {selectedDoctor.fullName}
                  </h3>

                  {/* EMBEDDED MEDAUTH VERIFICATION BADGE BUTTON */}
                  <button
                    onClick={() => setShowVerificationModal(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-xs shadow-xs transition-all cursor-pointer group"
                    title="Click to view verified physician credentials"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span>Verified Physician by MedAuth</span>
                    <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded font-mono">
                      ✓ NPI {selectedDoctor.npiNumber.substring(0, 4)}...
                    </span>
                  </button>
                </div>

                <p className="text-sm font-semibold text-blue-700">{selectedDoctor.post}</p>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Affiliation: {selectedDoctor.hospitalAffiliation}
                </p>

                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                    Speciality: {selectedDoctor.speciality}
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                    Experience: {selectedDoctor.yearsOfPractice} Years
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                    NPI: {selectedDoctor.npiNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Content Body */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
              <div className="md:col-span-2 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Clinical Background & Practice Overview</h4>
                <p className="leading-relaxed">
                  {selectedDoctor.fullName} serves as {selectedDoctor.post} specializing in {selectedDoctor.speciality}. Credentials have been officially validated through national medical licensing board registries, NPI lookup databases, and board certification records.
                </p>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-700" />
                    <span>Official Board Certified Specialist</span>
                  </div>
                  <button
                    onClick={() => setShowVerificationModal(true)}
                    className="text-xs font-bold underline hover:text-emerald-700 cursor-pointer"
                  >
                    View Credential Audit Report
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs">Appointment & Contact</h4>
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors cursor-pointer">
                  Request Appointment
                </button>
                <div className="space-y-1.5 text-[11px] text-slate-500 pt-1">
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    {selectedDoctor.phone}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Main Medical Campus, Pavilion B
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* POPUP MODAL triggered when patient clicks the Verified Physician Badge on "Your Other Website" */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative space-y-5">
            <button
              onClick={() => setShowVerificationModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Official MedAuth Verification Seal
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">Physician Credentials Authenticated</h3>
              </div>
            </div>

            {/* Modal Details */}
            <div className="space-y-3 text-xs">
              <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 font-sans">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="font-bold text-sm text-emerald-400">{selectedDoctor.fullName}</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                    {selectedDoctor.status}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">{selectedDoctor.post}</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-mono text-slate-300">
                  <div>
                    <span className="text-slate-500 block">NPI Number:</span>
                    <strong className="text-white">{selectedDoctor.npiNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">State License #:</span>
                    <strong className="text-white">{selectedDoctor.licenseNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Council Registration:</span>
                    <strong className="text-white">{selectedDoctor.medicalCouncilNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Speciality:</span>
                    <strong className="text-white">{selectedDoctor.speciality}</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block text-[11px]">Audit Summary & Verification Guarantee</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {selectedDoctor.aiAuditSummary}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono border-t border-slate-200">
                  <span>Badge ID: {selectedDoctor.verificationBadgeId}</span>
                  <span>Verified: {new Date(selectedDoctor.verifiedAt || '').toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowVerificationModal(false)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Verification Seal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
