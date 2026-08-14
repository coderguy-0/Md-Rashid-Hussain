import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  Pill, 
  Award, 
  FlaskConical, 
  Share2, 
  Video, 
  ClipboardList, 
  Bot, 
  CheckSquare, 
  CreditCard, 
  Folder, 
  BarChart3, 
  Bell, 
  MessageSquare, 
  ShieldCheck, 
  Layers, 
  Lock, 
  Settings, 
  HelpCircle, 
  Search, 
  Plus, 
  Building2, 
  Sparkles, 
  Check, 
  Copy, 
  ChevronRight, 
  UserCheck, 
  Phone, 
  Mail, 
  Stethoscope,
  Activity,
  DollarSign,
  Send,
  AlertCircle,
  CheckCircle2,
  X,
  Filter,
  Eye,
  LogOut
} from 'lucide-react';

import { DoctorProfile, PatientRecord, Appointment, AuditLogItem } from '../types';
import { samplePatients, sampleAppointments, sampleAuditLogs } from '../data/sampleClinicalData';

import { EhrPatientProfile } from './EhrPatientProfile';
import { ConsultationWorkspace } from './ConsultationWorkspace';
import { EPrescriptionBuilder } from './EPrescriptionBuilder';
import { LabReportsView } from './LabReportsView';
import { VitalsTrendsView } from './VitalsTrendsView';
import { ReferralManager } from './ReferralManager';

