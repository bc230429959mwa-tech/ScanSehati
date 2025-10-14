'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, Trash2 } from 'lucide-react';
import { toast } from '@/app/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/components/ui/card';

interface Prescription {
  uuid: string;
  patientUsername: string;
  patientName: string;
  doctorName: string;
  drug: string;
  dosage: string;
  form: string;
  pills: number;
  frequency: string;
  rxNumber: string;
  refills: number;
  status: string;
}

interface Patient {
  username: string;
  name: string;
  email?: string;
}

interface Doctor {
  _id: string;
  username: string;
  fullName: string;
}

const tabs = ['New Prescription', 'All Prescriptions'];

const DoctorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('New Prescription');
  const [query, setQuery] = useState('');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const { data: session } = useSession();

  const doctorName = session?.user?.fullName || 'Unknown Doctor';
  const doctorUsername = session?.user?.name;

  const [form, setForm] = useState({
    patientUsername: '',
    patientName: '',
    doctorName,
    drug: '',
    dosage: '',
    form: '',
    pills: 0,
    frequency: '',
    refills: 0,
  });

  // Fetch prescriptions
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await fetch('/api/prescriptions');
        const data = await res.json();
        setPrescriptions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch prescriptions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  // Delete prescription
  const handleDelete = async (uuid: string) => {
    try {
      const res = await fetch(`/api/prescriptions/${uuid}`, { method: 'DELETE' });
      if (res.ok) setPrescriptions((prev) => prev.filter((p) => p.uuid !== uuid));
    } catch (err) {
      console.error('❌ Delete prescription failed:', err);
    }
  };  

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/patient');
        const data = await res.json();
        if (Array.isArray(data.patients)) setPatients(data.patients);
      } catch (err) {
        console.error('Failed to fetch patients', err);
      }
    };
    fetchPatients();
  }, []);

  // Fetch patient messages
  useEffect(() => {
    if (!doctorUsername) return;
    fetch(`/api/patientMessage?doctorUsername=${doctorUsername}`)
      .then((r) => r.json())
      .then(setMessages);
  }, [doctorUsername]);

  // Filter prescriptions
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prescriptions.filter(
      (p) =>
        p.patientName?.toLowerCase().includes(q) ||
        p.drug?.toLowerCase().includes(q) ||
        p.rxNumber?.toLowerCase().includes(q)
    );
  }, [query, prescriptions]);

  // Create prescription
  const createPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        ...form,
        username: form.patientUsername,
        doctorId: session?.user?.id,
        doctorName: session?.user?.name,
        status: 'Sent',
      };

      const res = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        toast({
          title: '❌ Failed',
          description: 'Could not create prescription. Please try again.',
        });
        return;
      }

      const newRx = await res.json();
      setPrescriptions((prev) => [...prev, newRx]);

      toast({
        title: '✅ Prescription Created',
        description: `Prescription ${newRx.rxNumber} sent for ${newRx.patientName}.`,
      });

      setForm({
        patientUsername: '',
        patientName: '',
        doctorName,
        drug: '',
        dosage: '',
        form: '',
        pills: 0,
        frequency: '',
        refills: 0,
      });
    } catch (err) {
      console.error('❌ Create prescription failed:', err);
    }
  };

  // Delete prescription
 const fetchMessages = async () => {
    if (!doctorUsername) return;
    const res = await fetch(`/api/patientMessage?doctorUsername=${doctorUsername}`);
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchMessages();
  }, [doctorUsername]);

  // 🧹 Delete message
  const handleDeleteMessage = async (id: string) => {
    const res = await fetch(`/api/patientMessage?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m._id !== id));
      toast({ title: "🗑️ Message deleted" });
    }
  };

   const handleMarkRead = async (id: string) => {
    const res = await fetch(`/api/patientMessage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const updated = await res.json();
      setMessages((prev) => prev.map((m) => (m._id === id ? updated : m)));
    }
  };

