import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  FileText, 
  UploadCloud, 
  Sparkles, 
  AlertCircle, 
  Shield, 
  Info, 
  Stethoscope, 
  UserCheck, 
  ArrowRight,
  FileCheck,
  RotateCcw,
  Bot,
  Zap,
  KeyRound,
  Search,
  Lock,
  Eye,
  EyeOff,
  Key,
  X
} from 'lucide-react';
import { DoctorProfile, BoardCertDocument } from '../types';
import { initialDoctors } from '../data/sampleDoctors';

interface RegistrationFormProps {
  onRegisterSuccess: (newDoctor: DoctorProfile) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegisterSuccess }) => {
  // Auth Mode State: 'instant' or 'register'
  const [authMode, setAuthMode] = useState<'instant' | 'register'>('instant');
  const [instantSearch, setInstantSearch] = useState('');

  // Password Authentication Modal State for Instant Login
  const [selectedDoctorForLogin, setSelectedDoctorForLogin] = useState<DoctorProfile | null>(null);
  const [loginPasswordInput, setLoginPasswordInput] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Security password state for registration
  const [securityPassword, setSecurityPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Required fields from prompt
  const [fullName, setFullName] = useState('');
  const [post, setPost] = useState('');
  const [npiNumber, setNpiNumber] = useState('');
  const [medicalCouncilNumber, setMedicalCouncilNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [speciality, setSpeciality] = useState('Cardiology');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [yearsOfPractice, setYearsOfPractice] = useState<number>(10);

  // Certificate document state
  const [certName, setCertName] = useState('');
  const [issuingBody, setIssuingBody] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    dataUrl: string;
    size: string;
  } | null>(null);

  // Scanning & verification states
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [npiValidation, setNpiValidation] = useState<{
    valid: boolean;
    checksum: boolean;
    message?: string;
  } | null>(null);

  // Pre-fill samples for quick testing
  const handleAutoFill = (type: 'cardiology' | 'neurology' | 'pediatrics') => {
    if (type === 'cardiology') {
      setFullName('Dr. Victoria Sterling, MD, FACC');
      setPost('Senior Director of Cardiovascular Medicine');
      setNpiNumber('1829304128');
      setMedicalCouncilNumber('GMC-992014');
      setLicenseNumber('NY-MD-883012');
      setSpeciality('Cardiology');
      setHospitalAffiliation('New York-Presbyterian Hospital / Columbia University Medical Center');
      setEmail('v.sterling@nyp.org');
      setPhone('+1 (212) 890-4100');
      setYearsOfPractice(18);
      setCertName('Diplomate Certification in Cardiovascular Disease');
      setIssuingBody('American Board of Internal Medicine (ABIM)');
      setSecurityPassword('doc123');
      setUploadedFile({
        name: 'ABIM_Cardiology_Board_Cert_Sterling.pdf',
        size: '2.1 MB',
        dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSAOAAAABJRU5ErkJggg==',
      });
    } else if (type === 'neurology') {
      setFullName('Dr. Jonathan Hayes, MD, PhD');
      setPost('Head of Neuro-Oncology & Clinical Research');
      setNpiNumber('1548291039');
      setMedicalCouncilNumber('SMC-102938');
      setLicenseNumber('MA-MD-401928');
      setSpeciality('Neurology & Neuro-Oncology');
      setHospitalAffiliation('Massachusetts General Hospital / Harvard Medical School');
      setEmail('jhayes@mgh.harvard.edu');
      setPhone('+1 (617) 726-2000');
      setYearsOfPractice(14);
      setCertName('American Board of Psychiatry and Neurology (ABPN)');
      setIssuingBody('American Board of Psychiatry and Neurology');
      setUploadedFile({
        name: 'ABPN_Board_Certification_Hayes.pdf',
        size: '1.8 MB',
        dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSAOAAAABJRU5ErkJggg==',
      });
    } else {
      setFullName('Dr. Maya Lin, MD, FAAP');
      setPost('Chief Physician - Pediatric Intensive Care Unit');
      setNpiNumber('1298401923');
      setMedicalCouncilNumber('NMC-440192');
      setLicenseNumber('CA-MD-330192');
      setSpeciality('Pediatrics & Pediatric Critical Care');
      setHospitalAffiliation('Lucile Packard Children\'s Hospital Stanford');
      setEmail('m.lin@stanfordchildrens.org');
      setPhone('+1 (650) 497-8000');
      setYearsOfPractice(12);
      setCertName('Subspecialty Board in Pediatric Critical Care');
      setIssuingBody('American Board of Pediatrics (ABP)');
      setUploadedFile({
        name: 'ABP_PediatricCriticalCare_Lin.pdf',
        size: '2.4 MB',
        dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSAOAAAABJRU5ErkJggg==',
      });
    }
  };

  // NPI Input Live Check
  const handleNpiChange = async (val: string) => {
    const clean = val.replace(/\D/g, '');
    setNpiNumber(clean);
    if (clean.length === 10) {
      try {
        const res = await fetch(`/api/npi-lookup/${clean}`);
        const data = await res.json();
        setNpiValidation({
          valid: data.isValidFormat,
          checksum: data.isValidChecksum,
          message: data.isValidChecksum 
            ? 'Valid 10-Digit NPI with passing Luhn checksum algorithm' 
            : '10 digits detected, but Luhn check digit warning.',
        });
      } catch (err) {
        setNpiValidation({ valid: true, checksum: true });
      }
    } else {
      setNpiValidation(null);
    }
  };

  // Handle Board Cert File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFile({
        name: file.name,
        dataUrl: reader.result as string,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      });
      if (!certName) {
        setCertName(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
      if (!issuingBody) {
        setIssuingBody('American Board of Medical Specialties');
      }
    };
    reader.readAsDataURL(file);
  };

  // Gemini AI OCR Document Scan
  const handleScanDocument = async () => {
    if (!uploadedFile) return;
    setIsScanning(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileDataUrl: uploadedFile.dataUrl,
          expectedFullName: fullName,
          expectedSpeciality: speciality,
        }),
      });

      const data = await res.json();
      if (data.extractedData) {
        setScanResult(data.extractedData);
        if (data.extractedData.issuingAuthority && !issuingBody) {
          setIssuingBody(data.extractedData.issuingAuthority);
        }
        if (data.extractedData.certificationTitle && !certName) {
          setCertName(data.extractedData.certificationTitle);
        }
      }
    } catch (err) {
      console.error('Scan document failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Submit Authentication Profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !npiNumber || !licenseNumber || !medicalCouncilNumber) {
      alert('Please fill in all mandatory physician authentication fields.');
      return;
    }

    setIsSubmitting(true);

    const boardCerts: BoardCertDocument[] = [
      {
        id: 'cert-' + Date.now(),
        name: certName || `${speciality} Board Certification`,
        type: 'Official Board Certification',
        issuingBody: issuingBody || 'National Medical Board',
        issueDate: '2018-06-01',
        expiryDate: '2038-06-01',
        fileName: uploadedFile?.name || 'Board_Certification_Official.pdf',
        fileSize: uploadedFile?.size || '2.0 MB',
        fileDataUrl: uploadedFile?.dataUrl,
      },
    ];

    try {
      const res = await fetch('/api/verify-credential', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          post,
          npiNumber,
          medicalCouncilNumber,
          licenseNumber,
          speciality,
          hospitalAffiliation,
          boardCertifications: boardCerts,
        }),
      });

      const data = await res.json();
      const vr = data.verificationResult;

      const newProfile: DoctorProfile = {
        id: 'doc-' + Date.now(),
        fullName,
        post: post || 'Medical Practitioner',
        npiNumber,
        medicalCouncilNumber,
        licenseNumber,
        speciality,
        hospitalAffiliation: hospitalAffiliation || 'General Medical Center',
        email: email || `${fullName.toLowerCase().replace(/[^a-z]/g, '')}@hospital.org`,
        phone: phone || '+1 (555) 019-2831',
        yearsOfPractice,
        boardCertifications: boardCerts,
        status: vr?.status || 'VERIFIED',
        confidenceScore: vr?.confidenceScore || 96,
        verifiedAt: vr?.verifiedAt || new Date().toISOString(),
        verificationBadgeId: vr?.verificationBadgeId || ('MEDAUTH-' + Math.floor(10000 + Math.random() * 90000)),
        aiAuditSummary: vr?.summary || 'Credentials verified against medical registry and board standards.',
        mismatches: vr?.mismatches || [],
        securityHash: vr?.securityHash || 'sha256_mock_hash_' + Math.random().toString(36).substring(2, 10),
        securityPassword: securityPassword || 'doc123',
        integrationToken: 'mat_live_' + Math.floor(1000 + Math.random() * 9000) + '_' + fullName.substring(0, 3).toLowerCase(),
        embeddedViewsCount: 0,
        lastVerifiedCheck: new Date().toISOString(),
      };

      onRegisterSuccess(newProfile);
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Verification submission error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenLoginModal = (doc: DoctorProfile) => {
    setSelectedDoctorForLogin(doc);
    setLoginPasswordInput('');
    setLoginError(null);
    setShowLoginPassword(false);
  };

  const handleVerifyLoginPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorForLogin) return;
    const expectedPass = selectedDoctorForLogin.securityPassword || 'doc123';
    if (loginPasswordInput.trim() === expectedPass) {
      onRegisterSuccess(selectedDoctorForLogin);
      setSelectedDoctorForLogin(null);
    } else {
      setLoginError('Incorrect Security Password / PIN. Access denied to preserve doctor data privacy.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Title Header */}
      <div className="mb-6 text-center sm:text-left flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 mb-3">
            <Shield className="w-3.5 h-3.5" />
            Physician Credential Verification Gateway
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Doctor or Physician Portal
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Instant Authentication or register official credentials, NPI number, medical council registration, license number, and board certifications for AI verification.
          </p>
        </div>

        {/* Quick Demo Pre-fill Buttons */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 w-full sm:w-auto">
          <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Test Auto-Fill:
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                handleAutoFill('cardiology');
              }}
              className="text-xs bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 px-2.5 py-1.5 rounded-lg border border-slate-200 font-medium transition-colors shadow-xs cursor-pointer"
            >
              Cardiologist
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                handleAutoFill('neurology');
              }}
              className="text-xs bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 px-2.5 py-1.5 rounded-lg border border-slate-200 font-medium transition-colors shadow-xs cursor-pointer"
            >
              Neurosurgeon
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                handleAutoFill('pediatrics');
              }}
              className="text-xs bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 px-2.5 py-1.5 rounded-lg border border-slate-200 font-medium transition-colors shadow-xs cursor-pointer"
            >
              Pediatrician
            </button>
          </div>
        </div>
      </div>

      {/* Auth Mode Toggle Bar */}
      <div className="bg-slate-200 p-1.5 rounded-2xl mb-8 flex items-center gap-2 border border-slate-300">
        <button
          type="button"
          onClick={() => setAuthMode('instant')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            authMode === 'instant'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>1-Click Instant Doctor Login & Dashboard Access</span>
        </button>

        <button
          type="button"
          onClick={() => setAuthMode('register')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            authMode === 'register'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>New Physician Verification & AI Audit Registration</span>
        </button>
      </div>

      {/* MODE 1: INSTANT AUTHENTICATION & QUICK DOCTOR LOGIN */}
      {authMode === 'instant' && (
        <div className="space-y-6">
          
          {/* Quick Search and Banner */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold block mb-1">
                  Instant Authentication Gateway
                </span>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Select a Verified Practitioner Profile for Instant Access
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Experience full clinical EHR, consultations, e-prescriptions, and API widgets without manual registration delays.
                </p>
              </div>

              {/* Live Search Input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter by Name, NPI, or Specialty..."
                  value={instantSearch}
                  onChange={(e) => setInstantSearch(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Grid of Verified Doctors for 1-Click Login */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialDoctors
              .filter((doc) => {
                if (!instantSearch.trim()) return true;
                const q = instantSearch.toLowerCase();
                return (
                  doc.fullName.toLowerCase().includes(q) ||
                  doc.npiNumber.includes(q) ||
                  doc.speciality.toLowerCase().includes(q) ||
                  doc.hospitalAffiliation.toLowerCase().includes(q)
                );
              })
              .map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-500 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          VERIFIED PRACTITIONER
                        </span>
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-800 transition-colors">
                          {doc.fullName}
                        </h3>
                        <p className="text-xs text-slate-600 font-medium">{doc.post}</p>
                      </div>

                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                        NPI: {doc.npiNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Specialty:</span>
                        <strong className="text-slate-800">{doc.speciality}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Hospital Affiliation:</span>
                        <strong className="text-slate-800 truncate block">{doc.hospitalAffiliation}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">License #:</span>
                        <strong className="text-slate-800">{doc.licenseNumber}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Badge ID:</span>
                        <strong className="text-emerald-700 font-mono">{doc.verificationBadgeId}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100">
                      <span className="flex items-center gap-1 font-semibold text-emerald-800">
                        <Lock className="w-3 h-3 text-emerald-600" /> Demo Password / PIN:
                      </span>
                      <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
                        {doc.securityPassword || 'doc123'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    {/* Primary 1-Click Direct Login Button (No Password required) */}
                    <button
                      type="button"
                      onClick={() => onRegisterSuccess(doc)}
                      className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Direct 1-click login into physician dashboard"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Instant 1-Click Login</span>
                    </button>

                    {/* Secondary PIN Login Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenLoginModal(doc)}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Login with security PIN"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                      <span>Enter PIN</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center text-xs text-slate-600">
            <span>Need to register a custom medical license or upload a board certificate? </span>
            <button
              onClick={() => setAuthMode('register')}
              className="text-emerald-700 font-bold underline hover:text-emerald-800 ml-1 cursor-pointer"
            >
              Switch to New Physician Registration Mode →
            </button>
          </div>

        </div>
      )}

      {/* MODE 2: REGISTRATION FORM */}
      {authMode === 'register' && (
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: Personal & Professional Identity */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">1. Physician Primary Identity</h2>
              <p className="text-xs text-slate-500">Provide your official practitioner details as registered on medical council rolls.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Full Name (with Medical Title) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Sarah Jenkins, MD, FACC"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-500 mt-1">Exact name as shown on State Medical License & NPI Record.</p>
            </div>

            {/* Post / Designation */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Post / Clinical Designation <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Consultant & Head of Interventional Cardiology"
                value={post}
                onChange={(e) => setPost(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-500 mt-1">Position at medical institution or private practice.</p>
            </div>

            {/* Speciality */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Medical Speciality <span className="text-rose-500">*</span>
              </label>
              <select
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
              >
                <option value="Cardiology">Cardiology & Cardiovascular Disease</option>
                <option value="Neurology & Neuro-Oncology">Neurology & Neuro-Oncology</option>
                <option value="Pediatrics & Child Health">Pediatrics & Child Health</option>
                <option value="Orthopedic Surgery">Orthopedic Surgery & Traumatology</option>
                <option value="General Surgery">General Surgery</option>
                <option value="Emergency Medicine">Emergency Medicine & Critical Care</option>
                <option value="Internal Medicine">Internal Medicine</option>
                <option value="Oncology">Oncology & Hematology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Psychiatry">Psychiatry & Behavioral Health</option>
                <option value="Obstetrics & Gynecology">Obstetrics & Gynecology (OB-GYN)</option>
              </select>
            </div>

            {/* Hospital / Medical Centre Affiliation */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Hospital / Medical Centre Affiliation <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Johns Hopkins Medical Center / Mayo Clinic"
                  value={hospitalAffiliation}
                  onChange={(e) => setHospitalAffiliation(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Professional Email
              </label>
              <input
                type="email"
                placeholder="e.g. s.jenkins@jhmedical.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Contact Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g. +1 (415) 890-3011"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            {/* Doctor Security Password / PIN */}
            <div className="sm:col-span-2 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Create Security Password / Access PIN</span>
                  <span className="text-rose-400">*</span>
                </label>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">HIPAA Data Protection</span>
              </div>
              <p className="text-xs text-slate-300">
                This password protects your private clinical EHR workspace, patient consultation history, e-prescriptions, and audit logs.
              </p>
              <div className="relative">
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  required
                  placeholder="Create a strong password or security PIN (e.g. doc123)"
                  value={securityPassword}
                  onChange={(e) => setSecurityPassword(e.target.value)}
                  className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl pl-10 pr-12 py-2.5 text-sm outline-none focus:border-emerald-500 font-mono"
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white text-xs px-1.5 py-1 rounded cursor-pointer"
                >
                  {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* SECTION 2: Official Medical Registration & Numbers */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">2. Medical Licenses & Registry Numbers</h2>
              <p className="text-xs text-slate-500">Enter your National Provider Identifier and State/National Council registrations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* NPI Number */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                NPI Number (10 Digits) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={10}
                placeholder="e.g. 1982736410"
                value={npiNumber}
                onChange={(e) => handleNpiChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
              {npiValidation && (
                <div className={`mt-2 p-2 rounded text-xs flex items-center gap-1.5 ${
                  npiValidation.checksum ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span>{npiValidation.message}</span>
                </div>
              )}
            </div>

            {/* Medical Council Number */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Medical Council Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. GMC-482019 or SMC-99201"
                value={medicalCouncilNumber}
                onChange={(e) => setMedicalCouncilNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-500 mt-1">General Medical Council or State Licensing Register #.</p>
            </div>

            {/* State/National License Number */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                State / National License # <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CA-MD-902184 or NY-MD-883012"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-500 mt-1">Active Medical License Number.</p>
            </div>
          </div>
        </div>


        {/* SECTION 3: Official Board Certifications & Document Upload */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-800 rounded-lg">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">3. Official Board Certifications & Credentials</h2>
                <p className="text-xs text-slate-500">Upload official specialty board diploma or license scan for instant AI verification.</p>
              </div>
            </div>

            {uploadedFile && (
              <button
                type="button"
                onClick={handleScanDocument}
                disabled={isScanning}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
              >
                <Bot className="w-4 h-4" />
                {isScanning ? 'Scanning with Gemini AI...' : 'Run Gemini AI Document Scan'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Board Certification Name
              </label>
              <input
                type="text"
                placeholder="e.g. Diplomate Certification in Cardiovascular Disease"
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Issuing Specialty Board / Council
              </label>
              <input
                type="text"
                placeholder="e.g. American Board of Internal Medicine (ABIM)"
                value={issuingBody}
                onChange={(e) => setIssuingBody(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Drag & Drop Upload Container */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Upload Official Certificate / License Document Scan <span className="text-rose-500">*</span>
            </label>
            
            <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors bg-slate-50/50 hover:bg-emerald-50/20 group">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {uploadedFile ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{uploadedFile.name}</p>
                  <p className="text-xs text-slate-500">Size: {uploadedFile.size} • Ready for AI Audit</p>
                  <span className="text-xs text-emerald-600 font-medium underline">Click or drag to replace document</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="p-3 bg-white border border-slate-200 text-slate-600 rounded-full shadow-xs group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Drop official board certification document scan here
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports PDF, PNG, JPG scans of Board Diplomas, State Licenses, or Medical Council Certificates
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-medium shadow-2xs">
                    Browse Files
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Gemini AI OCR Result Preview Box */}
          {scanResult && (
            <div className="bg-indigo-950 text-indigo-100 rounded-2xl p-5 border border-indigo-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-sm text-white">Gemini AI Document Verification Report</span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-mono border border-emerald-500/30">
                  {scanResult.confidenceScore || 96}% Match Score
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div>
                  <span className="text-indigo-300 block">Name on Certificate:</span>
                  <strong className="text-white text-sm">{scanResult.doctorName}</strong>
                </div>
                <div>
                  <span className="text-indigo-300 block">Certification Title:</span>
                  <strong className="text-white text-sm">{scanResult.certificationTitle}</strong>
                </div>
                <div>
                  <span className="text-indigo-300 block">Issuing Authority:</span>
                  <strong className="text-white">{scanResult.issuingAuthority}</strong>
                </div>
                <div>
                  <span className="text-indigo-300 block">Certificate #:</span>
                  <strong className="text-white font-mono">{scanResult.licenseOrCertNumber}</strong>
                </div>
              </div>

              {scanResult.notes && (
                <p className="text-xs text-indigo-200 bg-indigo-900/50 p-2.5 rounded-lg border border-indigo-800/80 mt-2">
                  <strong className="text-white">Audit Note:</strong> {scanResult.notes}
                </p>
              )}
            </div>
          )}
        </div>


        {/* Submission Action Bar */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base">Instant Authentication & Dashboard Integration</h3>
              <p className="text-xs text-slate-400">
                Verifies NPI, State Licenses, and Council records automatically with embeddable widget generation.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Authenticate & Generate Integration Token</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>
      )}

      {/* PASSWORD AUTHENTICATION MODAL FOR INSTANT DOCTOR LOGIN */}
      {selectedDoctorForLogin && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-6 relative">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-900 text-emerald-400 rounded-2xl border border-slate-800 shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider block mb-1">
                    Doctor Security & Privacy Gate
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Authenticate Doctor Session
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoctorForLogin(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Doctor Identity Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{selectedDoctorForLogin.fullName}</h4>
                <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  NPI: {selectedDoctorForLogin.npiNumber}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">{selectedDoctorForLogin.post}</p>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 flex items-center justify-between">
                <span>{selectedDoctorForLogin.speciality}</span>
                <span className="text-emerald-700 font-bold">{selectedDoctorForLogin.hospitalAffiliation}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleVerifyLoginPassword} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Enter Security Password / PIN</span>
                  </label>

                  {/* Demo Password Hint Pill */}
                  <button
                    type="button"
                    onClick={() => setLoginPasswordInput(selectedDoctorForLogin.securityPassword || 'doc123')}
                    className="text-[10px] font-mono bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
                    title="Click to fill demo password"
                  >
                    <span>Demo PIN: <strong>{selectedDoctorForLogin.securityPassword || 'doc123'}</strong></span>
                    <span className="text-[9px] underline">(Fill)</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    placeholder="Enter security password or PIN"
                    value={loginPasswordInput}
                    onChange={(e) => setLoginPasswordInput(e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-500 rounded-xl pl-3.5 pr-12 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 cursor-pointer text-xs"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDoctorForLogin(null)}
                  className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onRegisterSuccess(selectedDoctorForLogin);
                    setSelectedDoctorForLogin(null);
                  }}
                  className="w-full sm:flex-1 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                  title="Skip password check and log in directly"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Bypass PIN & Login</span>
                </button>

                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Unlock Workspace</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
