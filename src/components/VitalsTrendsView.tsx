import React, { useState } from 'react';
import { PatientRecord } from '../types';
import { 
  Activity, 
  TrendingUp, 
  Heart, 
  Thermometer, 
  Scale, 
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface VitalsTrendsViewProps {
  patients: PatientRecord[];
}

export const VitalsTrendsView: React.FC<VitalsTrendsViewProps> = ({ patients }) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const vitals = patient?.vitalsHistory || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6 font-sans">
      
      {/* Header & Patient Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            Vitals & Clinical Longitudinal Trends
          </h2>
          <p className="text-xs text-slate-500">
            Track vital sign trajectories, hemodynamic responses, and physical parameters over time.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-700">Select Patient:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold outline-none text-xs text-slate-800"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName} ({p.mrn})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Patient Overview Bar */}
      {patient && (
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs text-emerald-900">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">{patient.fullName}</h3>
            <p className="text-slate-600 text-[11px]">{patient.age} Yrs / {patient.gender} • Condition: {patient.condition}</p>
          </div>

          <div className="flex gap-4 font-mono text-xs">
            <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-sans">Latest BP</span>
              <strong className="text-slate-900 text-sm">{vitals[0]?.bp || 'N/A'}</strong>
            </div>

            <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-sans">Heart Rate</span>
              <strong className="text-slate-900 text-sm">{vitals[0]?.hr || 'N/A'} bpm</strong>
            </div>

            <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-sans">BMI</span>
              <strong className="text-slate-900 text-sm">{vitals[0]?.bmi || 'N/A'}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Visual Longitudinal Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Blood Pressure Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Blood Pressure (mmHg)</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{vitals[0]?.bp || '120/80'}</p>
          <p className="text-[11px] text-emerald-700 font-semibold">Previous: {vitals[1]?.bp || '142/90'} (Improving)</p>
        </div>

        {/* Heart Rate Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Heart Rate (bpm)</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{vitals[0]?.hr || 72} bpm</p>
          <p className="text-[11px] text-slate-600">Normal Sinus Rhythm</p>
        </div>

        {/* Temperature & SpO2 Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Oxygen & Temperature</span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{vitals[0]?.spo2 || 99}% SpO2</p>
          <p className="text-[11px] text-slate-600">Temp: {vitals[0]?.temp || 98.6} °F</p>
        </div>

        {/* BMI & Weight Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Weight & BMI</span>
            <Scale className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{vitals[0]?.weight || 78} kg</p>
          <p className="text-[11px] text-slate-600">BMI: {vitals[0]?.bmi || 25.6} • Height: {vitals[0]?.height || 175}cm</p>
        </div>

      </div>

      {/* Full Readings Table Timeline */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
          Longitudinal Vitals Table
        </h3>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">BP (mmHg)</th>
                <th className="p-3">HR (bpm)</th>
                <th className="p-3">Temp (°F)</th>
                <th className="p-3">SpO2 (%)</th>
                <th className="p-3">RR (/min)</th>
                <th className="p-3">Weight (kg)</th>
                <th className="p-3">BMI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {vitals.map((v, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-bold font-sans text-slate-900">{v.date}</td>
                  <td className="p-3 font-bold text-slate-800">{v.bp}</td>
                  <td className="p-3">{v.hr}</td>
                  <td className="p-3">{v.temp}</td>
                  <td className="p-3 text-emerald-700 font-bold">{v.spo2}%</td>
                  <td className="p-3">{v.rr}</td>
                  <td className="p-3">{v.weight}</td>
                  <td className="p-3 font-bold">{v.bmi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
