'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { User, ClipboardList, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { toast } from '@/app/hooks/use-toast';
import { checkInteractions } from '@/app/actions';

// --- Interfaces ---
interface DrugInteraction {
  drugA: string;
  drugB: string;
  riskLevel: 'None' | 'Low' | 'Moderate' | 'High';
  description: string;
  alternatives?: string[];
}

interface DetectDrugInteractionsOutput {
  interactions: DrugInteraction[];
}

interface PatientDetail {
  username: string;
  name: string;
  email: string;
  phone?: string;
  dob?: string;
}

interface MedicationHistory {
  drug: string;
  dosage: string;
  frequency: string;
  date: string;
}

interface PharmaPatientHistoryProps {
  patientUsername: string;
}

// --- Helper ---
const parseResponse = async (res: Response, endpoint: string) => {
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return await res.json();
};

const PharmaPatientHistory: React.FC<PharmaPatientHistoryProps> = ({ patientUsername }) => {
  const [patientDetails, setPatientDetails] = useState<PatientDetail | null>(null);
  const [medicationHistory, setMedicationHistory] = useState<MedicationHistory[]>([]);
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [interactionLoading, setInteractionLoading] = useState(false);

  const getInteractionBadgeClasses = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-500 text-white';
      case 'Moderate': return 'bg-yellow-400 text-gray-900';
      case 'Low': return 'bg-orange-300 text-gray-900';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const runInteractionCheck = useCallback(async (drugs: string[]) => {
    if (drugs.length < 2) return setInteractions([]);
    setInteractionLoading(true);
    try {
      const res = await checkInteractions(drugs) as DetectDrugInteractionsOutput;
      setInteractions(res.interactions || []);
      if (res.interactions && res.interactions.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Interaction Alert',
          description: 'Potential drug interactions detected!',
        });
      }
    } catch (e) {
      console.error(e);
      toast({ title: 'Interaction check failed', variant: 'destructive' });
    } finally {
      setInteractionLoading(false);
    }
  }, []);

  // --- Fetch patient + meds ---
  useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    // Reset previous patient’s data before loading new
    setPatientDetails(null);
    setMedicationHistory([]);
    setInteractions([]);

    try {
      const patientsRes = await fetch(`/api/patient`);
      const patientsData = await parseResponse(patientsRes, '/api/patient');
      const found = patientsData.patients.find((p: PatientDetail) => p.username === patientUsername);
      if (!found) {
        setLoading(false);
        return;
      }

      setPatientDetails(found);
      const medsRes = await fetch(`/api/patient/${encodeURIComponent(found.email)}`);
      const medsData = await parseResponse(medsRes, `/api/patient/${found.email}`);
      const history = (medsData.patient?.medications || []).map((m: any) => ({
        drug: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        date: new Date().toISOString().split('T')[0],
      }));
      setMedicationHistory(history);

      if (history.length > 1) {
        runInteractionCheck(history.map(({ drug }: { drug: string }) => drug));
      } else {
        // Explicitly clear old interaction data
        setInteractions([]);
      }

    } catch {
      toast({ title: 'Error loading patient data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [patientUsername, runInteractionCheck]);


  // Helpers
  const isDrugInteracting = (drug: string) =>
    interactions.some(int => int.drugA === drug || int.drugB === drug);

  const getDrugRisk = (drug: string): 'None' | 'Low' | 'Moderate' | 'High' => {
    const relevant = interactions.filter(
      int => int.drugA === drug || int.drugB === drug
    );
    if (relevant.length === 0) return 'None';
    const risks = relevant.map(r => r.riskLevel);
    if (risks.includes('High')) return 'High';
    if (risks.includes('Moderate')) return 'Moderate';
    if (risks.includes('Low')) return 'Low';
    return 'None';
  };

  // --- Render ---
  if (loading)
    return (
      <div className="text-center py-10 text-blue-500">
        <Activity className="animate-spin inline-block mr-2" /> Loading patient data...
      </div>
    );

return (
    <div className="space-y-8">
      {/* Patient Info */}
      <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-teal-500">
        <h4 className="text-xl font-semibold text-gray-800 flex items-center mb-3">
          <User className="w-5 h-5 mr-2 text-teal-500" /> Patient Basic Information
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><span className="font-medium text-gray-600">Name:</span> {patientDetails?.name}</p>
          <p><span className="font-medium text-gray-600">Username:</span> {patientDetails?.username}</p>
          <p><span className="font-medium text-gray-600">Email:</span> {patientDetails?.email}</p>
          <p><span className="font-medium text-gray-600">DOB:</span> {patientDetails?.dob || 'N/A'}</p>
        </div>
      </div>

      {/* Interaction Summary */}
      {medicationHistory.length > 1 && (
        interactionLoading ? (
          <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg flex items-center gap-3">
            <Activity className="animate-spin w-5 h-5" /> Checking for drug interactions...
          </div>
        ) : interactions.length > 0 ? (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold">
                {interactions.length} Potential Drug Interactions Detected!
              </p>
              <p className="text-sm mt-1">
                Review the interaction details below before dispensing.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5" /> No significant drug interactions detected.
          </div>
        )
      )}

      {/* Medication Table */}
      <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-purple-500">
        <h4 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
          <ClipboardList className="w-5 h-5 mr-2 text-purple-500" /> Medication History
        </h4>
        {medicationHistory.length > 0 ? (
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead>
              <tr className="bg-purple-50 text-purple-800 text-left font-semibold uppercase tracking-wider">
                <th className="p-3">Drug</th>
                <th className="p-3">Dosage</th>
                <th className="p-3">Frequency</th>
                <th className="p-3">Date</th>
                <th className="p-3">Interaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {medicationHistory.map((m, i) => (
                <tr key={i}>
                  <td className="p-3 font-medium text-gray-800">{m.drug}</td>
                  <td className="p-3">{m.dosage}</td>
                  <td className="p-3">{m.frequency}</td>
                  <td className="p-3">{m.date}</td>
                  <td className="p-3">
                    {isDrugInteracting(m.drug) ? (
                      <span
                        className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getInteractionBadgeClasses(getDrugRisk(m.drug))}`}
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" /> {getDrugRisk(m.drug)} Risk
                      </span>
                    ) : (
                      <span
                        className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getInteractionBadgeClasses('None')}`}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" /> Safe
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
            No medication history found.
          </div>
        )}
      </div>

      {/* --- Full Interaction Details Section --- */}
      {interactions.length > 0 && (
        <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-red-500">
          <h4 className="text-xl font-semibold text-gray-800 flex items-center mb-4 text-red-700">
            <AlertTriangle className="w-5 h-5 mr-2" /> Detailed Drug Interactions ({interactions.length})
          </h4>
          <div className="space-y-4">
            {interactions.map((int, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${int.riskLevel === 'High' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-800">
                    {int.drugA} <span className='text-red-500'>+</span> {int.drugB}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${getInteractionBadgeClasses(int.riskLevel)}`}>
                    {int.riskLevel} Risk
                  </span>
                </div>
                <p className="text-sm text-gray-700">{int.description}</p>
                {int.alternatives && int.alternatives.length > 0 && (
                  <p className="text-xs text-gray-500 italic mt-1">
                    Alternatives: {int.alternatives.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmaPatientHistory;
