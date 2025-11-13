'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { User, Activity, MessageSquare, ClipboardList, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from '@/app/hooks/use-toast';

// NOTE: You MUST replace this with your actual interaction checker function 
// and define the return type (e.g., in a separate types file or directly here 
// if you prefer, but it's recommended to keep types separate).
// For the example, I'm defining a minimal required type for the component 
// to render the interaction details.
// You need to ensure the imported function and type exist in your project.
import { checkInteractions } from '@/app/actions';

// --- MINIMAL INTERFACE REQUIRED FOR RENDERING ---
// You will need to make sure your 'checkInteractions' function returns an object 
// that matches this structure.
interface DrugInteraction {
    drugA: string;
    drugB: string;
    riskLevel: 'None' | 'Low' | 'Moderate' | 'High';
    description: string;
    alternatives?: string[];
}
interface DetectDrugInteractionsOutput {
    interactions: DrugInteraction[];
    // Other fields if your action returns them
}
// ------------------------------------------------

// Interfaces are kept the same
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
    date: string; // Date of prescription/fill
}

// Re-using your Medication interface for clarity
interface Medication {
    id: number;
    name: string;
    rxNumber: string;
    doctor: string;
    pills: number;
    dosage: string;
    frequency: string;
    form: string;
}

interface DoctorPatientHistoryProps {
    patientUsername: string;
    doctorUsername: string;
    messageContent: string; // Full message content
    messageDate: string;
}

// Helper function for safer JSON parsing
const parseResponse = async (res: Response, endpoint: string) => {
    if (!res.ok) {
        const errorText = await res.text();
        console.error(`API Error on ${endpoint} (${res.status}):`, errorText);
        throw new Error(`Failed to fetch ${endpoint}. Status: ${res.status}. See console for details.`);
    }
    try {
        return await res.json();
    } catch (e) {
        const text = await res.text();
        console.error(`Invalid JSON received from ${endpoint}. Response text:`, text, e);
        throw new Error(`Invalid data format received from ${endpoint}.`);
    }
};

