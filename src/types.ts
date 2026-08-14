export interface BoardCertDocument {
  id: string;
  name: string;
  type: string; // e.g. "American Board of Cardiology Certification"
  issuingBody: string; // e.g. "American Board of Internal Medicine"
  issueDate: string;
  expiryDate: string;
  fileDataUrl?: string;
  fileName?: string;
  fileSize?: string;
}

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'NEEDS_REVIEW' | 'REJECTED';

export interface DoctorProfile {
  id: string;
  fullName: string;
  post: string; // e.g., "Senior Consultant & Head of Department"
  npiNumber: string; // 10-digit NPI
  medicalCouncilNumber: string; // e.g. "GMC-8941029" or "SMC-55102"
  licenseNumber: string; // e.g. "CA-MD-881940"
  speciality: string; // e.g. "Cardiology"
  hospitalAffiliation: string; // e.g. "Johns Hopkins Hospital"
  email: string;
  phone: string;
  yearsOfPractice: number;
  boardCertifications: BoardCertDocument[];
  
  // Verification Results & Integrity Metros
  status: VerificationStatus;
  confidenceScore: number; // 0-100
  verifiedAt?: string;
  verificationBadgeId: string;
  aiAuditSummary?: string;
  mismatches?: string[];
  securityHash?: string;
  
  // Integration Details & Security
  securityPassword?: string; // Private Doctor Access Password
  integrationToken: string;
  embeddedViewsCount: number;
  lastVerifiedCheck?: string;
}

// Clinical Portal Domain Types
export interface PatientRecord {
  id: string;
  mrn: string;
  fullName: string;
  age: number;
  gender: string;
  dob: string;
  bloodGroup: string;
  phone: string;
  email: string;
  allergies: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  importantAlerts: string[];
  status: 'Active' | 'New' | 'Follow-up' | 'High-Priority';
  lastVisit: string;
  condition: string;
  medicalHistory: string[];
  currentMedications: {
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
  }[];
  diagnosesHistory: {
    code: string;
    condition: string;
    diagnosedDate: string;
    status: string;
  }[];
  vitalsHistory: {
    date: string;
    bp: string;
    hr: number;
    temp: number;
    spo2: number;
    rr: number;
    weight: number;
    height: number;
    bmi: number;
  }[];
  labReports: {
    id: string;
    title: string;
    date: string;
    category: string;
    status: 'Normal' | 'Abnormal' | 'Critical';
    reviewedByDoctor: boolean;
    findings: string;
    previousVal?: string;
    currentVal?: string;
    trend?: 'improving' | 'worsening' | 'stable';
  }[];
  consultationHistory: {
    id: string;
    date: string;
    doctorName: string;
    chiefComplaint: string;
    diagnosis: string;
    treatmentPlan: string;
  }[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  time: string;
  date: string;
  type: 'In-Person' | 'Telemedicine' | 'Follow-Up' | 'Emergency';
  mode: 'Clinic' | 'Video Call';
  status: 'Scheduled' | 'Waiting' | 'In-Progress' | 'Completed' | 'Cancelled' | 'No-Show';
  reason: string;
  isHighPriority?: boolean;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  strength: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  foodRelation: 'Before Food' | 'After Food' | 'With Food' | 'Empty Stomach';
  quantity: number;
  instructions: string;
  refillsAllowed: number;
}

export interface ReferralRecord {
  id: string;
  patientId: string;
  patientName: string;
  referringDoctor: string;
  targetSpecialty: string;
  targetPhysician: string;
  reason: string;
  createdDate: string;
  status: 'Created' | 'Sent' | 'Accepted' | 'Consultation Completed';
  attachedReportIds: string[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  patientName: string;
  patientMrn: string;
  ipAddress: string;
  status: 'AUTHORIZED' | 'SECURITY_FLAG';
}

export interface NPIRegistryResult {
  validFormat: boolean;
  npi: string;
  providerType: string;
  primarySpecialty: string;
  licenseStatus: string;
  state: string;
  address: string;
  enumerationDate: string;
}

export interface VerificationAiResult {
  status: VerificationStatus;
  confidenceScore: number;
  summary: string;
  mismatches: string[];
  verifiedFields: {
    fullNameMatch: boolean;
    npiMatch: boolean;
    licenseMatch: boolean;
    councilMatch: boolean;
    certValid: boolean;
  };
  securityHash: string;
}