interface ProfessionalDashboardProps {
  doctor: DoctorProfile;
  onNewSubmission: () => void;
}

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({
  doctor,
  onNewSubmission,
}) => {
  // Navigation State
  const [activeMenu, setActiveMenu] = useState<string>('Patients & Appointments');

  // Domain States
  const [patientsList, setPatientsList] = useState<PatientRecord[]>(samplePatients);
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>(sampleAppointments);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(samplePatients[0]);

  // Active Modals & Workspaces
  const [showConsultationWorkspace, setShowConsultationWorkspace] = useState(false);
  const [showPrescriptionBuilder, setShowPrescriptionBuilder] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [patientFilter, setPatientFilter] = useState<'All' | 'New' | 'Active' | 'Follow-up' | 'High-Priority'>('All');
  const [aptFilter, setAptFilter] = useState<'All' | 'Today' | 'Upcoming' | 'In-Person' | 'Telemedicine'>('Today');
  const [patientsAndAptTab, setPatientsAndAptTab] = useState<'unified' | 'appointments' | 'patients'>('unified');

  // Copy Feedback Flags
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // AI Assistant Chat State
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { sender: 'bot', text: `Good day ${doctor.fullName}. I am your Clinical AI Assistant. I can summarize patient histories, organize clinical notes, check drug interactions, or draft referral summaries.` }
  ]);

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatInput.trim()) return;
    const userMsg = aiChatInput;
    setAiMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setAiChatInput('');
    setTimeout(() => {
      setAiMessages((prev) => [
        ...prev,
        { 
          sender: 'bot', 
          text: `Clinical Analysis for "${userMsg}": Cross-referenced with ${doctor.speciality} clinical guidelines and ${doctor.hospitalAffiliation} protocol. Patient record updated.` 
        }
      ]);
    }, 800);
  };

  const handleCopyBadge = () => {
    navigator.clipboard.writeText(doctor.verificationBadgeId);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2000);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(doctor.integrationToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Appointment Status Modifiers
  const handleAptStatusChange = (id: string, newStatus: Appointment['status']) => {
    setAppointmentsList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  // Filter Patients
  const filteredPatients = patientsList.filter((p) => {
    if (patientFilter !== 'All' && p.status !== patientFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.fullName.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.condition.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filter Appointments
  const filteredAppointments = appointmentsList.filter((a) => {
    if (aptFilter === 'Today' && a.date !== '2026-08-09') return false;
    if (aptFilter === 'Upcoming' && a.date <= '2026-08-09') return false;
    if (aptFilter === 'In-Person' && a.type !== 'In-Person') return false;
    if (aptFilter === 'Telemedicine' && a.type !== 'Telemedicine') return false;
    return true;
  });

  // Recommended Sidebar Structure from Prompt
  const menuItems = [
    { name: 'Patients & Appointments', icon: Users, badge: `${patientsList.length} Patients` },
    { name: 'Patient Profile (EHR)', icon: FileText, highlight: true },
    { name: 'Clinical Consultation', icon: Stethoscope },
    { name: 'e-Prescriptions', icon: Pill },
    { name: 'Lab Reports', icon: FlaskConical },
    { name: 'Vitals & Trends', icon: Activity },
    { name: 'Referrals', icon: Share2 },
    { name: 'Messages & Comm', icon: MessageSquare },
    { name: 'Telemedicine Suite', icon: Video, badge: 'Live' },
    { name: 'Professional Profile', icon: ShieldCheck, highlight: true },
    { name: 'Billing & Earnings', icon: CreditCard },
    { name: 'AI Clinical Assistant', icon: Bot },
    { name: 'Schedule & Availability', icon: Calendar },
    { name: 'Notifications', icon: Bell, badge: '2' },
    { name: 'Security & Audit Logs', icon: Lock },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-[calc(100vh-65px)] bg-slate-50 text-slate-800 overflow-hidden font-sans">
      
      {/* ========================================================= */}
      {/* SIDEBAR NAVIGATION (Light Contrast Theme)                */}
      {/* ========================================================= */}
      <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col shrink-0 shadow-xs">
        
        {/* Doctor Identity Card in Sidebar */}
        <div className="p-4 border-b border-slate-200/80 bg-emerald-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-emerald-600/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xs font-bold text-slate-900 truncate">{doctor.fullName}</h2>
              <p className="text-[11px] text-emerald-700 font-semibold truncate">{doctor.post}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-600 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <span>NPI: <strong className="text-slate-900 font-mono font-bold">{doctor.npiNumber}</strong></span>
            <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> VERIFIED
            </span>
          </div>
        </div>

        {/* Scrollable Sidebar Nav List */}
        <nav className="flex-1 overflow-y-auto p-2.5 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-600/25'
                    : item.highlight
                    ? 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100/90 border border-emerald-200/80 font-bold'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/80 space-y-2 text-[11px] text-slate-500">
          <div className="flex items-center justify-between text-[10px]">
            <span className="truncate font-mono">Token: {doctor.integrationToken.substring(0, 8)}...</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" /> Private EHR
            </span>
          </div>
          <button
            onClick={onNewSubmission}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Lock & Switch Doctor</span>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA                                         */}
      {/* ========================================================= */}
      <main className="flex-1 overflow-y-auto bg-slate-50/70 p-6 space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Doctor Portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-emerald-700 font-semibold">{activeMenu}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{activeMenu}</span>
              <span className="bg-emerald-50 text-emerald-800 text-xs px-3 py-1 rounded-full border border-emerald-200 font-mono font-semibold">
                {doctor.speciality}
              </span>
            </h1>
          </div>

          {/* Quick Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="relative w-64 hidden md:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search EHR, Patients, MRN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-emerald-500 shadow-2xs"
              />
            </div>

            <button
              onClick={() => setActiveMenu('Profile & Verification')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Badge ID: {doctor.verificationBadgeId}</span>
            </button>

            {/* Lock Session & Sign Out Button */}
            <button
              onClick={onNewSubmission}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs border border-slate-700"
              title="Lock private EHR session and return to Doctor Gateway"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Lock Session</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ACTIVE WORKSPACE OVERLAYS (CONSULTATION & PRESCRIPTION)   */}
        {/* ========================================================= */}
        {showConsultationWorkspace && (
          <ConsultationWorkspace
            patient={selectedPatient}
            doctor={doctor}
            onCompleteConsultation={(summary) => {
              setShowConsultationWorkspace(false);
              setActiveMenu('Patients & Appointments');
            }}
            onCancel={() => setShowConsultationWorkspace(false)}
          />
        )}

        {showPrescriptionBuilder && (
          <EPrescriptionBuilder
            patient={selectedPatient}
            doctor={doctor}
            onClose={() => setShowPrescriptionBuilder(false)}
          />
        )}

        {/* ========================================================= */}
        {/* COMBINED PATIENTS & APPOINTMENTS HUB                      */}
        {/* ========================================================= */}
        {!showConsultationWorkspace && activeMenu === 'Patients & Appointments' && (
          <div className="space-y-6">
            
            {/* Authenticated Physician Success Banner */}
            <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3 text-xs text-emerald-900 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Good Day, {doctor.fullName}</h4>
                  <p className="text-slate-600 text-[11px]">{appointmentsList.length} Scheduled Appointments | {patientsList.length} Registered Patients | 2 Reports to Review</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyToken}
                  className="px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-emerald-800 font-bold hover:bg-emerald-100/50 transition-all cursor-pointer flex items-center gap-1.5 text-[11px]"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedToken ? 'Token Copied!' : 'Copy Integration Token'}</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-1 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span className="font-medium">Scheduled Appointments</span>
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{appointmentsList.length} Appointments</p>
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">Today & Upcoming Queue</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-1 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span className="font-medium">Registered Patients</span>
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{patientsList.length} Patients</p>
                <p className="text-[11px] text-emerald-700 font-semibold">Active EHR Records</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-1 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span className="font-medium">Lab Reports Review</span>
                  <FlaskConical className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">2 Reports</p>
                <p className="text-[11px] text-amber-700 font-semibold">1 Abnormal Result Flagged</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-1 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span className="font-medium">e-Prescriptions Pending</span>
                  <Pill className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">4 RX Orders</p>
                <p className="text-[11px] text-indigo-700 font-semibold">Awaiting Digital Sign</p>
              </div>

            </div>

            {/* UNIFIED PATIENTS & APPOINTMENTS CONTAINER */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-6 text-xs shadow-xs">
              {/* Header & View Switcher */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-0.5 rounded-md font-bold border border-emerald-200 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-600" /> Unified Clinical Workspace
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Patients & Appointments Hub</h2>
                  <p className="text-slate-500">Manage patient records, medical histories, and scheduled consultations in one unified location.</p>
                </div>

              {/* Sub-Tab Selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
                <button
                  onClick={() => setPatientsAndAptTab('unified')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    patientsAndAptTab === 'unified' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Unified Side-by-Side</span>
                </button>

                <button
                  onClick={() => setPatientsAndAptTab('appointments')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    patientsAndAptTab === 'appointments' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Appointments ({appointmentsList.length})</span>
                </button>

                <button
                  onClick={() => setPatientsAndAptTab('patients')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    patientsAndAptTab === 'patients' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Patients Directory ({patientsList.length})</span>
                </button>
              </div>
            </div>

            {/* TAB 1: UNIFIED OVERVIEW (SIDE BY SIDE / SPLIT CARDS) */}
            {patientsAndAptTab === 'unified' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Appointments Column */}
                <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/90 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      Appointments Schedule
                    </h3>
                    <button
                      onClick={() => setPatientsAndAptTab('appointments')}
                      className="text-emerald-700 hover:underline font-semibold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full Schedule</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Filter Pills for Appointments inside Unified */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/80 overflow-x-auto">
                    {(['Today', 'All', 'In-Person', 'Telemedicine'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setAptFilter(filter)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                          aptFilter === filter ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {filteredAppointments.map((apt) => (
                      <div key={apt.id} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2.5 hover:border-emerald-300 transition-colors shadow-2xs">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 text-xs">
                              {apt.time}
                            </span>
                            <div>
                              <h4 className="font-bold text-slate-900 text-xs">{apt.patientName}</h4>
                              <p className="text-slate-500 text-[11px]">{apt.reason}</p>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                            apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                            apt.status === 'In-Progress' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {apt.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                          <span className="text-slate-500">{apt.mode} ({apt.type})</span>
                          <button
                            onClick={() => {
                              const pat = patientsList.find((p) => p.id === apt.patientId) || patientsList[0];
                              setSelectedPatient(pat);
                              setShowConsultationWorkspace(true);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all cursor-pointer text-[11px] flex items-center gap-1"
                          >
                            <span>Start Consult</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Patients Database Column */}
                <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/90 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600" />
                      Registered Patients Database
                    </h3>
                    <button
                      onClick={() => setPatientsAndAptTab('patients')}
                      className="text-emerald-700 hover:underline font-semibold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>All Records</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Status Filters for Patients inside Unified */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/80 overflow-x-auto">
                    {(['All', 'Active', 'High-Priority', 'Follow-up'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setPatientFilter(st)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                          patientFilter === st ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {filteredPatients.map((p) => (
                      <div key={p.id} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 hover:border-emerald-300 transition-colors shadow-2xs">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs">{p.fullName}</span>
                              <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                                {p.mrn}
                              </span>
                            </div>
                            <p className="text-slate-500 text-[11px] mt-0.5">{p.condition} • {p.age} Yrs ({p.gender})</p>
                          </div>

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                            p.status === 'High-Priority' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                          <button
                            onClick={() => {
                              setSelectedPatient(p);
                              setActiveMenu('Patient Profile (EHR)');
                            }}
                            className="text-slate-700 font-bold hover:text-emerald-700 underline cursor-pointer"
                          >
                            View EHR Profile
                          </button>

                          <button
                            onClick={() => {
                              setSelectedPatient(p);
                              setShowConsultationWorkspace(true);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all cursor-pointer text-[11px] flex items-center gap-1"
                          >
                            <span>Start Consult</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: APPOINTMENTS FULL VIEW */}
            {patientsAndAptTab === 'appointments' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Appointments Schedule</h3>
                    <p className="text-slate-500 text-xs">Chronological queue of patient visits & telemedicine calls</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                    {(['All', 'Today', 'Upcoming', 'In-Person', 'Telemedicine'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setAptFilter(filter)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          aptFilter === filter ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredAppointments.map((apt) => (
                    <div key={apt.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-emerald-800 font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-sm">
                          {apt.time}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{apt.patientName} <span className="text-slate-500 text-xs font-normal">({apt.patientAge} Yrs / {apt.patientGender})</span></h4>
                          <p className="text-slate-600 text-xs">{apt.reason} • <strong className="text-slate-800">{apt.mode}</strong> ({apt.type})</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
                        <select
                          value={apt.status}
                          onChange={(e) => handleAptStatusChange(apt.id, e.target.value as any)}
                          className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Waiting">Waiting</option>
                          <option value="In-Progress">In-Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="No-Show">No-Show</option>
                        </select>

                        <button
                          onClick={() => {
                            const pat = patientsList.find((p) => p.id === apt.patientId) || patientsList[0];
                            setSelectedPatient(pat);
                            setShowConsultationWorkspace(true);
                          }}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          <span>Start Consultation</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PATIENTS FULL DIRECTORY VIEW */}
            {patientsAndAptTab === 'patients' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Registered Patients Database</h3>
                    <p className="text-slate-500 text-xs">Directory of clinical records under care of {doctor.fullName}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                    {(['All', 'Active', 'New', 'Follow-up', 'High-Priority'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setPatientFilter(st)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          patientFilter === st ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-slate-200/80">
                  {filteredPatients.map((p) => (
                    <div key={p.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-base">{p.fullName}</span>
                          <span className="font-mono text-emerald-800 font-bold bg-slate-100 px-2 py-0.5 rounded text-[10px] border border-slate-200">
                            {p.mrn}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'High-Priority' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {p.status}
                          </span>
                        </div>

                        <p className="text-slate-600 text-xs">{p.condition} • {p.age} Yrs / {p.gender} • Blood Group: <strong className="text-emerald-700">{p.bloodGroup}</strong></p>
                        <p className="text-slate-500 text-[11px]">Phone: {p.phone} • Last Visit: {p.lastVisit}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedPatient(p);
                            setActiveMenu('Patient Profile (EHR)');
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-all cursor-pointer border border-slate-300"
                        >
                          View EHR Profile
                        </button>

                        <button
                          onClick={() => {
                            setSelectedPatient(p);
                            setShowConsultationWorkspace(true);
                          }}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          <span>Start Consult</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

        {/* ========================================================= */}
        {/* VIEW 4: PATIENT PROFILE (EHR)                             */}
        {/* ========================================================= */}
        {!showConsultationWorkspace && activeMenu === 'Patient Profile (EHR)' && (
          <EhrPatientProfile
            patient={selectedPatient}
            doctor={doctor}
            allPatients={patientsList}
            onSelectPatient={(pat) => setSelectedPatient(pat)}
            onUpdatePatient={(updatedPat) => {
              setSelectedPatient(updatedPat);
              setPatientsList((prev) => prev.map((p) => (p.id === updatedPat.id ? updatedPat : p)));
            }}
            onAddPatient={(newPat) => {
              setPatientsList((prev) => [newPat, ...prev]);
              setSelectedPatient(newPat);
            }}
            onStartConsultation={(pat) => {
              setSelectedPatient(pat);
              setShowConsultationWorkspace(true);
            }}
            onOpenPrescription={(pat) => {
              setSelectedPatient(pat);
              setShowPrescriptionBuilder(true);
            }}
          />
        )}

        {/* ========================================================= */}
        {/* VIEW 5: CLINICAL CONSULTATION LAUNCH PAD                 */}
        {/* ========================================================= */}
        {!showConsultationWorkspace && activeMenu === 'Clinical Consultation' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-4 text-xs shadow-xs text-center">
            <Stethoscope className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">Clinical Consultation Workspace</h2>
            <p className="text-slate-600 max-w-md mx-auto">
              Initiate structured clinical consultations for patient {selectedPatient.fullName} ({selectedPatient.mrn}).
            </p>

            <button
              onClick={() => setShowConsultationWorkspace(true)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Launch Step-by-Step Consultation Suite</span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 6: E-PRESCRIPTIONS                                   */}
        {/* ========================================================= */}
        {!showConsultationWorkspace && activeMenu === 'e-Prescriptions' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-4 text-xs shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-200/80 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Digital e-Prescriptions Hub</h2>
                <p className="text-slate-500">Prescribe medications with automated drug interaction & allergy safety warnings.</p>
              </div>

              <button
                onClick={() => setShowPrescriptionBuilder(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Issue New Prescription</span>
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 block text-sm">Active RX-2026-8801</strong>
              <p className="text-slate-700">Lisinopril 10mg PO OD prescribed for {selectedPatient.fullName}. Signed with NPI #{doctor.npiNumber}.</p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 7: LAB REPORTS                                       */}
        {/* ========================================================= */}
        {!showConsultationWorkspace && activeMenu === 'Lab Reports' && (
          <LabReportsView patients={patientsList} doctor={doctor} />
        )}

        {/* ========================================================= */}
        {/* VIEW 8: VITALS & TRENDS                                   */}
        {/* ========================================================= */}
        {!showConsultationWorkspace && activeMenu === 'Vitals & Trends' && (
          <VitalsTrendsView patients={patientsList} />
        )}

        {/* ========================================================= */}
        {/* VIEW 9: REFERRALS                                         */}
        {/* ========================================================= */}
        {!showConsultationWorkspace && activeMenu === 'Referrals' && (
          <ReferralManager patients={patientsList} doctor={doctor} />
        )}

        {/* ========================================================= */}
        {/* VIEW 10: MESSAGES & COMM                                  */}
        {/* ========================================================= */}
        {!showConsultationWorkspace && activeMenu === 'Messages & Comm' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-4 text-xs shadow-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-200/80 pb-3">Clinical Communications Hub</h2>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p className="text-slate-800"><strong>Patient Rahul Kumar:</strong> Requested clarification regarding Lisinopril evening dosing.</p>
              <p className="text-emerald-800 font-bold">✓ Replied by {doctor.fullName}</p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 11: TELEMEDICINE SUITE                               */}
        {/* ========================================================= */}
        {!showConsultationWorkspace && activeMenu === 'Telemedicine Suite' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-4 text-xs shadow-xs text-center">
            <Video className="w-12 h-12 text-amber-600 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">Live Telemedicine Room</h2>
            <p className="text-slate-600 max-w-md mx-auto">
              Encrypted video consultation room ready for scheduled tele-health calls.
            </p>
            <button className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer">
              Launch Telemedicine Video Room
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW: PROFESSIONAL PROFILE                                */}
        {/* ========================================================= */}
        {!showConsultationWorkspace && activeMenu === 'Professional Profile' && (
          <div className="space-y-6">
            
            {/* Authenticated Physician Banner */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-2xl p-6 border border-emerald-700 text-white shadow-md space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
                    <ShieldCheck className="w-8 h-8 text-emerald-200" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider block">
                      Authentic Physician Credentials
                    </span>
                    <h2 className="text-xl font-bold text-white">{doctor.fullName}</h2>
                  </div>
                </div>

                <span className="bg-white text-emerald-900 text-xs px-3 py-1 rounded-full font-bold shadow-xs">
                  STATUS: {doctor.status} ({doctor.confidenceScore}% Match)
                </span>
              </div>

              <p className="text-xs text-emerald-100/90">
                {doctor.aiAuditSummary}
              </p>
            </div>

            {/* Verified Physician Metadata & Registrations */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-6 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-200/80 pb-3 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                Verified Physician Metadata & Registrations
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 block font-medium">Full Name</span>
                  <strong className="text-slate-900 text-sm block">{doctor.fullName}</strong>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 block font-medium">Post / Designation</span>
                  <strong className="text-emerald-700 text-sm block">{doctor.post}</strong>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 block font-medium">NPI Number (10 Digits)</span>
                  <strong className="text-slate-900 font-mono text-sm block">{doctor.npiNumber}</strong>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 block font-medium">Medical Council Number</span>
                  <strong className="text-slate-900 font-mono text-sm block">{doctor.medicalCouncilNumber}</strong>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 block font-medium">State / National License Number</span>
                  <strong className="text-slate-900 font-mono text-sm block">{doctor.licenseNumber}</strong>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 block font-medium">Medical Speciality</span>
                  <strong className="text-slate-900 text-sm block">{doctor.speciality}</strong>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 block font-medium">Verification Badge ID</span>
                  <strong className="text-emerald-700 font-mono text-sm block">{doctor.verificationBadgeId}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap gap-3">
                <button
                  onClick={handleCopyBadge}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 flex items-center gap-2 transition-all cursor-pointer"
                >
                  {copiedBadge ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedBadge ? 'Badge ID Copied' : 'Copy Verification Badge ID'}</span>
                </button>

                <button
                  onClick={handleCopyToken}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  {copiedToken ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedToken ? 'Token Copied' : 'Copy Integration Token'}</span>
                </button>
              </div>

            </div>

            {/* Hospital & Clinic Affiliations */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-4 text-xs shadow-xs">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-200/80 pb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                Hospital & Clinic Affiliations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Primary Hospital Affiliation</span>
                  <strong className="text-slate-900 text-sm block">{doctor.hospitalAffiliation}</strong>
                  <p className="text-slate-600">Department: {doctor.speciality} • OPD Room 402</p>
                  <p className="text-emerald-800 font-mono font-bold">Consultation Hours: 09:00 AM - 04:00 PM</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Secondary Telemedicine Clinic</span>
                  <strong className="text-slate-900 text-sm block">Virtual Cardiology Specialist Wing</strong>
                  <p className="text-slate-600">Encrypted Tele-consultation Suite</p>
                  <p className="text-emerald-800 font-mono font-bold">On-Call Slot: 04:00 PM - 07:00 PM</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 13: BILLING & EARNINGS                               */}
        {/* ========================================================= */}
        {!showConsultationWorkspace && activeMenu === 'Billing & Earnings' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-4 text-xs shadow-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-200/80 pb-3">Consultation Billing & Insurance Claims</h2>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-slate-900 font-bold block">Approved Insurance Claims Total: $2,840.00</span>
              <p className="text-slate-500 font-mono">Billed under NPI: {doctor.npiNumber}</p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 14: AI CLINICAL ASSISTANT                             */}
        {/* ========================================================= */}
        {!showConsultationWorkspace && activeMenu === 'AI Clinical Assistant' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-4 text-xs flex flex-col h-[520px] shadow-xs">
            <h2 className="font-bold text-slate-900 text-base border-b border-slate-200/80 pb-3 flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-600" />
              AI Clinical Assistant Panel
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              {aiMessages.map((m, idx) => (
                <div key={idx} className={`p-3 rounded-xl max-w-lg ${m.sender === 'user' ? 'bg-emerald-600 text-white ml-auto' : 'bg-white text-slate-800 border border-slate-200 shadow-2xs'}`}>
                  {m.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleAiSend} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Ask clinical questions, drug interactions, or summarize patient history..."
                value={aiChatInput}
                onChange={(e) => setAiChatInput(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
              />
              <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition-all cursor-pointer shadow-xs">
                Send
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 15: SCHEDULE & AVAILABILITY                           */}
        {/* ========================================================= */}
        {!showConsultationWorkspace && activeMenu === 'Schedule & Availability' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-4 text-xs shadow-xs">
            <h2 className="font-bold text-slate-900 text-base border-b border-slate-200/80 pb-3">Weekly Schedule & On-Call Shifts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => (
                <div key={day} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center space-y-2">
                  <strong className="text-emerald-700 block font-mono text-sm">{day}</strong>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg text-[10px] font-bold block">
                    09:00 AM - 04:00 PM
                  </span>
                  <p className="text-[11px] text-slate-600">{idx % 2 === 0 ? 'OPD Clinic' : 'Ward Rounds & Tele-consults'}</p>
                </div>
              ))}
            </div>
          </div>
        )}



        {/* ========================================================= */}
        {/* VIEW 17: NOTIFICATIONS                                    */}
        {/* ========================================================= */}
        {!showConsultationWorkspace && activeMenu === 'Notifications' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-4 text-xs shadow-xs">
            <h2 className="font-bold text-slate-900 text-base border-b border-slate-200/80 pb-3">System Alerts & Notifications</h2>
            <div className="space-y-2">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-medium">
                ✓ Physician credentials verified against NPI Registry and State License Board.
              </div>
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-medium">
                ! New abnormal lab result uploaded for Rahul Kumar (CMP Total Cholesterol 228 mg/dL).
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 18: SECURITY & AUDIT LOGS                           */}
        {/* ========================================================= */}
        {!showConsultationWorkspace && activeMenu === 'Security & Audit Logs' && (
          <div className="space-y-6">
            {/* Doctor Password & Privacy Management Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                      Doctor Privacy Protection
                    </span>
                    <h3 className="text-base font-bold text-white">
                      Active Doctor Security Password & PIN
                    </h3>
                  </div>
                </div>
                <span className="bg-emerald-950 text-emerald-300 text-xs px-3 py-1 rounded-full font-mono border border-emerald-800 font-bold">
                  HIPAA ENCRYPTED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1">
                  <span className="text-slate-400 block font-medium">Logged-in Doctor</span>
                  <strong className="text-white text-sm block">{doctor.fullName}</strong>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1">
                  <span className="text-slate-400 block font-medium">Security Password / PIN</span>
                  <strong className="text-emerald-400 font-mono text-sm block tracking-wider">
                    {doctor.securityPassword || 'doc123'}
                  </strong>
                </div>
              </div>

              <div className="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700 text-slate-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Every login attempt verifies doctor identity against this password before displaying patient records, consultation notes, e-prescriptions, and lab reports.
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-4 text-xs shadow-xs">
              <div className="border-b border-slate-200/80 pb-3">
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  Security Access & Audit Logs
                </h2>
                <p className="text-slate-500">Track who accessed patient medical records and when according to HIPAA compliance rules.</p>
              </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden font-mono text-[11px]">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 font-sans">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">User / Role</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Patient Record</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sampleAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-600">{log.timestamp}</td>
                      <td className="p-3 font-bold text-slate-900">{log.user}</td>
                      <td className="p-3 font-semibold text-emerald-800">{log.action}</td>
                      <td className="p-3 text-slate-800">{log.patientName} ({log.patientMrn})</td>
                      <td className="p-3 font-bold text-emerald-700 font-sans">{log.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 19: SETTINGS                                         */}
        {/* ========================================================= */}
        {!showConsultationWorkspace && activeMenu === 'Settings' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 space-y-4 text-xs shadow-xs">
            <h2 className="font-bold text-slate-900 text-base border-b border-slate-200/80 pb-3">Portal Settings</h2>
            <p className="text-slate-700">Configure notification alerts, E-Signature preferences, and verification sync interval.</p>
          </div>
        )}

      </main>

    </div>
  );
};
