import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Code, 
  Printer, 
  Download, 
  Search, 
  Building2, 
  Sparkles, 
  FileBadge, 
  Share2, 
  Key, 
  Eye, 
  Award,
  Layers,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { DoctorProfile } from '../types';

interface DoctorDashboardProps {
  doctors: DoctorProfile[];
  selectedDoctorId?: string;
  onSelectDoctor: (id: string) => void;
  onOpenIntegrationSandbox: (doctor: DoctorProfile) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  doctors,
  selectedDoctorId,
  onSelectDoctor,
  onOpenIntegrationSandbox,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [embedTheme, setEmbedTheme] = useState<'light' | 'dark'>('light');
  const [embedSize, setEmbedSize] = useState<'compact' | 'medium' | 'detailed'>('medium');
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Find currently selected physician or default to first
  const activeDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  if (!activeDoctor) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-500">No physician profiles registered yet.</p>
      </div>
    );
  }

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://medauth-portal.app';

  // Embed Snippets Generation
  const htmlSnippet = `<!-- MedAuth Verified Physician Badge Embed -->
<div id="medauth-badge-${activeDoctor.verificationBadgeId.toLowerCase()}" 
     data-doctor-npi="${activeDoctor.npiNumber}" 
     data-badge-id="${activeDoctor.verificationBadgeId}" 
     data-theme="${embedTheme}" 
     data-size="${embedSize}"></div>
<script src="${appUrl}/api/v1/physician/widget.js" async defer></script>`;

  const reactSnippet = `import { MedAuthVerificationBadge } from '@medauth/react-sdk';

export function DoctorProfileCard() {
  return (
    <MedAuthVerificationBadge
      badgeId="${activeDoctor.verificationBadgeId}"
      npiNumber="${activeDoctor.npiNumber}"
      theme="${embedTheme}"
      variant="${embedSize}"
      showHospitalAffiliation={true}
    />
  );
}`;

  const iframeSnippet = `<iframe 
  src="${appUrl}/api/v1/physician/widget/${activeDoctor.verificationBadgeId}?theme=${embedTheme}" 
  width="380" 
  height="170" 
  style="border:none; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08);" 
  title="Verified Doctor Badge">
</iframe>`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Verified Physician Portal
            </span>
            <span className="text-xs text-slate-500 font-mono">ID: {activeDoctor.verificationBadgeId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {activeDoctor.fullName}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            {activeDoctor.post} • {activeDoctor.hospitalAffiliation}
          </p>
        </div>

        {/* Doctor Switcher Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Select Profile:</label>
          <select
            value={activeDoctor.id}
            onChange={(e) => onSelectDoctor(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 shadow-2xs focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64"
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.fullName} ({doc.speciality})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Layout: Left Column = Official Badge Card + Verification Details; Right Column = Embed Code Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Credentials Badge Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Top Security Seal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider text-emerald-400 block">MedAuth Verified</span>
                  <span className="text-[10px] text-slate-400">Authentic Doctor Credentials</span>
                </div>
              </div>

              <div className="text-right">
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/40 inline-flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {activeDoctor.status}
                </span>
              </div>
            </div>

            {/* Doctor Info Details */}
            <div className="my-5 space-y-3">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{activeDoctor.fullName}</h3>
                <p className="text-xs text-emerald-300/90 font-medium">{activeDoctor.post}</p>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Speciality:</span>
                  <strong className="text-white font-medium">{activeDoctor.speciality}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hospital Affiliation:</span>
                  <strong className="text-white font-medium text-right max-w-[200px] truncate">{activeDoctor.hospitalAffiliation}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">NPI Number:</span>
                  <strong className="text-emerald-300 font-mono tracking-wider">{activeDoctor.npiNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Medical Council #:</span>
                  <strong className="text-white font-mono">{activeDoctor.medicalCouncilNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">State License #:</span>
                  <strong className="text-white font-mono">{activeDoctor.licenseNumber}</strong>
                </div>
              </div>
            </div>

            {/* AI Audit & Security Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <div>
                <span>Match Score: </span>
                <strong className="text-emerald-400 font-bold">{activeDoctor.confidenceScore}%</strong>
              </div>
              <button
                onClick={() => setShowCertificateModal(true)}
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 underline underline-offset-2 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                View Official Certificate
              </button>
            </div>
          </div>

          {/* Integration Token Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Key className="w-4 h-4 text-emerald-600" />
                <span>Integration API Key & Token</span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                Live Production Token
              </span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 text-slate-200 p-2.5 rounded-xl font-mono text-xs border border-slate-800">
              <span className="truncate flex-1">{activeDoctor.integrationToken}</span>
              <button
                onClick={() => handleCopy(activeDoctor.integrationToken, 'token')}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
                title="Copy Token"
              >
                {copiedKey === 'token' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Use this secret key to perform server-to-server physician credential authentication queries from your backend.
            </p>
          </div>

          {/* Board Certifications List */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileBadge className="w-4 h-4 text-indigo-600" />
              Verified Board Certifications ({activeDoctor.boardCertifications.length})
            </h4>

            <div className="space-y-2">
              {activeDoctor.boardCertifications.map((cert) => (
                <div key={cert.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>{cert.name}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">Verified</span>
                  </div>
                  <p className="text-slate-500">Issuing Body: {cert.issuingBody}</p>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1 font-mono">
                    <span>File: {cert.fileName}</span>
                    <span>Valid thru {cert.expiryDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (7 cols): Embed Code Generator & Website Integration Studio */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200 mb-1">
                  <Code className="w-3.5 h-3.5" />
                  Website Integration Studio
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Embed Verified Doctor Badge into Another Website
                </h3>
                <p className="text-xs text-slate-500">Customize visual badge theme and copy auto-generated code for your external platform.</p>
              </div>

              <button
                onClick={() => onOpenIntegrationSandbox(activeDoctor)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Test Live on "Your Other Website"</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Badge Customizer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Visual Theme Style</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEmbedTheme('light')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      embedTheme === 'light' ? 'bg-white text-slate-900 border-slate-400 shadow-xs' : 'bg-slate-200 text-slate-600 border-transparent'
                    }`}
                  >
                    ☀️ Light Theme
                  </button>
                  <button
                    onClick={() => setEmbedTheme('dark')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      embedTheme === 'dark' ? 'bg-slate-900 text-white border-slate-700 shadow-xs' : 'bg-slate-200 text-slate-600 border-transparent'
                    }`}
                  >
                    🌙 Dark Theme
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge Variant Size</label>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setEmbedSize('compact')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                      embedSize === 'compact' ? 'bg-emerald-600 text-white border-emerald-700 font-bold' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Compact
                  </button>
                  <button
                    onClick={() => setEmbedSize('medium')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                      embedSize === 'medium' ? 'bg-emerald-600 text-white border-emerald-700 font-bold' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setEmbedSize('detailed')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                      embedSize === 'detailed' ? 'bg-emerald-600 text-white border-emerald-700 font-bold' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Detailed
                  </button>
                </div>
              </div>
            </div>

            {/* Live Interactive Preview Box */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">Live Badge Render Preview</span>
              
              <div className={`p-6 rounded-2xl border transition-all flex items-center justify-center ${
                embedTheme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100/70 border-slate-300'
              }`}>
                {/* Embedded Badge Mock Rendering */}
                <div className={`p-4 rounded-xl border max-w-sm w-full transition-all shadow-md ${
                  embedTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm truncate">{activeDoctor.fullName}</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      </div>
                      <p className={`text-xs truncate ${embedTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {activeDoctor.speciality}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/20 text-[11px]">
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-medium border border-emerald-500/30">
                          ✓ Verified Physician
                        </span>
                        <span className={`font-mono text-[10px] ${embedTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          NPI: {activeDoctor.npiNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Snippets Accordion / Tabs */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Copy Code Snippet for Your External Website
              </span>

              {/* Snippet 1: HTML Script */}
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2 text-xs font-mono text-slate-200">
                <div className="flex items-center justify-between font-sans text-slate-400 text-xs pb-1 border-b border-slate-800">
                  <span className="font-bold text-emerald-400">1. HTML / Script Tag Snippet (WordPress, Webflow, HTML)</span>
                  <button
                    onClick={() => handleCopy(htmlSnippet, 'html')}
                    className="inline-flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedKey === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'html' ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="overflow-x-auto text-[11px] text-emerald-300 leading-relaxed py-1">{htmlSnippet}</pre>
              </div>

              {/* Snippet 2: React Component */}
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2 text-xs font-mono text-slate-200">
                <div className="flex items-center justify-between font-sans text-slate-400 text-xs pb-1 border-b border-slate-800">
                  <span className="font-bold text-cyan-400">2. React / Next.js Component Code</span>
                  <button
                    onClick={() => handleCopy(reactSnippet, 'react')}
                    className="inline-flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedKey === 'react' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'react' ? 'Copied!' : 'Copy React Code'}</span>
                  </button>
                </div>
                <pre className="overflow-x-auto text-[11px] text-cyan-300 leading-relaxed py-1">{reactSnippet}</pre>
              </div>

              {/* Snippet 3: iFrame Snippet */}
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2 text-xs font-mono text-slate-200">
                <div className="flex items-center justify-between font-sans text-slate-400 text-xs pb-1 border-b border-slate-800">
                  <span className="font-bold text-amber-400">3. Universal iFrame Embed Code</span>
                  <button
                    onClick={() => handleCopy(iframeSnippet, 'iframe')}
                    className="inline-flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedKey === 'iframe' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'iframe' ? 'Copied!' : 'Copy iFrame'}</span>
                  </button>
                </div>
                <pre className="overflow-x-auto text-[11px] text-amber-200 leading-relaxed py-1">{iframeSnippet}</pre>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* CERTIFICATE MODAL */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 border border-slate-200 shadow-2xl relative space-y-6">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl font-bold p-2"
            >
              ✕
            </button>

            {/* Official Certificate Visual Design */}
            <div className="border-8 border-double border-emerald-800 p-8 text-center space-y-4 bg-gradient-to-b from-amber-50/40 via-white to-emerald-50/20 rounded-xl relative">
              <div className="flex justify-center">
                <div className="p-3 bg-emerald-800 text-amber-300 rounded-full shadow-lg">
                  <Award className="w-10 h-10" />
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">Official Medical Credential Authenticated</span>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">Certificate of Physician Verification</h2>
                <p className="text-xs text-slate-500 font-sans mt-0.5">MedAuth National Licensing & NPI Authentication Registry</p>
              </div>

              <div className="py-4 border-y border-emerald-200 my-2 space-y-2">
                <p className="text-xs text-slate-600 italic">This official digital document certifies that</p>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{activeDoctor.fullName}</h3>
                <p className="text-xs text-emerald-800 font-semibold">{activeDoctor.post}</p>
                <p className="text-xs text-slate-700">{activeDoctor.hospitalAffiliation}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-700 bg-white/80 p-3 rounded-lg border border-emerald-100">
                <div>
                  <span className="block text-[10px] text-slate-400">NPI Number</span>
                  <strong>{activeDoctor.npiNumber}</strong>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">Council #</span>
                  <strong>{activeDoctor.medicalCouncilNumber}</strong>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">License #</span>
                  <strong>{activeDoctor.licenseNumber}</strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Badge ID: {activeDoctor.verificationBadgeId}</span>
                <span>Verified: {new Date(activeDoctor.verifiedAt || '').toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Certificate</span>
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
