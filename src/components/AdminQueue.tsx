import React, { useState } from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Filter, 
  Bot, 
  ShieldAlert, 
  Sparkles,
  Check,
  RefreshCw
} from 'lucide-react';
import { DoctorProfile, VerificationStatus } from '../types';

interface AdminQueueProps {
  doctors: DoctorProfile[];
  onUpdateDoctorStatus: (id: string, newStatus: VerificationStatus) => void;
}

export const AdminQueue: React.FC<AdminQueueProps> = ({ doctors, onUpdateDoctorStatus }) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = doctors.filter((doc) => {
    if (filterStatus === 'ALL') return true;
    return doc.status === filterStatus;
  });

  const verifiedCount = doctors.filter((d) => d.status === 'VERIFIED').length;
  const reviewCount = doctors.filter((d) => d.status === 'NEEDS_REVIEW').length;
  const pendingCount = doctors.filter((d) => d.status === 'PENDING').length;

  const handleExportCSV = () => {
    const headers = ['FullName', 'Post', 'NPI', 'CouncilNumber', 'LicenseNumber', 'Speciality', 'Hospital', 'Status', 'Score', 'VerifiedBadgeID'];
    const rows = doctors.map((d) => [
      `"${d.fullName}"`,
      `"${d.post}"`,
      `"${d.npiNumber}"`,
      `"${d.medicalCouncilNumber}"`,
      `"${d.licenseNumber}"`,
      `"${d.speciality}"`,
      `"${d.hospitalAffiliation}"`,
      `"${d.status}"`,
      d.confidenceScore,
      `"${d.verificationBadgeId}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MedAuth_Physician_Registry_Export_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Banner & Stats */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-3">
              <FileCheck2 className="w-3.5 h-3.5" />
              Medical Licensing Council Admin Node
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Physician Credentials Verification Queue
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Review AI credential audit flags, verify official medical board filings, and manage physician authentication status.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Registry Database (CSV)</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <span className="text-xs text-slate-400 font-medium block">Total Verified Physicians</span>
            <span className="text-2xl font-bold text-emerald-400">{verifiedCount}</span>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <span className="text-xs text-slate-400 font-medium block">Requires Manual Review</span>
            <span className="text-2xl font-bold text-amber-400">{reviewCount}</span>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <span className="text-xs text-slate-400 font-medium block">Pending Initial AI Audit</span>
            <span className="text-2xl font-bold text-cyan-400">{pendingCount}</span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
        {/* Table Filter Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-bold text-slate-900 text-base">Verification Applications List</h3>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none"
            >
              <option value="ALL">All Application Statuses</option>
              <option value="VERIFIED">Verified Only</option>
              <option value="NEEDS_REVIEW">Needs Review Only</option>
              <option value="PENDING">Pending Only</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="divide-y divide-slate-100">
          {filtered.map((doc) => (
            <div key={doc.id} className="p-6 hover:bg-slate-50/80 transition-colors space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-slate-900">{doc.fullName}</h4>
                    <span className="font-mono text-xs text-slate-400">({doc.verificationBadgeId})</span>
                  </div>
                  <p className="text-xs font-medium text-emerald-700 mt-0.5">{doc.post} • {doc.speciality}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Hospital: {doc.hospitalAffiliation}</p>
                </div>

                {/* Status Badge & Actions */}
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                    doc.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {doc.status} ({doc.confidenceScore}% Score)
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdateDoctorStatus(doc.id, 'VERIFIED')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onUpdateDoctorStatus(doc.id, 'NEEDS_REVIEW')}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Flag Review
                    </button>
                  </div>
                </div>
              </div>

              {/* Credential Data Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px] font-sans">NPI Number</span>
                  <strong>{doc.npiNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-sans">Council Reg #</span>
                  <strong>{doc.medicalCouncilNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-sans">State License #</span>
                  <strong>{doc.licenseNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-sans">Token</span>
                  <strong className="truncate block">{doc.integrationToken}</strong>
                </div>
              </div>

              {/* AI Discrepancy Note */}
              {doc.mismatches && doc.mismatches.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Discrepancy Flagged for Manual Verification:
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-amber-800">
                    {doc.mismatches.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
