import React, { useState, useEffect } from 'react';
import { 
  PatientRecord, 
  DoctorProfile 
} from '../types';
import { 
  User, 
  Users,
  Activity, 
  AlertTriangle, 
  FileText, 
  Pill, 
  FlaskConical, 
  Stethoscope, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Heart, 
  TrendingUp, 
  Layers, 
  Plus, 
  Download, 
  Share2, 
  Phone, 
  Mail, 
  Folder, 
  FileCheck2,
  Syringe,
  Building2,
  Check,
  Edit3,
  Search,
  UserPlus,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';

interface EhrPatientProfileProps {
  patient: PatientRecord;
  doctor: DoctorProfile;
  allPatients?: PatientRecord[];
  onSelectPatient?: (patient: PatientRecord) => void;
  onUpdatePatient?: (updatedPatient: PatientRecord) => void;
  onAddPatient?: (newPatient: PatientRecord) => void;
  onStartConsultation: (patient: PatientRecord) => void;
  onOpenPrescription: (patient: PatientRecord) => void;
}

export const EhrPatientProfile: React.FC<EhrPatientProfileProps> = ({
  patient,
  doctor,
  allPatients,
  onSelectPatient,
  onUpdatePatient,
  onAddPatient,
  onStartConsultation,
  onOpenPrescription,
}) => {
  const [activeTab, setActiveTab] = useState<string>('Overview');

  // Manual Patient Editor State
  const [customName, setCustomName] = useState<string>(patient.fullName);
  const [customAge, setCustomAge] = useState<number | string>(patient.age);
  const [customGender, setCustomGender] = useState<string>(patient.gender);
  const [customBloodGroup, setCustomBloodGroup] = useState<string>(patient.bloodGroup || 'A+');
  const [customCondition, setCustomCondition] = useState<string>(patient.condition || 'General Health');
  
  const [isManualEditOpen, setIsManualEditOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string>('All');

  // Synchronize local form when active patient changes
  useEffect(() => {
    setCustomName(patient.fullName);
    setCustomAge(patient.age);
    setCustomGender(patient.gender);
    setCustomBloodGroup(patient.bloodGroup || 'A+');
    setCustomCondition(patient.condition || 'General Health');
  }, [patient.id, patient.fullName, patient.age, patient.gender, patient.bloodGroup, patient.condition]);

  // Handlers for manual profile updates
  const handleApplyUpdates = () => {
    const updated: PatientRecord = {
      ...patient,
      fullName: customName.trim() || patient.fullName,
      age: Number(customAge) || patient.age,
      gender: customGender || patient.gender,
      bloodGroup: customBloodGroup || patient.bloodGroup,
      condition: customCondition || patient.condition,
    };
    if (onUpdatePatient) {
      onUpdatePatient(updated);
    }
  };

  const handleCreateNewPatient = () => {
    const newId = `PAT-${Date.now().toString().slice(-4)}`;
    const newMrn = `MRN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const calculatedBirthYear = 2026 - (Number(customAge) || 30);
    
    const newPat: PatientRecord = {
      id: newId,
      mrn: newMrn,
      fullName: customName.trim() || 'New Patient',
      age: Number(customAge) || 30,
      gender: customGender || 'Male',
      dob: `${calculatedBirthYear}-01-15`,
      bloodGroup: customBloodGroup || 'O+',
      phone: '+1 (555) ' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(1000 + Math.random() * 9000),
      email: `${(customName || 'patient').toLowerCase().replace(/\s+/g, '.')}@clinic.org`,
      allergies: ['None Reported'],
      emergencyContact: {
        name: 'Primary Contact',
        relation: 'Family',
        phone: '+1 (555) 999-0000',
      },
      importantAlerts: ['New Patient Profile'],
      medicalHistory: ['No prior chronic illness declared'],
      currentMedications: [],
      diagnosesHistory: [
        {
          code: 'Z00.00',
          condition: customCondition || 'General Medical Examination',
          diagnosedDate: '2026-08-09',
          status: 'Active'
        }
      ],
      condition: customCondition || 'Routine Examination',
      lastVisit: 'Today',
      status: 'Active',
      vitalsHistory: [
        { date: '2026-08-09', bp: '120/80', hr: 72, temp: 98.6, spo2: 98, rr: 16, weight: 70, height: 175, bmi: 22.9 }
      ],
      labReports: [],
      consultationHistory: []
    };

    if (onAddPatient) {
      onAddPatient(newPat);
    } else if (onSelectPatient) {
      onSelectPatient(newPat);
    }
  };

  // Filter patients by name, age/year, or gender
  const filteredPatientsList = (allPatients || []).filter((p) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || 
      p.fullName.toLowerCase().includes(query) ||
      p.mrn.toLowerCase().includes(query) ||
      p.age.toString().includes(query) ||
      p.dob.includes(query);

    const matchesGender = genderFilter === 'All' || p.gender.toLowerCase() === genderFilter.toLowerCase();
    return matchesQuery && matchesGender;
  });

  // All 17 Tabs as specified in user guidelines
  const tabs = [
    'Overview',
    'Medical History',
    'Symptoms',
    'Diagnoses',
    'Medications',
    'Allergies',
    'Vitals',
    'Lab Reports',
    'Imaging',
    'Prescriptions',
    'Procedures',
    'Immunization',
    'Hospitalization',
    'Previous Consultations',
    'Documents',
    'Doctor Notes',
    'Timeline',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden font-sans">
      
      {/* ================= ACTIVE PATIENT SWITCHER & MANUAL SELECTOR BAR ================= */}
      <div className="bg-slate-950 text-white p-4 border-b border-slate-800 space-y-4 text-xs">
        
        {/* Top Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shrink-0">
              <Users className="w-4 h-4" />
            </span>
            <div>
              <span className="font-bold text-white text-xs block">Active EHR Patient Switcher & Profile Selector</span>
              <span className="text-[11px] text-slate-400">Select existing records or manually set Name, Age/Year, and Gender below</span>
            </div>
          </div>

          {/* Toggle Manual Patient Editor */}
          <button
            onClick={() => setIsManualEditOpen(!isManualEditOpen)}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
              isManualEditOpen
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-emerald-500/50'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isManualEditOpen ? 'Close Manual Patient Editor' : 'Manually Select / Edit Patient Details'}</span>
          </button>
        </div>

        {/* Dropdown & Filter Row */}
        {allPatients && allPatients.length > 0 && onSelectPatient && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            
            {/* Quick Search Input (Name / MRN / Age) */}
            <div className="md:col-span-4 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Name, MRN or Year/Age..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Gender Filter */}
            <div className="md:col-span-3 flex items-center gap-1">
              <label className="text-[10px] text-slate-400 font-semibold shrink-0 uppercase tracking-wider">Gender:</label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 font-semibold px-2.5 py-1.5 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="All">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Select Patient Dropdown */}
            <div className="md:col-span-5 flex items-center gap-1.5">
              <label className="text-[10px] text-slate-400 font-semibold shrink-0 uppercase tracking-wider">Patient:</label>
              <select
                value={patient.id}
                onChange={(e) => {
                  const selected = allPatients.find((p) => p.id === e.target.value);
                  if (selected) onSelectPatient(selected);
                }}
                className="w-full bg-slate-950 border border-emerald-500/70 text-emerald-300 font-bold px-3 py-1.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
              >
                {filteredPatientsList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} • {p.age} Yrs ({p.gender}) • {p.mrn}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Pill Switcher Bar */}
            <div className="md:col-span-12 flex items-center gap-1.5 overflow-x-auto pt-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mr-1">Quick Select:</span>
              {filteredPatientsList.map((p) => {
                const isCurrent = p.id === patient.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPatient(p)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-xs border border-emerald-400/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <span>{p.fullName}</span>
                    <span className="text-[10px] opacity-75">({p.age}y/{p.gender[0]})</span>
                  </button>
                );
              })}
            </div>

          </div>
        )}

        {/* ================= MANUAL PATIENT DETAILS INPUT / EDITOR PANEL ================= */}
        {isManualEditOpen && (
          <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/40 space-y-3.5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-bold text-amber-400 text-xs flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                Manual Patient Parameters Editor (Name, Age/Year, Gender)
              </h4>
              <span className="text-[10px] text-slate-400">
                Type details to customize the active EHR profile or generate a new patient record.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Name Input */}
              <div className="space-y-1 lg:col-span-2">
                <label className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 font-medium focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              {/* Age / Year Input */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">
                  Age (Years) / Year
                </label>
                <input
                  type="number"
                  value={customAge}
                  onChange={(e) => setCustomAge(e.target.value)}
                  placeholder="e.g. 58"
                  min="0"
                  max="120"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-emerald-300 font-bold focus:ring-2 focus:ring-amber-400 outline-none font-mono"
                />
              </div>

              {/* Gender Input */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">
                  Gender
                </label>
                <select
                  value={customGender}
                  onChange={(e) => setCustomGender(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Blood Group Input */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">
                  Blood Group
                </label>
                <select
                  value={customBloodGroup}
                  onChange={(e) => setCustomBloodGroup(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-emerald-400 font-bold px-3 py-1.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              {/* Primary Condition */}
              <div className="space-y-1 sm:col-span-2 lg:col-span-5">
                <label className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">
                  Primary Medical Condition / Diagnosis
                </label>
                <input
                  type="text"
                  value={customCondition}
                  onChange={(e) => setCustomCondition(e.target.value)}
                  placeholder="e.g. Hypertension & Type 2 Diabetes"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 font-medium focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 italic">
                Active Record MRN: <strong className="text-emerald-400 font-mono">{patient.mrn}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApplyUpdates}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Current Patient Profile</span>
                </button>

                <button
                  type="button"
                  onClick={handleCreateNewPatient}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create as New Patient Record</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ================= PATIENT HEADER ================= */}
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Patient Core Info */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-md shadow-emerald-900/40">
              {patient.fullName.split(' ').map((n) => n[0]).join('')}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white">{patient.fullName}</h2>
                <span className="bg-slate-800 text-emerald-400 font-mono text-xs px-2.5 py-0.5 rounded-lg border border-slate-700">
                  {patient.mrn}
                </span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                  patient.status === 'High-Priority' 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {patient.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap">
                <span><strong>Age/Gender:</strong> {patient.age} Yrs • {patient.gender}</span>
                <span>•</span>
                <span><strong>Blood Group:</strong> <span className="text-emerald-400 font-bold">{patient.bloodGroup}</span></span>
                <span>•</span>
                <span><strong>DOB:</strong> {patient.dob}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Phone className="w-3 h-3" /> {patient.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Emergency Contact & Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs space-y-0.5">
              <span className="text-slate-400 text-[10px] block font-medium uppercase tracking-wider">Emergency Contact</span>
              <p className="text-white font-bold">{patient.emergencyContact.name} ({patient.emergencyContact.relation})</p>
              <p className="text-emerald-400 font-mono">{patient.emergencyContact.phone}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onStartConsultation(patient)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Start Consultation</span>
              </button>

              <button
                onClick={() => onOpenPrescription(patient)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Pill className="w-4 h-4 text-emerald-400" />
                <span>Issue Prescription</span>
              </button>
            </div>
          </div>

        </div>

        {/* Important Clinical Alerts Banner */}
        {patient.importantAlerts && patient.importantAlerts.length > 0 && (
          <div className="mt-4 p-3 bg-rose-950/70 border border-rose-800/80 rounded-xl flex items-center gap-2 text-xs text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="flex items-center gap-2 flex-wrap font-medium">
              <span className="font-bold text-white uppercase text-[11px]">CRITICAL CLINICAL ALERTS:</span>
              {patient.importantAlerts.map((alert, i) => (
                <span key={i} className="bg-rose-900/60 text-rose-200 px-2.5 py-0.5 rounded border border-rose-700/60 font-mono text-[11px]">
                  {alert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= 17 EHR TABS NAVIGATION BAR ================= */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2 overflow-x-auto flex items-center gap-1 custom-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ================= TAB CONTENT BODY ================= */}
      <div className="p-6">
        
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            
            {/* Quick Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Primary Condition</span>
                <p className="text-slate-900 font-bold text-base">{patient.condition}</p>
                <p className="text-xs text-slate-500">Last visited on {patient.lastVisit}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Documented Allergies ({patient.allergies.length})</span>
                <div className="flex flex-wrap gap-1">
                  {patient.allergies.map((a, i) => (
                    <span key={i} className="bg-rose-100 text-rose-800 text-xs px-2.5 py-0.5 rounded-md border border-rose-200 font-medium">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Active Medications</span>
                <p className="text-slate-900 font-bold text-sm">{patient.currentMedications.length} Regular RX Prescribed</p>
                <p className="text-xs text-emerald-700 font-semibold">Latest: {patient.currentMedications[0]?.name || 'None'}</p>
              </div>

            </div>

            {/* Latest Vitals Snapshot */}
            {patient.vitalsHistory.length > 0 && (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" /> Latest Vitals Readings ({patient.vitalsHistory[0].date})
                  </h4>
                  <button onClick={() => setActiveTab('Vitals')} className="text-xs text-emerald-700 font-bold hover:underline">
                    View Full Vitals Chart
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">BP (mmHg)</span>
                    <strong className="text-slate-900 text-sm font-mono">{patient.vitalsHistory[0].bp}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Heart Rate</span>
                    <strong className="text-slate-900 text-sm font-mono">{patient.vitalsHistory[0].hr} bpm</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">SpO2</span>
                    <strong className="text-emerald-700 text-sm font-mono">{patient.vitalsHistory[0].spo2}%</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Temp</span>
                    <strong className="text-slate-900 text-sm font-mono">{patient.vitalsHistory[0].temp} °F</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Resp Rate</span>
                    <strong className="text-slate-900 text-sm font-mono">{patient.vitalsHistory[0].rr} /min</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Weight</span>
                    <strong className="text-slate-900 text-sm font-mono">{patient.vitalsHistory[0].weight} kg</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Height</span>
                    <strong className="text-slate-900 text-sm font-mono">{patient.vitalsHistory[0].height} cm</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">BMI</span>
                    <strong className="text-slate-900 text-sm font-mono">{patient.vitalsHistory[0].bmi}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Active Diagnoses List */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-sm text-slate-900">Documented ICD-10 Diagnoses</h4>
              <div className="divide-y divide-slate-200 bg-white rounded-lg border border-slate-200">
                {patient.diagnosesHistory.map((d, i) => (
                  <div key={i} className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-emerald-800 font-bold mr-2">{d.code}</span>
                      <strong className="text-slate-900">{d.condition}</strong>
                    </div>
                    <div className="text-right">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200">
                        {d.status}
                      </span>
                      <span className="text-slate-500 text-[10px] block mt-0.5">{d.diagnosedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 2. MEDICAL HISTORY */}
        {activeTab === 'Medical History' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Long-Term Medical & Surgical History</h3>
            <ul className="space-y-2">
              {patient.medicalHistory.map((item, idx) => (
                <li key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-800 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. SYMPTOMS */}
        {activeTab === 'Symptoms' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Recorded Clinical Symptoms & Complaints</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p className="text-slate-800"><strong>Presenting Complaint:</strong> {patient.condition}</p>
              <p className="text-slate-600">Associated mild exertion fatigue and sporadic headaches in early morning hours.</p>
            </div>
          </div>
        )}

        {/* 4. DIAGNOSES */}
        {activeTab === 'Diagnoses' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Diagnoses Directory (ICD-10 Standardized)</h3>
            <div className="space-y-2">
              {patient.diagnosesHistory.map((d, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                  <div>
                    <span className="font-mono text-emerald-800 font-bold">{d.code}</span>
                    <p className="font-bold text-slate-900">{d.condition}</p>
                  </div>
                  <span className="text-slate-500">{d.diagnosedDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. MEDICATIONS */}
        {activeTab === 'Medications' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Active Medications & Dosing Schedule</h3>
            <div className="space-y-2">
              {patient.currentMedications.map((m, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <strong className="text-slate-900 text-sm block">{m.name} ({m.dosage})</strong>
                    <span className="text-slate-600">{m.frequency} • Started: {m.startDate}</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold text-[10px] border border-emerald-200">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. ALLERGIES */}
        {activeTab === 'Allergies' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Allergies & Adverse Drug Reactions (ADR)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {patient.allergies.map((a, idx) => (
                <div key={idx} className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 space-y-1">
                  <strong className="block text-sm font-bold">{a}</strong>
                  <span className="text-[10px] text-rose-700 font-semibold uppercase">Severe Hypersensitivity Flag</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. VITALS */}
        {activeTab === 'Vitals' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Vitals Log & Longitudinal Readings</h3>
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
              {patient.vitalsHistory.map((v, idx) => (
                <div key={idx} className="p-4 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                  <span className="font-bold text-slate-900 font-mono text-sm">{v.date}</span>
                  <div className="flex gap-4 font-mono text-xs">
                    <span>BP: <strong>{v.bp}</strong></span>
                    <span>HR: <strong>{v.hr} bpm</strong></span>
                    <span>SpO2: <strong className="text-emerald-700">{v.spo2}%</strong></span>
                    <span>BMI: <strong>{v.bmi}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. LAB REPORTS */}
        {activeTab === 'Lab Reports' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Diagnostic Lab Results & Findings</h3>
            <div className="space-y-3">
              {patient.labReports.map((lab) => (
                <div key={lab.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <strong className="text-slate-900 text-sm">{lab.title}</strong>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      lab.status === 'Abnormal' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {lab.status}
                    </span>
                  </div>
                  <p className="text-slate-700">{lab.findings}</p>
                  <p className="text-slate-500 text-[10px]">Date: {lab.date} • Category: {lab.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. IMAGING */}
        {activeTab === 'Imaging' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Radiology & DICOM Imaging</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 block text-sm">Chest Radiograph PA View (2026-08-01)</strong>
              <p className="text-slate-700">Clear lung fields. Normal cardiothoracic ratio (&lt; 0.50).</p>
            </div>
          </div>
        )}

        {/* 10. PRESCRIPTIONS */}
        {activeTab === 'Prescriptions' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Issued e-Prescriptions History</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 block text-sm">RX-2026-8801 Issued by {doctor.fullName}</strong>
              <p className="text-slate-700">Lisinopril 10mg PO Daily x 30 Days (3 Refills Approved)</p>
            </div>
          </div>
        )}

        {/* 11. PROCEDURES */}
        {activeTab === 'Procedures' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Clinical Procedures & Interventions</h3>
            <p className="text-slate-600">Appendectomy (2018) • Outpatient ECG (2026).</p>
          </div>
        )}

        {/* 12. IMMUNIZATION */}
        {activeTab === 'Immunization' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Immunization & Vaccine Record</h3>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-medium">
              COVID-19 mRNA Booster (2025) • Influenza Annual Vaccine (2025) • Tetanus Toxoid (2023)
            </div>
          </div>
        )}

        {/* 13. HOSPITALIZATION */}
        {activeTab === 'Hospitalization' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Hospital Admissions & Discharge Summaries</h3>
            <p className="text-slate-600">No acute inpatient hospital admissions logged for current calendar year.</p>
          </div>
        )}

        {/* 14. PREVIOUS CONSULTATIONS */}
        {activeTab === 'Previous Consultations' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Previous Consultations Notes</h3>
            <div className="space-y-3">
              {patient.consultationHistory.map((c) => (
                <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <strong className="text-slate-900 text-sm">{c.diagnosis}</strong>
                    <span className="text-slate-500 font-mono">{c.date}</span>
                  </div>
                  <p className="text-slate-700"><strong>Chief Complaint:</strong> {c.chiefComplaint}</p>
                  <p className="text-emerald-800 font-semibold"><strong>Plan:</strong> {c.treatmentPlan}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 15. DOCUMENTS */}
        {activeTab === 'Documents' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Uploaded Patient Documents & Consents</h3>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <span className="font-medium text-slate-800">Signed Patient HIPAA Consent Form 2026.pdf</span>
              <button className="text-emerald-700 font-bold hover:underline">Download</button>
            </div>
          </div>
        )}

        {/* 16. DOCTOR NOTES */}
        {activeTab === 'Doctor Notes' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Attending Doctor Confidential Notes</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-slate-800">Patient compliant with medication schedule. Recommended routine stress reduction and weekly home BP logging.</p>
              <span className="text-slate-500 text-[10px] block mt-2">— Authored by {doctor.fullName}</span>
            </div>
          </div>
        )}

        {/* 17. TIMELINE */}
        {activeTab === 'Timeline' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Patient Longitudinal Care Timeline</h3>
            <div className="border-l-2 border-emerald-600 pl-4 space-y-4">
              <div className="space-y-0.5">
                <span className="text-emerald-700 font-bold font-mono text-[11px]">2026-08-07</span>
                <p className="font-bold text-slate-900">Follow-up Consultation Conducted</p>
                <p className="text-slate-600">BP stabilized at 138/86 mmHg.</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-emerald-700 font-bold font-mono text-[11px]">2026-08-05</span>
                <p className="font-bold text-slate-900">Lab Results Logged</p>
                <p className="text-slate-600">CMP & Lipid profile uploaded.</p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
