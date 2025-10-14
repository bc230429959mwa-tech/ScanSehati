"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";

export default function HelpPage() {
  // state for form
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  // state for alert
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null); // reset alert at the start

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          fromEmail: form.email,
          message: form.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong!");
      } else {
        setStatus("success");
        setMessage(data.message);
        // clear form
        setForm({ name: "", email: "", message: "" });
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 p-4 md:p-8 text-left">
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight font-headline">Help & Support</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to your questions and get in touch with us.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          {/* FAQ section */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions (FAQ)</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is MediCheck AI a substitute for professional medical advice?</AccordionTrigger>
                  <AccordionContent>
                    No. MediCheck AI is a tool to help you understand potential drug interactions but it is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How accurate is the interaction checker?</AccordionTrigger>
                  <AccordionContent>
                    Our AI-powered interaction checker is designed to be highly accurate based on current medical literature and data. However, it's a supportive tool and the final decision should always be made by a healthcare professional.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I upload a prescription?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to the "Interaction Checker" page and select the "Upload Prescription" tab. You can then select an image of your prescription. Our AI will automatically extract the drug names for you to check.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Is my data secure?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we take data privacy and security very seriously. All data is encrypted, and we follow strict protocols to ensure your information is protected.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Support Form */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Can't find an answer? Reach out to our team.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you?"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    maxLength={300}
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </Button>

                {/* success alert */}
                {status === "success" && (
                  <Alert className="mt-4">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Message Sent</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                {/* error alert */}
                {status === "error" && (
                  <Alert className="mt-4" variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
