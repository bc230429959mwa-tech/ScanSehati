'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { toast } from '@/app/hooks/use-toast';

interface Doctor {
  _id: string;
  username: string;
  fullName: string;
}

interface PatientMessageProps {
  patientUsername: string;
}

const PatientMessage: React.FC<PatientMessageProps> = ({ patientUsername }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/users?role=doctor');
        const data = await res.json();
        setDoctors(data);
        if (data.length > 0) setSelectedDoctor(data[0].username);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !content) return toast({ variant: 'destructive', title: 'Error', description: 'Please fill all fields' });

    setLoading(true);
    try {
      const res = await fetch('/api/patientMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientUsername, doctorUsername: selectedDoctor, content }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        toast({ title: 'Success', description: 'Your message has been sent to the doctor.' });
        setContent('');
      } else {
        toast({ variant: 'destructive', title: 'Error', description: data.error || 'Something went wrong' });
      }
    } catch (err) {
      setLoading(false);
      toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong' });
    }
  };

  return (
    <Card className="shadow-md border rounded-lg max-w-full mx-auto">
      <CardHeader>
        <CardTitle>Send Message to Doctor</CardTitle>
        <CardDescription>
          Send your issue or query to your doctor. Your doctor can review your message and send you a prescription if needed.
          Please mention all related symptoms and relevant information in your message(e.g., duration, severity, weight, gender etc.).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="doctor">Select Doctor</Label>
          <select
            id="doctor"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="border rounded-md p-2 w-full"
          >
            {doctors.map((doc) => (
              <option key={doc._id} value={doc.username}>
                Dr. {doc.fullName} ({doc.username})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Your Message</Label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe your issue or query for the doctor..."
            className="border rounded-md p-2 w-full h-32 resize-none"
            maxLength={300}
          />
        </div>

        <Button type="submit" onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PatientMessage;
