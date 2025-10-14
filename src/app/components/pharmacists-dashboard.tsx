'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { CheckCircle, XCircle, PackageCheck } from 'lucide-react';

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
}

const PharmacistDashboard: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const pharmacyId = 'pharmacy-001';

  // Helper functions (useEffect, useMemo, getStatusBadgeClasses, updateStatus)

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

  if (loading) return <div className="text-center py-10 text-lg text-gray-700">Loading prescriptions...</div>;

  return (
    // Outer container ensures internal component content is constrained
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto space-y-10">

        {/* Header - Modernized */}
        <header className="text-center space-y-2 pt-4 pb-2 bg-white rounded-2xl shadow-lg border border-gray-100">
          <h1 className="text-4xl font-extrabold text-teal-700 tracking-tight">
            Pharmacy Dispense Panel 💊
          </h1>
          <p className="text-gray-600 text-lg">
            Manage and dispense prescriptions assigned to your pharmacy.
          </p>
        </header>

        {/* Prescription Card Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
          
          {/* Header and Search */}
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

          {/* ------------------------------------------------------------------- */}
          {/* MOBILE/CARD VIEW (visible below 'md' breakpoint) */}
          {/* ------------------------------------------------------------------- */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filtered.length > 0 ? (
              filtered.map((rx) => (
                <div key={rx.uuid} className="p-4 border border-gray-200 rounded-xl shadow-sm bg-white space-y-3">
                  <div className="flex justify-between items-start border-b pb-2">
                    <p className="font-bold text-lg text-teal-700">{rx.patientName}</p>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClasses(rx.status)}`}>
                      {rx.status}
                    </span>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <p className="font-medium text-gray-800">
                      Drug: <span className="font-normal text-gray-600">{rx.drug} ({rx.dosage})</span>
                    </p>
                    <p className="text-gray-700">
                      Rx #: <span className="font-mono">{rx.rxNumber}</span>
                    </p>
                    <p className="text-gray-700">
                      Qty: <span className="font-normal">{rx.pills} ({rx.form})</span>
                    </p>
                  </div>
                  
                  <div className="flex justify-end pt-2 border-t mt-3">
                    <div className="space-x-2">
                      <button
                        onClick={() => updateStatus(rx.uuid, 'Ready')}
                        className={`p-2 rounded-full transition ${rx.status === 'PickedUp' || rx.status === 'Cancelled' ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:bg-green-100'}`}
                        title="Mark as Ready"
                        disabled={rx.status === 'PickedUp' || rx.status === 'Cancelled'}
                      >
                        <PackageCheck size={20} />
                      </button>
                      <button
                        onClick={() => updateStatus(rx.uuid, 'PickedUp')}
                        className={`p-2 rounded-full transition ${rx.status === 'PickedUp' || rx.status === 'Cancelled' ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                        title="Mark as Picked Up"
                        disabled={rx.status === 'PickedUp' || rx.status === 'Cancelled'}
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() => updateStatus(rx.uuid, 'Cancelled')}
                        className={`p-2 rounded-full transition ${rx.status === 'Cancelled' ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-red-100'}`}
                        title="Cancel"
                        disabled={rx.status === 'Cancelled'}
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-gray-500">No prescriptions found.</p>
            )}
          </div>
          
          {/* ------------------------------------------------------------------- */}
          {/* DESKTOP/TABLE VIEW (visible from 'md' breakpoint and up) */}
          {/* ------------------------------------------------------------------- */}
          <div className="hidden md:block overflow-x-auto w-full">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead>
                <tr className="bg-teal-50 text-teal-800 text-left font-semibold uppercase tracking-wider">
                  <th className="p-2 whitespace-nowrap rounded-tl-lg">Rx #</th>
                  <th className="p-2 whitespace-nowrap">Patient</th>
                  <th className="p-2 whitespace-nowrap">Drug</th>
                  <th className="p-2 hidden lg:table-cell whitespace-nowrap">Dosage</th>
                  <th className="p-2 hidden md:table-cell whitespace-nowrap">Qty</th>
                  <th className="p-2 hidden xl:table-cell whitespace-nowrap">Freq</th>
                  <th className="p-2 hidden xl:table-cell whitespace-nowrap">Doctor</th>
                  <th className="p-2 whitespace-nowrap">Status</th>
                  <th className="p-2 hidden lg:table-cell">Note</th>
                  <th className="p-2 text-right rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((rx, i) => (
                  <tr key={rx.uuid} className={i % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-100 hover:bg-gray-200'}>
                    <td className="p-2 font-mono font-medium text-teal-600 whitespace-nowrap">{rx.rxNumber}</td>
                    <td className="p-2 font-medium text-gray-800 whitespace-nowrap">{rx.patientName}</td>
                    <td className="p-2 text-gray-700 whitespace-nowrap">{rx.drug}</td>
                    <td className="p-2 hidden lg:table-cell whitespace-nowrap">{rx.dosage}</td>
                    <td className="p-2 hidden md:table-cell whitespace-nowrap">{rx.pills} ({rx.form})</td>
                    <td className="p-2 hidden xl:table-cell whitespace-nowrap">{rx.frequency}</td>
                    <td className="p-2 hidden xl:table-cell whitespace-nowrap">Dr. {rx.doctorName}</td>
                    <td className="p-2 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(rx.status)}`}>
                        {rx.status}
                      </span>
                    </td>
                    <td className="p-2 hidden lg:table-cell text-gray-500 italic max-w-xs truncate">
                      {rx.noteForPharmacist || '-'}
                    </td>
                    <td className="p-2 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => updateStatus(rx.uuid, 'Ready')}
                        className={`p-1 rounded-full transition ${rx.status === 'PickedUp' || rx.status === 'Cancelled' ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:bg-green-100'}`}
                        title="Mark as Ready"
                        disabled={rx.status === 'PickedUp' || rx.status === 'Cancelled'}
                      >
                        <PackageCheck size={18} />
                      </button>
                      <button
                        onClick={() => updateStatus(rx.uuid, 'PickedUp')}
                        className={`p-1 rounded-full transition ${rx.status === 'PickedUp' || rx.status === 'Cancelled' ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                        title="Mark as Picked Up"
                        disabled={rx.status === 'PickedUp' || rx.status === 'Cancelled'}
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => updateStatus(rx.uuid, 'Cancelled')}
                        className={`p-1 rounded-full transition ${rx.status === 'Cancelled' ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-red-100'}`}
                        title="Cancel"
                        disabled={rx.status === 'Cancelled'}
                      >
                        <XCircle size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-lg text-gray-500">
                      ✅ No prescriptions found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;