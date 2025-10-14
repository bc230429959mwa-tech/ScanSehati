'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react"; 
import { v4 as uuidv4 } from 'uuid';
import { AlertCircle, Hash, Pill, Stethoscope, Trash2, User } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Label } from '@/app/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useToast } from '@/app/hooks/use-toast';
import { checkInteractions } from '@/app/actions';
import { type DetectDrugInteractionsOutput } from '@/app/ai/flows/detect-drug-interactions';
import PatientMessage from './patientMessage';

interface Prescription {
  uuid: string;
  patientName: string;
  doctorName: string;
  rxNumber: string;
  pills: number;
  dosage: string;
  frequency: string;
  form: string;
  status: "Draft" | "Sent" | "Delivered" | "Issued" | "Cancelled" | "Expired";
}

interface Medication {
  uuid: string;
  name: string;
  rxNumber: string;
  doctor: string;
  pills: number;
  dosage: string;
  frequency: string;
  form: string;
}

interface Doctor {
  id: string;
  fullname: string;
}

export function PatientDashboard() {
  const { data: session } = useSession();
  const { toast } = useToast();

  // Ensure all state has default values
  const [patientName, setPatientName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [interactions, setInteractions] = useState<DetectDrugInteractionsOutput['interactions']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>('');

  // Fetch patient info
  useEffect(() => {
    const fetchPatientInfo = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(`/api/patient/${encodeURIComponent(session.user.email)}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.patient) {
            setPatientName(data.patient.fullName ?? session.user.name ?? '');
            setUsername(data.patient.username ?? '');
            setMedications(data.patient.medications ?? []);
          }
        }
      } catch (err) {
        console.error('Failed to fetch patient info:', err);
      }
    };
    fetchPatientInfo();
  }, [session?.user?.email]);

  // Fetch prescriptions
  useEffect(() => {
    if (!username) return;
    const fetchPrescriptions = async () => {
      try {
        const res = await fetch(`/api/prescriptions?username=${encodeURIComponent(username)}`);
        if (res.ok) {
          const data: Prescription[] = await res.json();
          setPrescriptions(data ?? []);
        }
      } catch (err) {
        console.error('Failed to fetch prescriptions:', err);
      }
    };
    fetchPrescriptions();
  }, [username]);




  // Save medications locally
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  // Check drug interactions
  useEffect(() => {
    if (medications.length > 1) runInteractionCheck(medications.map(m => m.name));
  }, [medications]);

  const runInteractionCheck = async (drugList: string[]) => {
    if (drugList.length < 1) {
      setInteractions([]);
      return;
    }
    setIsLoading(true);
    const response = await checkInteractions(drugList);
    if (response && 'error' in response) {
      toast({ variant: 'destructive', title: 'Error', description: response.error });
      setInteractions([]);
    } else {
      setInteractions(response.interactions ?? []);
      if (response.interactions?.length > 0) {
        toast({ variant: 'destructive', title: 'Interaction Alert', description: 'Potential drug interaction detected. For detailed review go to Interactions Checker.' });
      }
    }
    setIsLoading(false);
  };

  const removeDrug = (uuid: string) => {
    const updatedMeds = medications.filter(med => med.uuid !== uuid);
    setMedications(updatedMeds);
    if (session?.user?.email) {
      fetch(`/api/patient/${encodeURIComponent(session.user.email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medications: updatedMeds })
      });
    }
    runInteractionCheck(updatedMeds.map(m => m.name));
  };

  const renderPrescriptions = () => {
    if (prescriptions.length === 0) return <p className="text-gray-500 text-center py-4">No prescriptions found from your doctor.</p>;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prescriptions.map((rx) => (
          <Card key={rx.uuid} className="shadow-md border rounded-lg">
            <CardHeader>
              <CardTitle>{rx.patientName}</CardTitle>
              <CardDescription>Prescribed by <strong>{rx.doctorName}</strong></CardDescription>
            </CardHeader>
            <CardContent>
              <p><strong>Rx #:</strong> {rx.rxNumber}</p>
              <p><strong>Drug:</strong> {rx.form} - {rx.dosage}</p>
              <p><strong>Pills:</strong> {rx.pills}</p>
              <p><strong>Frequency:</strong> {rx.frequency}</p>
              <Badge variant={rx.status === "Delivered" ? "default" : "secondary"} className="mt-2">{rx.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
    <h1 className="text-2xl font-bold mb-4">Patient Dashboard</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Patient Info & Prescriptions */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User /> Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input id="patientName" value={patientName} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      
      {/* Patinet message */}

       <div>
      
      <PatientMessage patientUsername={username} />
    </div>

        {/* Prescriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prescriptions from Doctor</CardTitle>
          </CardHeader>
          <CardContent>{renderPrescriptions()}</CardContent>
        </Card>
      </div>

      {/* Medications */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>My Medications</CardTitle>
            <CardDescription>Your current medications. Interaction alerts will show here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {medications.length === 0 && <div className="text-center py-8 text-muted-foreground">You have no medications saved.</div>}
            {medications.map((med) => {
              const medInteractions = interactions.filter(int => int.drugA.toLowerCase() === med.name.toLowerCase() || int.drugB.toLowerCase() === med.name.toLowerCase());
              return (
                <Card key={med.uuid} className="p-4 shadow-sm border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Pill size={20} />
                      <span className="font-bold text-lg truncate max-w-[14rem]" title={med.name}>{med.name}</span>
                    </div>
                    {medInteractions.length > 0 && (
                      <Badge variant="destructive" className="flex items-center gap-1 px-2 py-0.5 text-xs ml-2">
                        <AlertCircle size={14} /> Interaction
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-muted-foreground">{med.dosage} • {med.frequency} • {med.form}</p>
                    <Button variant="ghost" size="icon" onClick={() => removeDrug(med.uuid)} className="text-muted-foreground hover:text-destructive p-1 ml-2"><Trash2 size={16} /></Button>
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={med.uuid} className="border-b-0">
                      <AccordionTrigger className="text-sm pt-2 pb-0">View Details</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-1 pt-2 text-sm">
                        <p className="flex items-center gap-2"><Hash size={14} /> <strong>RX #:</strong> {med.rxNumber}</p>
                        <p className="flex items-center gap-2"><Stethoscope size={14} /> <strong>Prescribed by:</strong> {med.doctor}</p>
                        <p className="flex items-center gap-2"><Pill size={14} /> <strong>Pill Count:</strong> {med.pills}</p>
                        {medInteractions.length > 0 && (
                          <div className="pt-2">
                            <h4 className="font-semibold">Interaction Details</h4>
                            <ul className="space-y-2">
                              {medInteractions.map((int) => (
                                <li key={int.drugA + '-' + int.drugB + '-' + int.riskLevel} className="border rounded p-2 bg-muted/50">
                                  <span className="font-bold">{int.drugA} &amp; {int.drugB}</span>
                                  <Badge className={int.riskLevel === 'High' ? 'bg-red-500' : int.riskLevel === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'}>{int.riskLevel} Risk</Badge>
                                  <div className="text-xs text-muted-foreground mt-1">{int.description}</div>
                                  {int.alternatives?.length > 0 && <div className="text-xs text-muted-foreground mt-1"><strong>Alternatives:</strong> {int.alternatives.join(', ')}</div>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
