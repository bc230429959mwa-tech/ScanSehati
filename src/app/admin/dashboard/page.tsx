"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/app/components/ui/card";
import { Loader2, LogOut, Mail, MessageSquare } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";

interface ContactMessage {
  _id: string;
  message: string;
  fromEmail?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/admin/message", { credentials: "include" });

        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error("Failed to fetch contact messages:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm border-b flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <Card className="shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl">Contact Messages</CardTitle>
            <CardDescription>View all messages submitted via the contact form.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {isLoading && (
              <div className="flex justify-center items-center py-10 text-gray-600">
                <Loader2 className="animate-spin mr-2" />
                <span>Loading messages...</span>
              </div>
            )}

            {!isLoading && messages.length === 0 && (
              <div className="text-center py-10 text-gray-500">No messages found.</div>
            )}

            {!isLoading &&
              messages.map((msg) => (
                <Card
                  key={msg._id}
                  className="p-4 hover:shadow-lg transition border border-gray-200 bg-white rounded-xl"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-gray-800 flex items-center gap-2">
                        {msg.fromEmail || "Anonymous"}
                      </p>
                      {msg.fromEmail && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail size={14} /> {msg.fromEmail}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                      {new Date(msg.createdAt).toLocaleDateString()}{" "}
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </Badge>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                    <MessageSquare size={16} className="mt-1 text-gray-400" />
                    <p>{msg.message}</p>
                  </div>
                </Card>
              ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
