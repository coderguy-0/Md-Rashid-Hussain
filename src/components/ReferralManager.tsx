import React, { useState } from 'react';
import { PatientRecord, ReferralRecord, DoctorProfile } from '../types';
import { sampleReferrals } from '../data/sampleClinicalData';
import { Share2, Plus, CheckCircle2, ChevronRight, FileText, Send, X } from 'lucide-react';

interface ReferralManagerProps {
  patients: PatientRecord[];
  doctor: DoctorProfile;
}

export const ReferralManager: React.FC<ReferralManagerProps> = ({ patients, doctor }) => {
  const [referrals, setReferrals] = useState<ReferralRecord[]>(sampleReferrals);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [targetSpecialty, setTargetSpecialty] = useState('Clinical Electrophysiology');
  const [targetPhysician, setTargetPhysician] = useState('Dr. Anita Roy, MD');
  const [reason, setReason] = useState('Evaluated for recurrent palpitations and Holter PACs. Requesting electrophysiology consult.');

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === selectedPatientId) || patients[0];

    const newRef: ReferralRecord = {
      id: `REF-${Date.now()}`,
      patientId: pat.id,
      patientName: pat.fullName,
      referringDoctor: doctor.fullName,
      targetSpecialty,
      targetPhysician,
      reason,
      createdDate: '2026-08-09',
      status: 'Sent',
      attachedReportIds: ['LAB-702'],
    };

    setReferrals((prev) => [newRef, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-600" />
            Inter-Specialty Physician Referrals Hub
          </h2>
          <p className="text-xs text-slate-500">
            Create, issue, and track outgoing specialist consultations and clinic transfers.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Referral</span>
        </button>
      </div>

      {/* Referrals Stream */}
      <div className="space-y-4">
        {referrals.map((ref) => (
          <div key={ref.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
              <div>
                <span className="font-bold text-slate-900 text-sm">{ref.patientName}</span>
                <span className="text-xs text-slate-500 block">
                  Referral ID: <strong className="font-mono text-slate-800">{ref.id}</strong> • Date: {ref.createdDate}
                </span>
              </div>

              {/* Status Tracker Bar: Created -> Sent -> Accepted -> Consultation Completed */}
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <span className={`px-2 py-0.5 rounded ${ref.status === 'Created' || ref.status === 'Sent' || ref.status === 'Accepted' || ref.status === 'Consultation Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  Created
                </span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className={`px-2 py-0.5 rounded ${ref.status === 'Sent' || ref.status === 'Accepted' || ref.status === 'Consultation Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  Sent
                </span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className={`px-2 py-0.5 rounded ${ref.status === 'Accepted' || ref.status === 'Consultation Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  Accepted
                </span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className={`px-2 py-0.5 rounded ${ref.status === 'Consultation Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  Completed
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block font-medium">Target Specialty & Physician:</span>
                <strong className="text-slate-900 block">{ref.targetSpecialty}</strong>
                <span className="text-emerald-800 font-semibold">{ref.targetPhysician}</span>
              </div>

              <div>
                <span className="text-slate-500 block font-medium">Reason for Referral:</span>
                <p className="text-slate-800">{ref.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Referral Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateReferral} className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-600" />
                Create Specialist Referral
              </h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Select Patient</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-medium text-xs"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.fullName} ({p.mrn})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Target Specialty</label>
              <input
                type="text"
                required
                value={targetSpecialty}
                onChange={(e) => setTargetSpecialty(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Target Physician Name</label>
              <input
                type="text"
                required
                value={targetPhysician}
                onChange={(e) => setTargetPhysician(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Reason for Referral</label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none text-xs"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Send Referral
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