const DoctorPatientHistory: React.FC<DoctorPatientHistoryProps> = ({
    patientUsername,
    doctorUsername,
    messageContent,
    messageDate,
}) => {
    const [patientDetails, setPatientDetails] = useState<PatientDetail | null>(null);
    const [medicationHistory, setMedicationHistory] = useState<MedicationHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- NEW STATES FOR INTERACTION CHECKER ---
    const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
    const [interactionLoading, setInteractionLoading] = useState(false);

    // Helper function to get badge class for risk level
    const getInteractionBadgeClasses = (risk: string | undefined) => {
        switch (risk) {
            case 'High': return 'bg-red-500 text-white';
            case 'Moderate': return 'bg-yellow-500 text-gray-900';
            case 'Low': return 'bg-orange-300 text-gray-900';
            default: return 'bg-green-100 text-green-800';
        }
    };

    // --- NEW FUNCTION: Run Drug Interaction Check ---
    const runInteractionCheck = useCallback(async (drugList: string[]) => {
        if (drugList.length < 2) {
            setInteractions([]);
            return;
        }
        setInteractionLoading(true);
        // Clear previous generic error if we are running the check
        setError(null);

        try {
            // Call the imported interaction checker function using the actual drug list
            const response = await checkInteractions(drugList) as DetectDrugInteractionsOutput;

            if (response && 'error' in response) {
                // If your checkInteractions returns an error object
                setError(`Interaction Check Error: ${response.error}`);
                setInteractions([]);
            } else {
                // Assuming success, set the interactions array
                setInteractions(response.interactions ?? []);
                if (response.interactions && response.interactions.length > 0) {
                    toast({
                        variant: 'destructive',
                        title: 'Interaction Alert',
                        description: 'Potential drug interactions detected. Review the history.',
                        duration: 5000
                    });
                }
            }
        } catch (e: any) {
            console.error("Interaction check failed:", e);
            // Only set a temporary interaction error, don't override the main patient error
            toast({
                variant: 'destructive',
                title: 'Interaction Check Failed',
                description: e.message || 'Could not connect to the drug interaction checker.',
            });
            setInteractions([]);
        } finally {
            setInteractionLoading(false);
        }
    }, []);

    // --- INITIAL FETCH LOGIC (Relying on DB) ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        let patientEmail = '';

        try {
            // 1. Fetch Patient Details
            const patientListRes = await fetch(`/api/patient`);
            const patientListData = await parseResponse(patientListRes, '/api/patient');

            const foundPatient = patientListData.patients.find(
                (p: PatientDetail) => p.username === patientUsername
            );

            if (foundPatient) {
                const details: PatientDetail = {
                    username: foundPatient.username,
                    name: foundPatient.name,
                    email: foundPatient.email,
                    dob: foundPatient.dob || 'N/A',
                    phone: foundPatient.phone || 'N/A',
                };
                setPatientDetails(details);
                patientEmail = foundPatient.email;
            } else {
                setPatientDetails({
                    username: patientUsername,
                    name: 'N/A',
                    email: 'N/A',
                    dob: 'N/A',
                } as PatientDetail);
                setLoading(false);
                return;
            }

            // 2. Fetch Medication History 
            if (patientEmail && patientEmail !== 'N/A') {
                const medsRes = await fetch(`/api/patient/${encodeURIComponent(patientEmail)}`);
                const medsData = await parseResponse(medsRes, `/api/patient/${patientEmail}`);

                const rawMedications: Medication[] = medsData.patient?.medications || [];

                // Map the raw medications to the required MedicationHistory format
                const history: MedicationHistory[] = rawMedications.map(med => ({
                    drug: med.name,
                    dosage: med.dosage,
                    frequency: med.frequency,
                    // NOTE: Use the actual date from your model if available
                    date: new Date().toISOString().split('T')[0],
                }));
                setMedicationHistory(history);
            } else {
                setMedicationHistory([]);
            }

        } catch (err: any) {
            console.error('Overall patient history fetch failed:', err);
            toast({
                title: "Error fetching history",
                description: err.message || 'An unknown error occurred.',
                variant: 'destructive'
            });
            setError(err.message || 'An unknown error occurred while loading patient details.');
        } finally {
            setLoading(false);
        }
    }, [patientUsername]);

    useEffect(() => {
        if (patientUsername) {
            fetchData();
        }
    }, [patientUsername, fetchData]);


    // --- NEW USE EFFECT: Trigger Interaction Check ---
    useEffect(() => {
        // Only run if medications are loaded and the initial loading is complete
        if (medicationHistory.length > 0 && !loading) {
            runInteractionCheck(medicationHistory.map(m => m.drug));
        } else if (medicationHistory.length <= 1) {
            setInteractions([]); // Clear interactions if only one drug exists
        }
    }, [medicationHistory, loading, runInteractionCheck]);


    // Check if a specific drug is involved in any interaction
    const isDrugInteracting = (drugName: string) => {
        return interactions.some(
            // Case-insensitive check
            int => int.drugA.toLowerCase() === drugName.toLowerCase() || int.drugB.toLowerCase() === drugName.toLowerCase()
        );
    };

    // Determine the highest risk level for a single drug
    const getDrugRisk = (drugName: string): 'None' | 'Low' | 'Moderate' | 'High' => {
        const involvedInteractions = interactions.filter(
            int => int.drugA.toLowerCase() === drugName.toLowerCase() || int.drugB.toLowerCase() === drugName.toLowerCase()
        );

        if (involvedInteractions.length === 0) return 'None';

        const risks: ('None' | 'Low' | 'Moderate' | 'High')[] = involvedInteractions.map(int => int.riskLevel);
        if (risks.includes('High')) return 'High';
        if (risks.includes('Moderate')) return 'Moderate';
        if (risks.includes('Low')) return 'Low';
        return 'None';
    }


    // --- JSX Rendering ---
    if (loading) {
        return (
            <div className="text-center py-10 text-lg text-blue-500">
                <Activity className="animate-spin inline-block mr-2" /> Loading patient history...
            </div>
        );
    }

    if (error && !interactionLoading) {
        return (
            <div className="text-center py-10 text-lg text-red-500 bg-red-50 rounded-lg">
                <span className="font-bold">Error:</span> {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Patient Details Card (Unchanged) */}
            <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-blue-500">
                <h4 className="text-xl font-semibold text-gray-800 flex items-center mb-3">
                    <User className="w-5 h-5 mr-2 text-blue-500" /> Patient Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                        <span className="font-medium text-gray-600">Name:</span> {patientDetails?.name || 'N/A'}
                    </p>
                    <p>
                        <span className="font-medium text-gray-600">Username:</span> {patientDetails?.username}
                    </p>
                    <p>
                        <span className="font-medium text-gray-600">Email:</span> {patientDetails?.email || 'N/A'}
                    </p>
                    <p>
                        <span className="font-medium text-gray-600">Date of Birth:</span> {patientDetails?.dob ? new Date(patientDetails.dob).toLocaleDateString() : 'N/A'}
                    </p>
                </div>
            </div>

            {/* Full Message Content (Unchanged) */}
            <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-green-500">
                <h4 className="text-xl font-semibold text-gray-800 flex items-center mb-3">
                    <MessageSquare className="w-5 h-5 mr-2 text-green-500" /> Full Message from Patient
                </h4>
                <p className="text-sm text-gray-500 mb-3">
                    Date: {new Date(messageDate).toLocaleString()}
                </p>
                <blockquote className="border-l-4 border-gray-200 pl-4 py-2 bg-gray-50 rounded-r-md italic text-gray-700">
                    {messageContent}
                </blockquote>
            </div>

            {/* --- Interaction Summary Alert --- */}
            {medicationHistory.length < 2 ? null : interactionLoading ? (
                <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg flex items-center gap-3">
                    <Activity className="animate-spin w-5 h-5" /> Checking for drug interactions...
                </div>
            ) : interactions.length > 0 ? (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                    <div>
                        <p className="font-bold">CRITICAL WARNING: {interactions.length} Potential Drug Interactions Detected!</p>
                        <p className="text-sm mt-1">Review the **Interaction Status** column in the table below immediately before prescribing/treating.</p>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" /> No significant drug interactions detected between current medications.
                </div>
            )}
            {/* --- END Interaction Summary Alert --- */}


            {/* Medication History with Interaction Column */}
            <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-purple-500">
                <h4 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                    <ClipboardList className="w-5 h-5 mr-2 text-purple-500" /> Medication History
                </h4>
                {medicationHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-purple-50 text-purple-800 text-left font-semibold uppercase tracking-wider">
                                    <th className="p-3">Drug</th>
                                    <th className="p-3">Dosage</th>
                                    <th className="p-3">Frequency</th>
                                    <th className="p-3">Date (Approx.)</th>
                                    {/* NEW COLUMN */}
                                    <th className="p-3">Interaction Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {medicationHistory.map((med, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="p-3 font-medium text-gray-800">{med.drug}</td>
                                        <td className="p-3">{med.dosage}</td>
                                        <td className="p-3">{med.frequency}</td>
                                        <td className="p-3">{new Date(med.date).toLocaleDateString()}</td>
                                        {/* NEW CELL WITH BADGE */}
                                        <td className="p-3">
                                            {isDrugInteracting(med.drug) ? (
                                                <span
                                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getInteractionBadgeClasses(getDrugRisk(med.drug))}`}
                                                    title={`Interacts with other medications. Highest Risk: ${getDrugRisk(med.drug)}`}
                                                >
                                                    <AlertTriangle className="w-3 h-3 inline-block mr-1" />
                                                    {getDrugRisk(med.drug)} Risk
                                                </span>
                                            ) : (
                                                <span
                                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getInteractionBadgeClasses('None')}`}
                                                >
                                                    <CheckCircle className="w-3 h-3 inline-block mr-1" /> Safe
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                        No prior medication history found in the database.
                    </div>
                )}
            </div>

            {/* --- Full Interaction Details Section (Optional but highly recommended) --- */}
            {interactions.length > 0 && (
                <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-red-500">
                    <h4 className="text-xl font-semibold text-gray-800 flex items-center mb-4 text-red-700">
                        <AlertTriangle className="w-5 h-5 mr-2" /> Detailed Drug Interactions ({interactions.length})
                    </h4>
                    <div className="space-y-4">
                        {interactions.map((int, i) => (
                            <div key={i} className={`p-3 rounded-lg border ${int.riskLevel === 'High' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'}`}>
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
                                        **Alternatives:** {int.alternatives.join(', ')}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* --- END Full Interaction Details Section --- */}

        </div>
    );
};

export default DoctorPatientHistory;