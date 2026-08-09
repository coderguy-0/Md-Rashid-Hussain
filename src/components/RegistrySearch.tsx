import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  FileText, 
  Share2, 
  Copy, 
  Check, 
  Filter,
  Download,
  Award
} from 'lucide-react';
import { DoctorProfile } from '../types';

interface RegistrySearchProps {
  doctors: DoctorProfile[];
}

export const RegistrySearch: React.FC<RegistrySearchProps> = ({ doctors }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered doctors
  const filteredDoctors = doctors.filter((doc) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = 
      !q ||
      doc.fullName.toLowerCase().includes(q) ||
      doc.npiNumber.includes(q) ||
      doc.licenseNumber.toLowerCase().includes(q) ||
      doc.medicalCouncilNumber.toLowerCase().includes(q) ||
      doc.hospitalAffiliation.toLowerCase().includes(q) ||
      doc.speciality.toLowerCase().includes(q);

    const matchesSpec = selectedSpeciality === 'ALL' || doc.speciality.includes(selectedSpeciality);

    return matchesQuery && matchesSpec;
  });

  const handleCopyBadge = (badgeId: string) => {
    navigator.clipboard.writeText(badgeId);
    setCopiedId(badgeId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = (doc: DoctorProfile) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(doc, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `MedAuth_Verification_${doc.npiNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Search Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-3">
            <Search className="w-3.5 h-3.5" />
            National Physician & NPI Credentials Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Search Doctor & Physician Verification Registry
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Query verified physicians by NPI Number, Full Name, Medical Council Registration, or License Number to authenticate active board certifications.
          </p>
        </div>

        {/* Search Bar & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by Doctor Name, NPI (e.g. 1982736410), License #, or Council #"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="sm:w-64">
            <select
              value={selectedSpeciality}
              onChange={(e) => setSelectedSpeciality(e.target.value)}
              className="w-full py-3 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Medical Specialties</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedic">Orthopedic Surgery</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 px-1">
          <span>Showing <strong>{filteredDoctors.length}</strong> authenticated physician profile(s)</span>
          <span className="text-emerald-700 font-semibold">100% Verified against NPI & Council Registry</span>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No Matching Physician Credentials Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try searching by a different NPI number, license code, or clearing the specialty filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 tracking-tight">{doc.fullName}</h3>
                      <p className="text-xs font-semibold text-emerald-700">{doc.post}</p>
                    </div>

                    <span className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-200 shrink-0 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {doc.status}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 py-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">NPI Number</span>
                      <strong className="font-mono text-slate-800">{doc.npiNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">State License #</span>
                      <strong className="font-mono text-slate-800">{doc.licenseNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Medical Council #</span>
                      <strong className="font-mono text-slate-800">{doc.medicalCouncilNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Speciality</span>
                      <strong className="text-slate-800 truncate block">{doc.speciality}</strong>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-600 flex items-center gap-1.5 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {doc.hospitalAffiliation}
                    </p>
                    <p className="text-[11px] text-slate-500 pt-0.5">
                      {doc.boardCertifications.length} Active Board Certification(s) Attached
                    </p>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                  <button
                    onClick={() => handleCopyBadge(doc.verificationBadgeId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors cursor-pointer"
                  >
                    {copiedId === doc.verificationBadgeId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === doc.verificationBadgeId ? 'Badge ID Copied' : 'Badge ID'}</span>
                  </button>

                  <button
                    onClick={() => handleExportJSON(doc)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON Payload</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
