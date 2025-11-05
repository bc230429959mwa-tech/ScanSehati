// src/app/pharma-dashboard/PharmaDocMsg.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef, FormEvent } from "react";
import { useSession } from "next-auth/react";

interface Doctor {
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

const PharmaDocMsg: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [inboxError, setInboxError] = useState<string | null>(null);
  

  const { data: session, status } = useSession();
  const searchRef = useRef<HTMLDivElement | null>(null);

  if (status === "loading") return <p>Loading user...</p>;
  if (!session) return <p>You must be logged in as a pharmacist.</p>;

  const pharma = session.user as any;

  // IMPORTANT: use the username field from session (not .name)
  const pharmaUsername = pharma.username ?? pharma.userName ?? pharma.name; // prefer username, fallback
  const pharmaName = pharma.fullName ?? pharma.name ?? pharmaUsername;
  const pharmaRole = pharma.role ?? "Pharmacist";

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/users?role=doctor");
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch pharmacist's inbox (messages to this pharmacist)
  useEffect(() => {
    const fetchInbox = async () => {
      setInboxLoading(true);
      try {
        // NOTE: updated path to match server route
        const res = await fetch(`/api/doctorPharmaMessage?recipientUsername=${pharmaUsername}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to fetch messages");
        }
        const data = await res.json();
        setReceivedMessages(data.messages || []);
      } catch (err: any) {
        setInboxError(err.message);
      } finally {
        setInboxLoading(false);
      }
    };
    if (pharmaUsername) fetchInbox();
  }, [pharmaUsername]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDoctors = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return doctors.filter(
      (d) =>
        d.fullName.toLowerCase().includes(lower) ||
        d.username.toLowerCase().includes(lower)
    );
  }, [searchTerm, doctors]);

  const handleSelect = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setSearchTerm(doc.fullName);
    setDropdownOpen(false);
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedDoctor || !messageContent.trim()) {
      setStatusMessage("Please select a doctor and enter a message.");
      return;
    }

   setIsSending(true);
    setStatusMessage("Sending...");

    const messageData = {
      senderUsername: pharmaUsername,
      senderName: pharmaName,
      // 🐛 FIX 3: Ensure senderRole is lowercase (or is explicitly set to "pharmacist")
      senderRole: pharmaRole.toLowerCase(), // Use toLowerCase() on the dynamic role
      recipientUsername: selectedDoctor.username,
      recipientName: selectedDoctor.fullName,
      // 🐛 FIX 4: Change "Doctor" to "doctor" to match Mongoose enum
      recipientRole: "doctor", // ✅ CORRECTED to lowercase
      content: messageContent.trim(),
    };

    try {
      // NOTE: updated path to match your server route
      const res = await fetch("/api/pharmaDoctorMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      if (res.ok) {
        const resp = await res.json();
        setStatusMessage("✅ Message sent successfully!");
        setMessageContent("");
        setSelectedDoctor(null);
        setSearchTerm("");
        // Optionally append the sent message to the UI inbox:
        // setReceivedMessages(prev => [resp.message, ...prev]);
      } else {
        const data = await res.json().catch(() => ({ message: "Unknown error" }));
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

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto font-sans">
      {/* Inbox */}
      <div className="flex-1 bg-white shadow-xl rounded-xl border border-gray-100 p-6 min-h-[500px]">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b pb-2">
          Pharmacist Inbox
        </h2>

        {inboxLoading && <p className="text-gray-500">Loading messages...</p>}
        {inboxError && <p className="text-red-500">{inboxError}</p>}

        {!inboxLoading && !inboxError && receivedMessages.length === 0 && (
          <p className="text-gray-500 border border-dashed p-6 rounded-lg text-center">
            No messages yet from doctors.
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
                  <span className="text-xs text-gray-500 ml-2">@{msg.senderUsername}</span>
                </div>
                <span className="text-xs text-gray-500">{formatDate(msg.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-700">{msg.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Send message to Doctor */}
      <div className="p-6 bg-white shadow-xl rounded-xl max-w-lg mx-auto border border-gray-100">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Message Doctor</h2>

        <form onSubmit={handleSend} className="space-y-4">
          <p className="text-sm text-gray-600 mb-4 bg-blue-50 p-3 rounded-lg">
            Sender: {pharmaName} ({pharmaUsername})
          </p>

          <div ref={searchRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Doctor:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setDropdownOpen(true);
              }}
              onClick={() => setDropdownOpen(true)}
              placeholder="Search doctor..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            {dropdownOpen && filteredDoctors.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-md">
                {filteredDoctors.map((d) => (
                  <li
                    key={d.username}
                    onClick={() => handleSelect(d)}
                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {d.fullName} <span className="text-gray-500 text-sm">({d.username})</span>
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
            disabled={isSending || !selectedDoctor || !messageContent.trim()}
            className="w-full py-2 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isSending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PharmaDocMsg;
