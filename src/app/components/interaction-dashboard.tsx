'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useToast } from '@/app/hooks/use-toast';
import { AlertCircle, PlusCircle, User, Pill, Hash, Stethoscope, BriefcaseMedical, RefreshCw, Loader2, Search, Trash2, BarChart3, Info, CheckCircle2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';
import { Badge } from '@/app/components/ui/badge';
import { checkInteractions, getRiskExplanation } from '@/app/actions';
import { type DetectDrugInteractionsOutput } from '@/app/ai/flows/detect-drug-interactions';
import { type ExplainInteractionRisksOutput } from '@/app/ai/flows/explain-interaction-risks';
import { Separator } from '@/app/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { PrescriptionUpload } from './prescription-upload';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Skeleton } from '@/app/components/ui/skeleton';
import { useSession } from "next-auth/react";

interface Medication {
  id: string;
  name: string;
  rxNumber: string;
  doctor: string;
  pills: number;
  dosage: string;
  refillsLeft: number;
  frequency: string;
  form: string;
}

interface Patient {
  name: string;
  membershipNumber: string;
  medications: Medication[];
}



type Interaction = DetectDrugInteractionsOutput['interactions'][0];

export function InteractionDashboard() {
  // ---------- State ----------
  // ---------- STATE & HOOKS ----------
  const { data: session } = useSession();
  const { toast } = useToast();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingInteractions, setIsCheckingInteractions] = useState(false);

  const [newDrugName, setNewDrugName] = useState('');
  const [newRxNumber, setNewRxNumber] = useState('');
  const [newDoctor, setNewDoctor] = useState('');
  const [newPills, setNewPills] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newFrequency, setNewFrequency] = useState('');
  const [newForm, setNewForm] = useState('');

  const [drugA, setDrugA] = useState('');
  const [drugB, setDrugB] = useState('');

  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [quickCheckResult, setQuickCheckResult] = useState<Interaction | null>(null);

  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null);
  const [explanation, setExplanation] = useState<ExplainInteractionRisksOutput | null>(null);

  const [isExplaining, setIsExplaining] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const [consentGiven, setConsentGiven] = useState(false);
  const [isConsentDialogOpen, setIsConsentDialogOpen] = useState(false);

  const [isQuickChecking, setIsQuickChecking] = useState(false);
  const [noInteractionFound, setNoInteractionFound] = useState(false);

  // ---------- CONSENT ----------
  useEffect(() => {
    const consent = localStorage.getItem('user-consent');
    if (consent === 'true') {
      setConsentGiven(true);
    } else {
      setIsConsentDialogOpen(true);
    }
  }, []);

  const handleConsent = () => {
    localStorage.setItem('user-consent', 'true');
    setConsentGiven(true);
    setIsConsentDialogOpen(false);
    toast({
      title: 'Thank You',
      description: 'You have agreed to the terms and conditions.',
    });
  };

  // ---------- FETCH PATIENT (session email) ----------
  useEffect(() => {
    const email = typeof session?.user?.email === 'string' ? session.user.email : '';
    if (!email) return;

    const fetchPatientByEmail = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/patient/${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.patient) {
            setPatient(data.patient);
            // run interactions for loaded patient
            if (Array.isArray(data.patient.medications) && data.patient.medications.length > 0) {
              await runInteractionCheck(data.patient.medications.map((m: Medication) => m.name));
            } else {
              setInteractions([]);
            }
          }
        } else {
          // server returned non-OK
          setPatient(null);
        }
      } catch (err) {
        // network
        toast({ variant: 'destructive', title: 'Error', description: 'Unable to fetch patient info.' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientByEmail();
  }, [session?.user?.email]);



  // ---------- INTERACTION CHECK ----------
  const runInteractionCheck = async (drugList: string[]) => {
    if (!drugList || drugList.length < 1) {
      setInteractions([]);
      return;
    }
    setIsCheckingInteractions(true);
    try {
      const response = await checkInteractions(drugList);
      if ('error' in response) {
        toast({ variant: 'destructive', title: 'Error', description: response.error });
        setInteractions([]);
      } else {
        setInteractions(response.interactions ?? []);
        if (response.interactions?.length) {
          toast({ variant: 'destructive', title: 'Interaction Alert', description: `${response.interactions.length} potential drug interaction(s) detected.` });
        } else {
          toast({ title: 'No Interactions Found', description: 'No significant interactions were found.' });
        }
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Interaction check failed.' });
      setInteractions([]);
    } finally {
      setIsCheckingInteractions(false);
    }
  };

  // ---------- HANDLERS: ADD / REMOVE / UPLOAD ----------
  const handleAddDrug = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrugName) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a drug name.' });
      return;
    }
    if (!patient) {
      toast({ variant: 'destructive', title: 'Error', description: 'No patient selected.' });
      return;
    }

    const newMed: Medication = {
      id: uuidv4(),
      name: newDrugName,
      rxNumber: newRxNumber || 'N/A',
      doctor: newDoctor || 'Self-Added',
      pills: Number(newPills) || 0,
      dosage: newDosage || 'N/A',
      refillsLeft: 0,
      frequency: newFrequency || 'N/A',
      form: newForm || 'Unknown',
    };

    const updatedMeds = [...patient.medications, newMed];

    // Persist to backend
    try {
      const patientId = patient.membershipNumber || (session?.user?.email ?? '');
      if (patientId) {
        await fetch(`/api/patient/${encodeURIComponent(patientId)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ medications: updatedMeds }),
        });
        // refresh from backend (to pick up DB ids)
        const res = await fetch(`/api/patient/${encodeURIComponent(patientId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.patient) {
            setPatient(data.patient);
          } else {
            setPatient({ ...patient, medications: updatedMeds });
          }
        } else {
          setPatient({ ...patient, medications: updatedMeds });
        }
      } else {
        setPatient({ ...patient, medications: updatedMeds });
      }
      // clear form
      setNewDrugName('');
      setNewRxNumber('');
      setNewDoctor('');
      setNewPills('');
      setNewDosage('');
      setNewFrequency('');
      setNewForm('');
      // run checks
      await runInteractionCheck(updatedMeds.map((m) => m.name));
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save medication.' });
    }
  };

  const removeDrug = (id: string) => {
    if (!patient) return;
    const updatedMeds = patient.medications.filter((m) => m.id !== id);
    setPatient({ ...patient, medications: updatedMeds });
    const patientId = patient.membershipNumber || (session?.user?.email ?? '');
    if (patientId) {
      fetch(`/api/patient/${encodeURIComponent(patientId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medications: updatedMeds }),
      }).catch(() => {
        /* ignore network error here */
      });
    }
    runInteractionCheck(updatedMeds.map((m) => m.name));
  };

  const handleDrugsParsed = (drugList: string[]) => {
    if (!patient) {
      toast({ variant: 'destructive', title: 'No patient', description: 'Please select a patient first.' });
      return;
    }
    if (!drugList || drugList.length === 0) {
      toast({ variant: 'destructive', title: 'No Drugs Found', description: "We couldn't find any medication names in the upload." });
      return;
    }
    const parsedMeds: Medication[] = drugList.map((name) => ({
      id: uuidv4(),
      name,
      rxNumber: 'N/A (From Upload)',
      doctor: 'From Prescription',
      pills: 0,
      dosage: 'N/A',
      refillsLeft: 0,
      frequency: 'N/A',
      form: 'Unknown',
    }));
    const updatedMeds = [...patient.medications, ...parsedMeds];
    setPatient({ ...patient, medications: updatedMeds });
    runInteractionCheck(updatedMeds.map((m) => m.name));
    toast({ title: 'Medications Added', description: `${parsedMeds.length} medication(s) added.` });
  };

  // ---------- QUICK CHECK ----------
  const handleQuickCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugA || !drugB) {
      toast({ variant: 'destructive', title: 'Input Error', description: 'Please enter both drug names to check.' });
      return;
    }
    setIsQuickChecking(true);
    setQuickCheckResult(null);
    setNoInteractionFound(false);

    try {
      const response = await checkInteractions([drugA, drugB]);
      if ('error' in response) {
        toast({ variant: 'destructive', title: 'Error', description: response.error });
      } else if (response.interactions?.length) {
        setQuickCheckResult(response.interactions[0]);
      } else {
        setNoInteractionFound(true);
        toast({ title: 'No Interactions Found', description: `No significant interactions were found between ${drugA} and ${drugB}.` });
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Quick check failed.' });
    } finally {
      setIsQuickChecking(false);
    }
  };

  // ---------- EXPLANATION ----------
  const handleExplainInteraction = async (interaction: Interaction) => {
    setSelectedInteraction(interaction);
    setIsExplaining(true);
    setExplanation(null);
    setFeedbackSubmitted(false);
    try {
      const response = await getRiskExplanation(interaction.drugA, interaction.drugB, interaction.description);
      if ('error' in response) {
        toast({ variant: 'destructive', title: 'Error', description: response.error });
      } else {
        setExplanation(response);
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to get explanation.' });
    } finally {
      setIsExplaining(false);
    }
  };

  // ---------- HELPERS ----------
  const getInteractionStatus = (drugName: string) =>
    interactions.some((int) => int.drugA.toLowerCase() === drugName.toLowerCase() || int.drugB.toLowerCase() === drugName.toLowerCase());

  const riskData = useMemo(() => {
    const counts = { Low: 0, Moderate: 0, High: 0 };
    interactions.forEach((int) => {
      counts[int.riskLevel]++;
    });
    return [
      { name: 'Low', count: counts.Low },
      { name: 'Moderate', count: counts.Moderate },
      { name: 'High', count: counts.High },
    ];
  }, [interactions]);


  return (
    <div className="space-y-6">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Medication Tools</CardTitle>
            <CardDescription>Add drugs to your list or perform a quick interaction check.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manual">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="manual">Add to List</TabsTrigger>
                <TabsTrigger value="upload">Upload Prescription</TabsTrigger>
                <TabsTrigger value="quick-check">Quick Check</TabsTrigger>
              </TabsList>
              <TabsContent value="manual" className="pt-4">
                <form onSubmit={handleAddDrug}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <Label htmlFor="new-drug-name">Drug Name</Label>
                      <Input
                        id="new-drug-name"
                        placeholder="e.g., Aspirin"
                        value={newDrugName}
                        onChange={(e) => setNewDrugName(e.target.value)}
                        disabled={isLoading}
                      />
                      <Label htmlFor="new-doctor">Doctor</Label>
                      <Input
                        id="new-doctor"
                        placeholder="e.g., Dr. Smith"
                        value={newDoctor}
                        onChange={(e) => setNewDoctor(e.target.value)}
                        disabled={isLoading}
                      />
                      <Label htmlFor="new-pills">Pill Count</Label>
                      <Input
                        id="new-pills"
                        type="number"
                        placeholder="e.g., 30"
                        value={newPills}
                        onChange={(e) => setNewPills(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="new-dosage">Dosage</Label>
                      <Input
                        id="new-dosage"
                        placeholder="e.g., 10mg"
                        value={newDosage}
                        onChange={(e) => setNewDosage(e.target.value)}
                        disabled={isLoading}
                      />
                      <Label htmlFor="new-frequency">Frequency</Label>
                      <Input
                        id="new-frequency"
                        placeholder="e.g., Once daily"
                        value={newFrequency}
                        onChange={(e) => setNewFrequency(e.target.value)}
                        disabled={isLoading}
                      />
                      <Label htmlFor="new-form">Form</Label>
                      <Input
                        id="new-form"
                        placeholder="e.g., Tablet"
                        value={newForm}
                        onChange={(e) => setNewForm(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full mt-6">
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : <PlusCircle className="mr-2" />}
                    Add to List and Check
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="upload">
                <PrescriptionUpload onDrugsParsed={handleDrugsParsed} />
              </TabsContent>
              <TabsContent value="quick-check" className="pt-4 space-y-4">
                <p className="text-sm text-muted-foreground">Quickly check for an interaction between two drugs without adding them to your list.</p>
                <form onSubmit={handleQuickCheck}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="drugA">Drug A</Label>
                        <Input
                          id="drugA"
                          placeholder="e.g., Lisinopril"
                          value={drugA}
                          onChange={(e) => setDrugA(e.target.value)}
                          disabled={isQuickChecking}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="drugB">Drug B</Label>
                        <Input
                          id="drugB"
                          placeholder="e.g., Ibuprofen"
                          value={drugB}
                          onChange={(e) => setDrugB(e.target.value)}
                          disabled={isQuickChecking}
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={isQuickChecking} className="w-full">
                      {isQuickChecking ? <Loader2 className="animate-spin mr-2" /> : <Search className="mr-2" />}
                      Check for Interaction
                    </Button>
                  </div>
                </form>

                {isQuickChecking && (
                  <div className="flex justify-center items-center pt-4">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Checking...</span>
                  </div>
                )}

                {quickCheckResult && (
                  <Card className="mt-4 bg-muted/50">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-lg">
                        Interaction Result
                        <Badge variant={
                          quickCheckResult.riskLevel === 'High' ? 'destructive' :
                            quickCheckResult.riskLevel === 'Moderate' ? 'warning' : 'secondary'
                        }>
                          {quickCheckResult.riskLevel} Risk
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>An interaction was found between <strong>{quickCheckResult.drugA}</strong> and <strong>{quickCheckResult.drugB}</strong>.</p>
                      <p className="text-muted-foreground text-sm">{quickCheckResult.description}</p>
                      {quickCheckResult.alternatives && quickCheckResult.alternatives.length > 0 && (
                        <div className="pt-2">
                          <h4 className="font-semibold">Suggested Alternatives:</h4>
                          <p className="text-muted-foreground text-sm">{quickCheckResult.alternatives.join(', ')}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {noInteractionFound && (
                  <Alert className="mt-4">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>No Significant Interactions Found</AlertTitle>
                    <AlertDescription>
                      No significant interactions were found between {drugA} and {drugB}. Always consult your healthcare provider before making any changes to your medication regimen.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>



     {isLoading && (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-40 w-full" />
      </CardContent>
    </Card>
  </div>
)}

{patient && (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Left column: Medication History + Risk Analysis */}
    <div className="lg:col-span-2 space-y-6">
      {/* Medication History Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              Medication History for <span className="text-primary text-3xl capitalize">{patient.name}</span>
            </span>
            {isCheckingInteractions && <Loader2 className="animate-spin text-muted-foreground" />}
          </CardTitle>
          <CardDescription>
            A list of the patient's current medications. Interaction alerts will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patient.medications.map((med) => (
              <Card key={med.id} className={getInteractionStatus(med.name) ? 'border-destructive' : ''}>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <Pill size={20} /> {med.name}
                        {getInteractionStatus(med.name) && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle size={14} /> Interaction
                          </Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {med.dosage} - {med.frequency}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeDrug(med.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-b-0">
                      <AccordionTrigger className="text-sm pt-2 pb-0">View Details</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-1 pt-2 text-sm">
                        <p className="flex items-center gap-2"><Hash size={14} /> <strong>RX Number:</strong> {med.rxNumber}</p>
                        <p className="flex items-center gap-2"><Stethoscope size={14} /> <strong>Prescribed by:</strong> {med.doctor}</p>
                        <p className="flex items-center gap-2"><BriefcaseMedical size={14} /> <strong>Pill Count:</strong> {med.pills}</p>
                        <p className="flex items-center gap-2"><RefreshCw size={14} /> <strong>Refills Left:</strong> {med.refillsLeft}</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </Card>
            ))}
          </div>

          {patient.medications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              This patient has no medications on file.
            </div>
          )}

          <Separator className="my-6" />

          {/* Risk Analysis Card below Medication History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 /> Risk Analysis</CardTitle>
              <CardDescription>Visualization of potential interaction risks.</CardDescription>
            </CardHeader>
            <CardContent>
              {isCheckingInteractions ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : interactions.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={riskData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="count" name="Interactions" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                  <p>No interactions found for the patient's current medications.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>

    {/* Right column: Interaction Details (unchanged) */}
    <div className="lg:col-span-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Info /> Interaction Details</CardTitle>
          <CardDescription>Review details for each potential interaction.</CardDescription>
        </CardHeader>
        <CardContent>
          {isCheckingInteractions ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : interactions.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {interactions.map((interaction, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex justify-between items-center w-full pr-2">
                      <span>{interaction.drugA} & {interaction.drugB}</span>
                      <Badge variant={interaction.riskLevel === 'High' ? 'destructive' : interaction.riskLevel === 'Moderate' ? 'warning' : 'secondary'}>
                        {interaction.riskLevel}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{interaction.description}</p>
                      {interaction.alternatives && interaction.alternatives.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-sm">Suggested Alternatives:</h5>
                          <p className="text-sm text-muted-foreground">{interaction.alternatives.join(', ')}</p>
                        </div>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleExplainInteraction(interaction)}>
                        <Info className="mr-2 h-4 w-4" />
                        Get Detailed Explanation
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-sm text-center text-muted-foreground py-4">No interactions to display.</p>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
)}

{/* Dialogs unchanged */}
<Dialog open={isConsentDialogOpen} onOpenChange={setIsConsentDialogOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Consent to Terms of Use</DialogTitle>
      <DialogDescription>
        MediCheck AI is a supportive tool and not a substitute for professional medical advice. By clicking "Agree & Continue", you acknowledge this and agree to our terms of service.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button type="button" onClick={handleConsent}>Agree & Continue</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<Dialog open={!!selectedInteraction} onOpenChange={(open) => !open && setSelectedInteraction(null)}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Interaction Explanation</DialogTitle>
      <DialogDescription>
        AI-generated explanation for the interaction between {selectedInteraction?.drugA} and {selectedInteraction?.drugB}. This is for informational purposes only.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4 space-y-4">
      {isExplaining ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : explanation ? (
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Severity: {explanation.severity}</AlertTitle>
            <AlertDescription>
              This is a summary of the potential risk. Always consult with a healthcare provider.
            </AlertDescription>
          </Alert>
          <div>
            <h4 className="font-semibold mb-1">Explanation</h4>
            <p className="text-sm text-muted-foreground">{explanation.explanation}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Recommendation</h4>
            <p className="text-sm text-muted-foreground">{explanation.recommendation}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-center text-muted-foreground">Could not load explanation.</p>
      )}
    </div>
    <Separator />
    <DialogFooter className="pt-4">
      {feedbackSubmitted ? (
        <p className="text-sm text-green-600 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> Thank you for your feedback!
        </p>
      ) : (
        <div className="flex items-center gap-4 w-full">
          <p className="text-sm text-muted-foreground">Was this explanation helpful?</p>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="icon" onClick={() => setFeedbackSubmitted(true)}><ThumbsUp className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setFeedbackSubmitted(true)}><ThumbsDown className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
}

