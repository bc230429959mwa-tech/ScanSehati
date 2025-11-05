import React, { useState, useEffect, useMemo, useRef, FormEvent } from "react";
import { useSession } from "next-auth/react";

interface Pharmacist {
  username: string;
  fullName: string;
}

interface Message {
  _id: string;
  senderUsername: string;
  senderName: string;
  senderRole: string;
  recipientUsername: string;
  recipientName: string;
  recipientRole: string;
  content: string;
  status: string;
  createdAt: string;
}

const DocPharmaMsg: React.FC = () => {
  const [pharmacists, setPharmacists] = useState<Pharmacist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPharma, setSelectedPharma] = useState<Pharmacist | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Inbox states
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [inboxError, setInboxError] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const searchRef = useRef<HTMLDivElement | null>(null);

  if (status === "loading") return <p>Loading user...</p>;
  if (!session) return <p>You must be logged in as a doctor.</p>;

  const doctor = session.user as any;
  const doctorUsername = doctor.name;
  const doctorName = doctor.fullName;
  const doctorRole = doctor.role;

  // Fetch pharmacists
useEffect(() => {
  const fetchPharmacists = async () => {
    try {
      const res = await fetch(`/api/users?role=pharmacist`);
      if (!res.ok) throw new Error("Failed to fetch pharmacists");
      const data = await res.json();
      setPharmacists(data); // data should be an array of pharmacists
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchPharmacists();
}, []);
  // Fetch messages received from pharmacists
  useEffect(() => {
    const fetchInbox = async () => {
      setInboxLoading(true);
      try {
        const res = await fetch(
  `/api/pharmaDoctorMessage?recipientUsername=${doctorUsername}`
);
        if (!res.ok) throw new Error("Failed to load messages");
        const data = await res.json();
        setReceivedMessages(data.messages || []);
      } catch (err: any) {
        setInboxError(err.message);
      } finally {
        setInboxLoading(false);
      }
    };
    if (doctorUsername) fetchInbox();
  }, [doctorUsername]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPharmacists = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return pharmacists.filter(
      (p) =>
        p.fullName.toLowerCase().includes(lower) ||
        p.username.toLowerCase().includes(lower)
    );
  }, [searchTerm, pharmacists]);

  const handleSelect = (pharma: Pharmacist) => {
    setSelectedPharma(pharma);
    setSearchTerm(pharma.fullName);
    setDropdownOpen(false);
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedPharma || !messageContent.trim()) {
      setStatusMessage("Please select a pharmacist and enter a message.");
      return;
    }

    setIsSending(true);
    setStatusMessage("Sending...");

    const messageData = {
      senderUsername: doctorUsername,
      senderName: doctorName,
      senderRole: doctorRole.toLowerCase(), // FIX 3: Ensure senderRole is lowercase (if it's not already)
      recipientUsername: selectedPharma.username,
      recipientName: selectedPharma.fullName,
      // FIX 4: Change "Pharmacist" to "pharmacist" to match Mongoose enum
      recipientRole: "pharmacist", // ✅ CORRECTED to lowercase
      content: messageContent.trim(),
    };

    try {
      const res = await fetch("/api/doctorPharmaMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      if (res.ok) {
        setStatusMessage("✅ Message sent successfully!");
        setMessageContent("");
        setSelectedPharma(null);
        setSearchTerm("");
      } else {
        const data = await res.json();
        setStatusMessage(`❌ Failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("❌ Network error. Please try again.");
    } finally {
      setIsSending(false);
      setTimeout(() => setStatusMessage(""), 4000);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  if (loading) return <div className="p-5 text-center">Loading pharmacists...</div>;
  if (error) return <div className="p-5 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto font-sans">
      {/* Inbox */}
      <div className="flex-1 bg-white shadow-2xl rounded-xl border border-gray-100 p-6 min-h-[500px] overflow-hidden">
        <h2 className="text-2xl font-extrabold text-green-700 mb-6 flex items-center border-b pb-3">
          Doctor Indox
        </h2>

        {inboxLoading && <p className="text-gray-500">Loading messages...</p>}
        {inboxError && <p className="text-red-500">{inboxError}</p>}

        {!inboxLoading && !inboxError && receivedMessages.length === 0 && (
          <p className="text-gray-500 p-10 border border-dashed rounded-lg">
            Your inbox is empty.
          </p>
        )}

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {receivedMessages.map((msg) => (
            <div
              key={msg._id}
              className={`p-4 rounded-xl border ${
                msg.status === "Unread"
                  ? "bg-yellow-50 border-yellow-400"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div>
                  <span className="font-bold text-gray-800">{msg.senderName}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    @{msg.senderUsername}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(msg.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-700">{msg.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Send Message */}
      <div className="p-6 bg-white shadow-xl rounded-xl max-w-lg mx-auto border border-gray-100">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">
          Message Pharmacist
        </h2>

        <form onSubmit={handleSend} className="space-y-4">
          <p className="text-sm text-gray-600 mb-4 bg-indigo-50 p-3 rounded-lg">
            Sender: {doctorName} ({doctorUsername})
          </p>

          <div ref={searchRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Pharmacist:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setDropdownOpen(true);
              }}
              onClick={() => setDropdownOpen(true)}
              placeholder="Search name or username..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            {dropdownOpen && filteredPharmacists.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-md">
                {filteredPharmacists.map((p) => (
                  <li
                    key={p.username}
                    onClick={() => handleSelect(p)}
                    className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
                  >
                    {p.fullName}{" "}
                    <span className="text-gray-500 text-sm">({p.username})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message:
            </label>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your message..."
              required
            />
          </div>

          {statusMessage && (
            <p
              className={`text-sm font-medium p-2 rounded ${
                statusMessage.startsWith("❌")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {statusMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSending || !selectedPharma || !messageContent.trim()}
            className="w-full py-2 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DocPharmaMsg;
