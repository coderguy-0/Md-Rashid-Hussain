import React, { useState } from 'react';
import { PatientRecord, DoctorProfile, PrescriptionItem } from '../types';
import { 
  Stethoscope, 
  Activity, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  Pill, 
  Save, 
  AlertTriangle,
  User,
  Heart,
  Calendar
} from 'lucide-react';

interface ConsultationWorkspaceProps {
  patient: PatientRecord;
  doctor: DoctorProfile;
  onCompleteConsultation: (summary: string) => void;
  onCancel: () => void;
}

export const ConsultationWorkspace: React.FC<ConsultationWorkspaceProps> = ({
  patient,
  doctor,
  onCompleteConsultation,
  onCancel,
}) => {
  // Step State (1: Symptoms/History, 2: Physical Exam/Vitals, 3: Diagnosis, 4: Treatment & RX, 5: Review & Issue)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [chiefComplaint, setChiefComplaint] = useState(patient.condition || 'Routine hypertension follow-up');
  const [symptoms, setSymptoms] = useState('Occasional morning headaches, mild exertional fatigue, no chest pain or dyspnea.');
  const [historyNotes, setHistoryNotes] = useState(patient.medicalHistory.join(', '));
  
  const [vitalsBp, setVitalsBp] = useState(patient.vitalsHistory[0]?.bp || '130/82');
  const [vitalsHr, setVitalsHr] = useState(patient.vitalsHistory[0]?.hr || 76);
  const [vitalsTemp, setVitalsTemp] = useState(patient.vitalsHistory[0]?.temp || 98.6);
  const [vitalsSpo2, setVitalsSpo2] = useState(patient.vitalsHistory[0]?.spo2 || 99);
  const [physicalExam, setPhysicalExam] = useState('S1 S2 present, normal heart sounds. Lungs clear to auscultation bilaterally. No peripheral edema.');
  const [clinicalFindings, setClinicalFindings] = useState('Blood pressure well controlled. No acute cardiac distress.');

  const [diagnosis, setDiagnosis] = useState('Essential Primary Hypertension (ICD-10 I10)');
  const [differentialDiagnosis, setDifferentialDiagnosis] = useState('Secondary Hypertension, White Coat Effect');

  const [treatmentPlan, setTreatmentPlan] = useState('Continue Lisinopril 10mg PO OD. Low sodium DASH diet. Regular aerobic exercise 30 min daily.');
  const [doctorNotes, setDoctorNotes] = useState('Patient educated on medication compliance and home BP logging.');
  const [followUpDate, setFollowUpDate] = useState('2026-09-09');

  const [isSaved, setIsSaved] = useState(false);

  const handleFinish = () => {
    setIsSaved(true);
    setTimeout(() => {
      onCompleteConsultation(`Consultation completed for ${patient.fullName}. Diagnosis: ${diagnosis}. Plan: ${treatmentPlan}`);
    }, 1200);
  };

  const steps = [
    { num: 1, title: 'Symptoms & History' },
    { num: 2, title: 'Exam & Vitals' },
    { num: 3, title: 'Diagnosis' },
    { num: 4, title: 'Treatment & Plan' },
    { num: 5, title: 'Review & Sign' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden font-sans space-y-0">
      
      {/* Header Bar */}
      <div className="bg-emerald-800 text-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-900">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
            <Stethoscope className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-200 block">
              Active Clinical Consultation Suite
            </span>
            <h2 className="text-lg font-bold text-white">
              Patient: {patient.fullName} <span className="text-emerald-300 font-normal">({patient.mrn})</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-emerald-900/80 px-3 py-1 rounded-lg border border-emerald-700 text-emerald-200 font-mono">
            Attending: {doctor.fullName} ({doctor.npiNumber})
          </span>
          <button
            onClick={onCancel}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            Exit Workspace
          </button>
        </div>
      </div>

      {/* Step Progress Tracker */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between overflow-x-auto gap-2">
        {steps.map((s) => (
          <button
            key={s.num}
            onClick={() => setCurrentStep(s.num)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
              currentStep === s.num
                ? 'bg-emerald-600 text-white shadow-xs'
                : currentStep > s.num
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              currentStep === s.num ? 'bg-white text-emerald-800 font-bold' : 'bg-slate-200 text-slate-700'
            }`}>
              {s.num}
            </span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {/* Workspace Body */}
      <div className="p-6 space-y-6">
        
        {/* STEP 1: SYMPTOMS & HISTORY */}
        {currentStep === 1 && (
          <div className="space-y-4 max-w-3xl">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-2">
              1. Chief Complaint & Presenting Symptoms
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Chief Complaint</label>
              <input
                type="text"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Detailed Symptoms Description</label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Relevant Medical History Context</label>
              <textarea
                rows={2}
                value={historyNotes}
                onChange={(e) => setHistoryNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* STEP 2: EXAMINATION & VITALS */}
        {currentStep === 2 && (
          <div className="space-y-4 max-w-3xl">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-2">
              2. Physical Examination & Real-time Vitals Recording
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">BP (mmHg)</label>
                <input
                  type="text"
                  value={vitalsBp}
                  onChange={(e) => setVitalsBp(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={vitalsHr}
                  onChange={(e) => setVitalsHr(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">SpO2 (%)</label>
                <input
                  type="number"
                  value={vitalsSpo2}
                  onChange={(e) => setVitalsSpo2(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Temp (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vitalsTemp}
                  onChange={(e) => setVitalsTemp(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Physical Examination Findings</label>
              <textarea
                rows={3}
                value={physicalExam}
                onChange={(e) => setPhysicalExam(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Clinical Assessment Findings</label>
              <textarea
                rows={2}
                value={clinicalFindings}
                onChange={(e) => setClinicalFindings(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* STEP 3: DIAGNOSIS */}
        {currentStep === 3 && (
          <div className="space-y-4 max-w-3xl">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-2">
              3. Clinical Diagnosis & Differential Diagnosis
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Primary Diagnosis (ICD-10)</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500 font-bold text-emerald-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Differential Diagnoses to Rule Out</label>
              <textarea
                rows={3}
                value={differentialDiagnosis}
                onChange={(e) => setDifferentialDiagnosis(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* STEP 4: TREATMENT & PLAN */}
        {currentStep === 4 && (
          <div className="space-y-4 max-w-3xl">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-2">
              4. Treatment Plan, Patient Instructions & Follow-up
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Treatment Plan & Non-Pharmacological Advice</label>
              <textarea
                rows={3}
                value={treatmentPlan}
                onChange={(e) => setTreatmentPlan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Doctor Confidential Notes</label>
              <textarea
                rows={2}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Scheduled Follow-up Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & SIGN */}
        {currentStep === 5 && (
          <div className="space-y-6 max-w-3xl">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-2">
              5. Final Review & Digital Signature
            </h3>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900">Patient: {patient.fullName} ({patient.mrn})</span>
                <span className="font-mono text-emerald-800 font-bold">Follow-up: {followUpDate}</span>
              </div>

              <div>
                <strong className="text-slate-700 block">Chief Complaint:</strong>
                <p className="text-slate-900">{chiefComplaint}</p>
              </div>

              <div>
                <strong className="text-slate-700 block">Diagnosis:</strong>
                <p className="text-emerald-900 font-bold">{diagnosis}</p>
              </div>

              <div>
                <strong className="text-slate-700 block">Treatment Plan:</strong>
                <p className="text-slate-900">{treatmentPlan}</p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Attending Physician Signature Seal</span>
                  <strong className="text-emerald-800 font-bold text-sm">{doctor.fullName}</strong>
                  <p className="text-[10px] text-slate-500">NPI: {doctor.npiNumber} • Council Reg #{doctor.medicalCouncilNumber}</p>
                </div>
                <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold rounded-xl text-[10px] text-center">
                  ✓ Digital Signature Active
                </div>
              </div>
            </div>

            {isSaved ? (
              <div className="p-4 bg-emerald-100 text-emerald-900 rounded-xl border border-emerald-300 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Consultation record saved & timeline updated successfully! Redirecting...</span>
              </div>
            ) : (
              <button
                onClick={handleFinish}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Sign & Complete Consultation Record</span>
              </button>
            )}
          </div>
        )}

        {/* Step Navigation Bar */}
        <div className="pt-4 border-t border-slate-200 flex justify-between items-center max-w-3xl">
          <button
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl disabled:opacity-40 transition-all cursor-pointer"
          >
            Previous Step
          </button>

          {currentStep < 5 && (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
