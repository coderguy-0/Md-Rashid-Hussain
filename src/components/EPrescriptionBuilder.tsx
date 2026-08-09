import React, { useState } from 'react';
import { PatientRecord, DoctorProfile, PrescriptionItem } from '../types';
import { 
  Pill, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  FileCheck2, 
  Download, 
  Printer, 
  X,
  Sparkles
} from 'lucide-react';

interface EPrescriptionBuilderProps {
  patient: PatientRecord;
  doctor: DoctorProfile;
  onClose: () => void;
}

export const EPrescriptionBuilder: React.FC<EPrescriptionBuilderProps> = ({
  patient,
  doctor,
  onClose,
}) => {
  // Items List State
  const [items, setItems] = useState<PrescriptionItem[]>([
    {
      id: 'rx-1',
      medicineName: 'Amoxicillin',
      strength: '500mg',
      dosage: '1 Capsule',
      route: 'Oral (PO)',
      frequency: '3 Times Daily (TID)',
      duration: '7 Days',
      foodRelation: 'After Food',
      quantity: 21,
      instructions: 'Complete full course even if symptoms improve.',
      refillsAllowed: 0,
    },
  ]);

  // Form input state for adding new medication
  const [medName, setMedName] = useState('');
  const [strength, setStrength] = useState('10mg');
  const [dosage, setDosage] = useState('1 Tablet');
  const [route, setRoute] = useState('Oral (PO)');
  const [frequency, setFrequency] = useState('Once Daily (OD)');
  const [duration, setDuration] = useState('30 Days');
  const [foodRelation, setFoodRelation] = useState<'Before Food' | 'After Food' | 'With Food' | 'Empty Stomach'>('After Food');
  const [quantity, setQuantity] = useState(30);
  const [instructions, setInstructions] = useState('Take with full glass of water in morning.');
  const [refillsAllowed, setRefillsAllowed] = useState(2);

  // Safety Warnings Flags
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isIssued, setIsIssued] = useState(false);

  // Check for allergy or interaction warnings
  const warnings: string[] = [];
  items.forEach((item) => {
    // Allergy Check
    const nameLower = item.medicineName.toLowerCase();
    patient.allergies.forEach((allergy) => {
      const allergyLower = allergy.toLowerCase();
      if (
        (nameLower.includes('amoxicillin') || nameLower.includes('penicillin')) &&
        (allergyLower.includes('penicillin') || allergyLower.includes('amoxicillin'))
      ) {
        warnings.push(`CRITICAL ALLERGY ALERT: Patient has documented allergy to "${allergy}". "${item.medicineName}" belongs to penicillin class!`);
      }
      if (
        nameLower.includes('aspirin') && allergyLower.includes('aspirin')
      ) {
        warnings.push(`CRITICAL ALLERGY ALERT: Documented severe reaction to Aspirin / NSAIDs.`);
      }
    });

    // Duplicate Medicine Check
    patient.currentMedications.forEach((curr) => {
      if (curr.name.toLowerCase() === nameLower) {
        warnings.push(`DUPLICATE MEDICATION WARNING: Patient is already currently taking "${curr.name} (${curr.dosage})".`);
      }
    });
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    const newItem: PrescriptionItem = {
      id: `rx-${Date.now()}`,
      medicineName: medName,
      strength,
      dosage,
      route,
      frequency,
      duration,
      foodRelation,
      quantity,
      instructions,
      refillsAllowed,
    };

    setItems((prev) => [...prev, newItem]);
    setMedName('');
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleIssue = () => {
    setIsIssued(true);
    setTimeout(() => {
      setShowPreviewModal(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Digital e-Prescription Builder</h2>
              <p className="text-xs text-slate-400">Patient: <strong className="text-emerald-400">{patient.fullName}</strong> ({patient.mrn})</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Warnings Banner */}
        {warnings.length > 0 && (
          <div className="bg-rose-50 border-b border-rose-200 p-4 space-y-1.5 text-xs text-rose-900">
            <div className="flex items-center gap-2 font-bold text-rose-800">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>CLINICAL SAFETY WARNINGS FLAGGED BY SYSTEM ({warnings.length}):</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] font-medium text-rose-800 pl-2">
              {warnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Prescription Builder Form & Items List Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Add Medicine Form */}
          <form onSubmit={handleAddItem} className="lg:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
              + Add Medicine Item
            </h3>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Medicine Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Amoxicillin, Lisinopril, Metformin..."
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Strength</label>
                <input
                  type="text"
                  placeholder="e.g. 500mg, 10mg"
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Dosage</label>
                <input
                  type="text"
                  placeholder="e.g. 1 Tablet"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none text-xs"
                >
                  <option value="Once Daily (OD)">Once Daily (OD)</option>
                  <option value="Twice Daily (BID)">Twice Daily (BID)</option>
                  <option value="3 Times Daily (TID)">3 Times Daily (TID)</option>
                  <option value="4 Times Daily (QID)">4 Times Daily (QID)</option>
                  <option value="As Needed (PRN)">As Needed (PRN)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Food Relation</label>
                <select
                  value={foodRelation}
                  onChange={(e) => setFoodRelation(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 outline-none text-xs"
                >
                  <option value="Before Food">Before Food</option>
                  <option value="After Food">After Food</option>
                  <option value="With Food">With Food</option>
                  <option value="Empty Stomach">Empty Stomach</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Total Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Special Instructions</label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 outline-none text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add To Prescription
            </button>
          </form>

          {/* Right Column: Prescribed Medications Review Table */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Prescribed Medications List ({items.length})
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">Prescriber: {doctor.fullName}</span>
            </div>

            {items.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500 space-y-2">
                <Pill className="w-8 h-8 text-slate-400 mx-auto" />
                <p>No medications added yet. Use the form on the left to add items.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 text-sm">{item.medicineName}</strong>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                          {item.strength}
                        </span>
                        <span className="text-slate-500 text-[10px]">• {item.foodRelation}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        {item.dosage} | {item.frequency} | Duration: {item.duration} (Qty: {item.quantity})
                      </p>
                      <p className="text-slate-500 text-[10px] italic">{item.instructions}</p>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>

              <button
                disabled={items.length === 0}
                onClick={() => setShowPreviewModal(true)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Preview & Digital Sign RX</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Preview & Sign Prescription Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Official e-Prescription Review</h3>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{doctor.fullName}</h4>
                  <p className="text-slate-500 text-[11px]">{doctor.post} • {doctor.hospitalAffiliation}</p>
                  <p className="text-slate-500 text-[11px]">NPI: {doctor.npiNumber} • Council Reg #: {doctor.medicalCouncilNumber}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-800 font-mono block">RX-2026-88901</span>
                  <span className="text-slate-500 text-[11px]">Date: 2026-08-09</span>
                </div>
              </div>

              <div>
                <strong className="text-slate-900 block text-xs mb-1">Patient Details:</strong>
                <p className="text-slate-700">{patient.fullName} | {patient.age} Yrs / {patient.gender} | MRN: {patient.mrn}</p>
              </div>

              <div className="space-y-2">
                <strong className="text-slate-900 block text-xs">Prescribed Items ({items.length}):</strong>
                <div className="divide-y divide-slate-200 bg-white rounded-xl border border-slate-200 p-3">
                  {items.map((i, idx) => (
                    <div key={idx} className="py-2 text-xs">
                      <strong className="text-slate-900">{idx + 1}. {i.medicineName} {i.strength}</strong>
                      <p className="text-slate-600 text-[11px]">{i.dosage} — {i.frequency} x {i.duration} ({i.foodRelation})</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Cryptographic Seal: {doctor.securityHash || 'SEC-VERIFIED-HASH'}</span>
                <span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-bold border border-emerald-300">
                  ✓ Verified Digital Prescriber Seal
                </span>
              </div>
            </div>

            {isIssued ? (
              <div className="p-4 bg-emerald-100 text-emerald-900 font-bold rounded-xl text-xs text-center border border-emerald-300">
                ✓ Prescription Signed & Electronically Transmitted to Pharmacy!
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={handleIssue}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Sign & Issue Prescription</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