return (
  // 1. Main container: Use a fixed maximum width for the content area, 
  //    and force the outer container to manage scrolling if needed.
  //    Added overflow-x-hidden to prevent the whole page from stretching due to inner elements.
  <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
    <div className="max-w-7xl mx-auto space-y-10">

      {/* Header with improved styling */}
      <header className="text-center space-y-2 pt-4 pb-2 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight">Doctor Dashboard</h1>
        <p className="text-gray-600 text-lg">
          Manage patient messages and create prescriptions efficiently.
        </p>
      </header>

      {/* --- */}

      {/* 🧩 Patient Messages Section - A primary, distinct card */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-6 sm:p-8">
        <header className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Patient Messages ✉️</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Review and manage patient requests. Use the buttons to mark as read or delete.
          </p>
        </header>
        
        {/* Message Grid - Enhanced responsiveness for smaller screens */}
        {messages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {messages.map((m) => (
              <div
                key={m._id}
                className="border border-blue-100 rounded-xl p-4 bg-white hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <p className="font-bold text-blue-700 truncate">{m.patientName}</p>
                  <p className="text-gray-700 text-sm mt-1 line-clamp-2">{m.content}</p>
                </div>
                
                <div className="mt-4 flex justify-between items-center border-t pt-3">
                  <p className="text-xs font-medium">
                    Status:{" "}
                    <span
                      className={
                        m.status === "Replied"
                          ? "text-green-600 font-semibold"
                          : "text-orange-500 font-semibold"
                      }
                    >
                      {m.status}
                    </span>
                  </p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarkRead(m._id)}
                      className={`p-1 rounded-full transition duration-150 ${
                        m.status === "Replied"
                          ? "bg-green-100 text-green-600 cursor-not-allowed opacity-70"
                          : "text-blue-500 hover:bg-blue-100"
                      }`}
                      title="Mark as Read"
                      disabled={m.status === "Replied"}
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(m._id)}
                      className="text-red-500 hover:bg-red-100 p-1 rounded-full transition duration-150"
                      title="Delete Message"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-lg">✨ All caught up! No new messages.</p>
          </div>
        )}
      </div>

      {/* --- */}

      {/* Tabs for Navigation */}
      <div className="flex justify-center flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition duration-200 ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* --- */}

      {/* New Prescription Form - Modern Card Look */}
      {activeTab === "New Prescription" && (
        <form
          onSubmit={createPrescription}
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100"
        >
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
            Create New Prescription 📝
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Patient Selector */}
            <div className="col-span-full mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Patient (optional)
              </label>
              <select
                onChange={(e) => {
                  const selected = patients.find(
                    (p) => p.username === e.target.value
                  );
                  if (selected)
                    setForm({
                      ...form,
                      patientUsername: selected.username,
                      patientName: selected.name,
                    });
                }}
                value={form.patientUsername}
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
                <option value="">-- Select from registered patients --</option>
                {patients.map((p) => (
                  <option key={p.username} value={p.username}>
                    {p.name} {p.email ? ` (${p.email})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Form Fields */}
            {[
              ["Patient Username", "patientUsername"],
              ["Patient Name", "patientName"],
              ["Medication Name", "drug"],
              ["Dosage", "dosage"],
              ["Form", "form"],
              ["Number of Pills", "pills", "number"],
              ["Frequency", "frequency"],
              ["Refills Allowed", "refills", "number"],
            ].map(([label, key, type]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                </label>
                <input
                  type={type || "text"}
                  value={(form as any)[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [key]:
                        type === "number"
                          ? parseInt(e.target.value) || 0
                          : e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  required={
                    key === "patientUsername" ||
                    key === "patientName" ||
                    key === "drug"
                  }
                />
              </div>
            ))}

            {/* Submit */}
            <div className="col-span-full flex justify-end pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
              >
                Submit Prescription
              </button>
            </div>
          </div>
        </form>
      )}

      {/* --- */}

       {/* Prescription List - Controlled Table for Responsiveness */}
{activeTab === "All Prescriptions" && (
  <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
      <h3 className="font-semibold text-2xl text-gray-800 mb-3 sm:mb-0">All Patient Prescriptions 📄</h3>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by patient or Rx..."
        className="border border-gray-300 rounded-lg p-3 w-full sm:w-64 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
      />
    </div>
    
    {/* Key change: Table Container forces horizontal scrolling on overflow */}
    <div className="overflow-x-auto w-full"> 
      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead>
          <tr className="bg-blue-50 text-blue-800 text-left font-semibold uppercase tracking-wider">
            {/* Reduced padding to p-2 for tighter fit */}
            <th className="p-2 whitespace-nowrap rounded-tl-lg">Patient</th>
            <th className="p-2 whitespace-nowrap">Drug</th>
            {/* Hiding Dosage on sm screens, showing only on md+ */}
            <th className="p-2 hidden md:table-cell whitespace-nowrap">Dosage</th>
            {/* Hiding Form and Qty even more aggressively */}
            <th className="p-2 hidden xl:table-cell whitespace-nowrap">Form</th>
            <th className="p-2 hidden xl:table-cell whitespace-nowrap">Qty</th>
            {/* Frequency and Refills shown on lg+ screens */}
            <th className="p-2 hidden lg:table-cell whitespace-nowrap">Frequency</th>
            <th className="p-2 hidden lg:table-cell whitespace-nowrap">Refills</th>
            <th className="p-2 hidden lg:table-cell whitespace-nowrap">Doctor</th>
            <th className="p-2 whitespace-nowrap">Status</th>
            <th className="p-2 whitespace-nowrap">Rx #</th>
            <th className="p-2 text-right rounded-tr-lg"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filtered.map((rx, i) => (
            <tr
              key={rx.uuid}
              className={i % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-100 hover:bg-gray-200"}
            >
              {/* Reduced padding to p-2 for tighter fit */}
              <td className="p-2 font-medium text-gray-800 whitespace-nowrap">{rx.patientName}</td>
              <td className="p-2 text-gray-700 whitespace-nowrap">{rx.drug}</td>
              <td className="p-2 hidden md:table-cell whitespace-nowrap">{rx.dosage}</td>
              <td className="p-2 hidden xl:table-cell whitespace-nowrap">{rx.form}</td>
              <td className="p-2 hidden xl:table-cell whitespace-nowrap">{rx.pills}</td>
              <td className="p-2 hidden lg:table-cell whitespace-nowrap">{rx.frequency}</td>
              <td className="p-2 hidden lg:table-cell whitespace-nowrap">{rx.refills}</td>
              <td className="p-2 hidden lg:table-cell whitespace-nowrap">Dr. {rx.doctorName}</td>
              <td className="p-2">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    rx.status === "Filled" 
                        ? "bg-green-100 text-green-800"
                        : rx.status === "Pending" 
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                }`}>
                    {rx.status}
                </span>
              </td>
              <td className="p-2 font-mono text-gray-600 whitespace-nowrap">{rx.rxNumber}</td>
              <td className="p-2 text-right">
                <button
                  onClick={() => handleDelete(rx.uuid)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                  title="Delete Prescription"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td
                colSpan={11}
                className="text-center py-8 text-lg text-gray-500"
              >
                🚫 No prescriptions found matching your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}
    </div>
  </div>
);
};

export default DoctorDashboard;
