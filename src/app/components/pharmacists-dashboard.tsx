'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { CheckCircle, XCircle, PackageCheck } from 'lucide-react';
import PharmaDocMsg from './PharmaDocMsg';
import PharmaPatientHistory from './PharmaPatientHistory';

interface Prescription {
  uuid: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  drug: string;
  dosage: string;
  form: string;
  pills: number;
  frequency: string;
  refills: number;
  rxNumber: string;
  status: string;
  noteForPharmacist?: string;
  username: string;
}

const PharmacistDashboard: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const pharmacyId = 'pharmacy-001';
  const [selectedPatientUsername, setSelectedPatientUsername] = useState<string | null>(null);

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Ready': return 'bg-blue-100 text-blue-800';
      case 'PickedUp': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateStatus = async (uuid: string, status: string) => {
    const res = await fetch(`/api/prescriptions/${uuid}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, pharmacyId }),
    });
    if (res.ok) {
      setPrescriptions((prev) =>
        prev.map((p) => (p.uuid === uuid ? { ...p, status } : p))
      );
    }
  };

  useEffect(() => {
    fetch(`/api/prescriptions?pharmacyId=${pharmacyId}`)
      .then((res) => res.json())
      .then((data) => {
        setPrescriptions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pharmacyId]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return prescriptions.filter(
      (p) =>
        p.patientName?.toLowerCase().includes(q) ||
        p.drug?.toLowerCase().includes(q) ||
        p.rxNumber?.toLowerCase().includes(q)
    );
  }, [query, prescriptions]);

  if (loading)
    return (
      <div className="text-center py-10 text-lg text-gray-700">
        Loading prescriptions...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <header className="text-center space-y-2 pt-4 pb-2 bg-white rounded-2xl shadow-lg border border-gray-100">
          <h1 className="text-4xl font-extrabold text-teal-700 tracking-tight">
            Pharmacy Dispense Panel 💊
          </h1>
          <p className="text-gray-600 text-lg">
            Manage and dispense prescriptions assigned to your pharmacy.
          </p>
        </header>

        {/* Prescriptions Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
            <h3 className="font-semibold text-2xl text-gray-800 mb-3 sm:mb-0">
              Incoming Prescriptions
            </h3>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by patient or Rx..."
              className="border border-gray-300 rounded-lg p-3 w-full sm:w-64 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
            />
          </div>

          {/* Table */}
          <div className="hidden md:block overflow-x-auto w-full">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead>
                <tr className="bg-teal-50 text-teal-800 text-left font-semibold uppercase tracking-wider">
                  <th className="p-2">Rx #</th>
                  <th className="p-2">Patient</th>
                  <th className="p-2">Drug</th>
                  <th className="p-2 hidden lg:table-cell">Dosage</th>
                  <th className="p-2 hidden md:table-cell">Qty</th>
                  <th className="p-2 hidden xl:table-cell">Freq</th>
                  <th className="p-2 hidden xl:table-cell">Doctor</th>
                  <th className="p-2">Status</th>
                  <th className="p-2 hidden lg:table-cell">Note</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((rx, i) => (
                  <tr
                    key={rx.uuid}
                    onClick={() =>
                      setSelectedPatientUsername((prev) =>
                        prev === rx.username ? null : rx.username
                      )
                    }
                    className={`cursor-pointer transition ${
                      selectedPatientUsername === rx.username
                        ? 'bg-blue-100 ring-2 ring-teal-400'
                        : i % 2 === 0
                        ? 'bg-white hover:bg-gray-50'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <td className="p-2 font-mono font-medium text-teal-600">
                      {rx.rxNumber}
                    </td>
                    <td className="p-2 font-medium text-gray-800">{rx.patientName}</td>
                    <td className="p-2 text-gray-700">{rx.drug}</td>
                    <td className="p-2 hidden lg:table-cell">{rx.dosage}</td>
                    <td className="p-2 hidden md:table-cell">
                      {rx.pills} ({rx.form})
                    </td>
                    <td className="p-2 hidden xl:table-cell">{rx.frequency}</td>
                    <td className="p-2 hidden xl:table-cell">Dr. {rx.doctorName}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(
                          rx.status
                        )}`}
                      >
                        {rx.status}
                      </span>
                    </td>
                    <td className="p-2 hidden lg:table-cell text-gray-500 italic max-w-xs truncate">
                      {rx.noteForPharmacist || '-'}
                    </td>
                    <td className="p-2 text-right space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(rx.uuid, 'Ready');
                        }}
                        className="p-1 rounded-full text-green-600 hover:bg-green-100"
                      >
                        <PackageCheck size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(rx.uuid, 'PickedUp');
                        }}
                        className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(rx.uuid, 'Cancelled');
                        }}
                        className="p-1 rounded-full text-red-600 hover:bg-red-100"
                      >
                        <XCircle size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient History Section */}
        {selectedPatientUsername && (
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
            {/* Close (X) Button */}
            <button
              onClick={() => setSelectedPatientUsername(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
              title="Close patient details"
            >
              ✖
            </button>
            <PharmaPatientHistory patientUsername={selectedPatientUsername} />
          </div>
        )}

        {/* Messaging Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
          <h3 className="font-semibold text-2xl text-gray-800 mb-4 border-b pb-4">
            Doctor/Patient Messaging 💬
          </h3>
          <PharmaDocMsg />
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
