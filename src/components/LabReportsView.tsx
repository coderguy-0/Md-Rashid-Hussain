import React, { useState } from 'react';
import { PatientRecord, DoctorProfile } from '../types';
import { 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Eye, 
  FileText, 
  Check, 
  Filter,
  Plus
} from 'lucide-react';

interface LabReportsViewProps {
  patients: PatientRecord[];
  doctor: DoctorProfile;
}

export const LabReportsView: React.FC<LabReportsViewProps> = ({ patients, doctor }) => {
  const [filterAbnormalOnly, setFilterAbnormalOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [reviewedIds, setReviewedIds] = useState<Record<string, boolean>>({});
  const [notesState, setNotesState] = useState<Record<string, string>>({});

  // Flatten all lab reports from patients
  const allReports = patients.flatMap((p) => 
    p.labReports.map((lab) => ({
      ...lab,
      patientName: p.fullName,
      patientMrn: p.mrn,
      patientId: p.id,
    }))
  );

  const filteredReports = allReports.filter((r) => {
    if (filterAbnormalOnly && r.status === 'Normal') return false;
    if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;
    return true;
  });

  const handleMarkReviewed = (id: string) => {
    setReviewedIds((prev) => ({ ...prev, [id]: true }));
  };

  const handleSaveNote = (id: string, text: string) => {
    setNotesState((prev) => ({ ...prev, [id]: text }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6 font-sans">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-600" />
            Lab & Diagnostic Reports Repository
          </h2>
          <p className="text-xs text-slate-500">
            Real-time diagnostic report stream across registered patient records.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setFilterAbnormalOnly(!filterAbnormalOnly)}
            className={`px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              filterAbnormalOnly 
                ? 'bg-amber-100 text-amber-900 border-amber-300' 
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Abnormal Only</span>
          </button>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium outline-none text-xs"
          >
            <option value="All">All Categories</option>
            <option value="Blood Biochemistry">Blood Biochemistry</option>
            <option value="Cardiology Diagnostics">Cardiology Diagnostics</option>
            <option value="Electrophysiology">Electrophysiology</option>
            <option value="Cardiac & Metabolic">Cardiac & Metabolic</option>
            <option value="Radiology / Imaging">Radiology / Imaging</option>
          </select>
        </div>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const isReviewed = reviewedIds[report.id] || report.reviewedByDoctor;

          return (
            <div 
              key={report.id} 
              className={`p-5 rounded-2xl border transition-all ${
                report.status === 'Abnormal' 
                  ? 'bg-amber-50/40 border-amber-200/90' 
                  : 'bg-slate-50 border-slate-200/90'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{report.title}</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                      report.status === 'Abnormal' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}>
                      {report.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Patient: <strong className="text-slate-800">{report.patientName}</strong> ({report.patientMrn})
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    {report.findings}
                  </p>

                  <div className="text-[11px] text-slate-500 flex items-center gap-3">
                    <span>Date: {report.date}</span>
                    <span>•</span>
                    <span>Category: {report.category}</span>
                  </div>
                </div>

                {/* Trend Analysis Box: Previous -> Current -> Trend */}
                {report.previousVal && (
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-mono shrink-0 space-y-1 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase font-sans">
                      Longitudinal Trend
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{report.previousVal}</span>
                      <span className="text-slate-400">→</span>
                      <strong className="text-slate-900">{report.currentVal}</strong>
                      <span className={`flex items-center gap-1 font-sans text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        report.trend === 'improving' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {report.trend === 'improving' ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : <Minus className="w-3 h-3" />}
                        {report.trend}
                      </span>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Row: Doctor Review & Notes */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-[280px]">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Add clinical observation notes for this lab report..."
                    defaultValue={notesState[report.id] || ''}
                    onBlur={(e) => handleSaveNote(report.id, e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {isReviewed ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[11px] border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Marked as Reviewed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleMarkReviewed(report.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-xs"
                    >
                      Mark as Reviewed
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
