import { DoctorProfile } from '../types';

export const initialDoctors: DoctorProfile[] = [
  {
    id: 'doc-101',
    fullName: 'Dr. Alexandra Chen, MD, FACC',
    post: 'Chief of Interventional Cardiology',
    npiNumber: '1982736410',
    medicalCouncilNumber: 'SMC-482019',
    licenseNumber: 'CA-MD-902184',
    speciality: 'Cardiology & Cardiovascular Disease',
    hospitalAffiliation: 'Johns Hopkins Medical Center',
    email: 'a.chen@jhmedical.org',
    phone: '+1 (415) 892-3011',
    yearsOfPractice: 16,
    boardCertifications: [
      {
        id: 'cert-1',
        name: 'Board Certification in Cardiovascular Disease',
        type: 'Diplomate Certification',
        issuingBody: 'American Board of Internal Medicine (ABIM)',
        issueDate: '2012-06-15',
        expiryDate: '2032-06-15',
        fileName: 'ABIM_Cardiology_Cert_DrChen.pdf',
        fileSize: '2.4 MB'
      },
      {
        id: 'cert-2',
        name: 'Interventional Cardiology Subspecialty',
        type: 'Subspecialty Board',
        issuingBody: 'American College of Cardiology',
        issueDate: '2015-09-20',
        expiryDate: '2035-09-20',
        fileName: 'ACC_Interventional_Chen.pdf',
        fileSize: '1.8 MB'
      }
    ],
    status: 'VERIFIED',
    confidenceScore: 99,
    verifiedAt: '2026-08-01T10:15:00Z',
    verificationBadgeId: 'MEDAUTH-88210-CHEN',
    aiAuditSummary: 'All credentials validated against NPI Registry and ABIM Board Verification API. License CA-MD-902184 active with 0 adverse regulatory actions.',
    mismatches: [],
    securityHash: 'e9a4f210b39c08d172e51920acbd3211f8e4c01',
    integrationToken: 'mat_live_9921_chen_JHMC_782',
    embeddedViewsCount: 1420,
    lastVerifiedCheck: '2026-08-06T14:22:00Z'
  },
  {
    id: 'doc-102',
    fullName: 'Dr. Robert Harrison, MD, PhD',
    post: 'Attending Neurosurgeon & Associate Professor',
    npiNumber: '1470293811',
    medicalCouncilNumber: 'GMC-702918',
    licenseNumber: 'NY-MD-440192',
    speciality: 'Neurosurgery & Spine Surgery',
    hospitalAffiliation: 'Mount Sinai Medical Center',
    email: 'r.harrison@mountsinai.org',
    phone: '+1 (212) 555-0198',
    yearsOfPractice: 12,
    boardCertifications: [
      {
        id: 'cert-3',
        name: 'American Board of Neurological Surgery (ABNS)',
        type: 'Board Certification',
        issuingBody: 'American Board of Medical Specialties',
        issueDate: '2016-04-10',
        expiryDate: '2036-04-10',
        fileName: 'ABNS_Certification_Harrison.pdf',
        fileSize: '3.1 MB'
      }
    ],
    status: 'VERIFIED',
    confidenceScore: 97,
    verifiedAt: '2026-07-28T09:30:00Z',
    verificationBadgeId: 'MEDAUTH-44190-HARR',
    aiAuditSummary: 'NPI 1470293811 matched with State License NY-MD-440192. Official board record confirmed active standing.',
    mismatches: [],
    securityHash: '8b3c9d1a702e881023c4a77021e90211a30f199',
    integrationToken: 'mat_live_4419_harr_MTS_901',
    embeddedViewsCount: 890,
    lastVerifiedCheck: '2026-08-05T11:00:00Z'
  },
  {
    id: 'doc-103',
    fullName: 'Dr. Priya Sharma, MD, FAAP',
    post: 'Senior Pediatrician & Clinical Director',
    npiNumber: '1628109344',
    medicalCouncilNumber: 'NMC-881920',
    licenseNumber: 'TX-MD-652019',
    speciality: 'Pediatric Endocrinology',
    hospitalAffiliation: 'Texas Children\'s Hospital',
    email: 'priya.sharma@texaschildrens.org',
    phone: '+1 (713) 555-8821',
    yearsOfPractice: 14,
    boardCertifications: [
      {
        id: 'cert-4',
        name: 'American Board of Pediatrics (ABP)',
        type: 'Board Certification',
        issuingBody: 'American Board of Pediatrics',
        issueDate: '2014-08-18',
        expiryDate: '2034-08-18',
        fileName: 'ABP_Pediatrics_Sharma.pdf',
        fileSize: '1.9 MB'
      }
    ],
    status: 'VERIFIED',
    confidenceScore: 98,
    verifiedAt: '2026-08-02T16:45:00Z',
    verificationBadgeId: 'MEDAUTH-65201-SHAR',
    aiAuditSummary: 'NPI 1628109344 verified. Pediatric Specialty credentials matched with Texas Medical Board registry.',
    mismatches: [],
    securityHash: '1a9f023c8810d29e771c990a881d39021e1022f',
    integrationToken: 'mat_live_6520_shar_TCH_102',
    embeddedViewsCount: 2310,
    lastVerifiedCheck: '2026-08-07T08:10:00Z'
  },
  {
    id: 'doc-104',
    fullName: 'Dr. Marcus Vance, MD',
    post: 'Consultant Orthopedic Surgeon',
    npiNumber: '1109823471',
    medicalCouncilNumber: 'GMC-331029',
    licenseNumber: 'FL-MD-118204',
    speciality: 'Orthopedic Surgery & Sports Medicine',
    hospitalAffiliation: 'Mayo Clinic Regional Health System',
    email: 'm.vance@mayoclinic.org',
    phone: '+1 (904) 555-4012',
    yearsOfPractice: 9,
    boardCertifications: [
      {
        id: 'cert-5',
        name: 'American Board of Orthopaedic Surgery (ABOS)',
        type: 'Board Certification',
        issuingBody: 'ABOS Council',
        issueDate: '2019-05-12',
        expiryDate: '2029-05-12',
        fileName: 'ABOS_Vance_Orthopedics.pdf',
        fileSize: '2.8 MB'
      }
    ],
    status: 'NEEDS_REVIEW',
    confidenceScore: 82,
    verifiedAt: '2026-08-06T11:20:00Z',
    verificationBadgeId: 'MEDAUTH-11820-VANC',
    aiAuditSummary: 'Hospital affiliation name on certification reads "Mayo Clinic Florida" vs submitted "Mayo Clinic Regional Health System". AI flagged for minor name variation review.',
    mismatches: ['Affiliation wording discrepancy (Mayo Clinic Florida vs Mayo Clinic Regional Health System)'],
    securityHash: '72c1092a110d882910c0129f123011a091022a1',
    integrationToken: 'mat_live_1182_vanc_MAYO_410',
    embeddedViewsCount: 120,
    lastVerifiedCheck: '2026-08-06T11:20:00Z'
  }
];
