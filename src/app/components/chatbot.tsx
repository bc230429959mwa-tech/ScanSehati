'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { askChatbot } from '@/app/actions';
import Image from 'next/image';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/app/components/ui/form';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Bot, Loader2, Send, User, Paperclip, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/app/hooks/use-toast';

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

type FormValues = z.infer<typeof formSchema>;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachmentPreview?: string;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [drugList, setDrugList] = useState<string[]>([]);
  const [attachment, setAttachment] = useState<{ file: File; preview: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedMeds = localStorage.getItem('medications');
    if (savedMeds) {
      try {
        const parsedMeds: { name: string }[] = JSON.parse(savedMeds);
        setDrugList(parsedMeds.map(med => med.name));
      } catch (e) {
        console.error("Failed to parse medications from localStorage", e);
      }
    }
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a file smaller than 4MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment({ file, preview: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
    // Reset the input value to allow re-selecting the same file
    if(event.target) {
        event.target.value = '';
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const userMessage: Message = { 
      role: 'user', 
      content: data.message,
      attachmentPreview: attachment?.preview,
    };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    const response = await askChatbot(data.message, drugList, attachment?.preview);
    setAttachment(null); // Clear attachment after sending

    if (response && 'error' in response) {
      const errorMessage: Message = { role: 'assistant', content: response.error };
      setMessages((prev) => [...prev, errorMessage]);
    } else if (response.answer) {
      const assistantMessage: Message = { role: 'assistant', content: response.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    }
    setIsLoading(false);
  };

  return (
    <Card className="flex h-[calc(100vh-8rem)] flex-col">
       <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center gap-2">
          <Bot /> AI Assistant
        </CardTitle>
        <CardDescription>
          Ask questions about medications, or upload an image for analysis. This is not a substitute for professional medical advice.
           {drugList.length > 0 && (
            <p className="text-xs mt-2 text-green-600">
              Context loaded for your {drugList.length} medication(s).
            </p>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-4',
                  message.role === 'user' ? 'justify-end' : ''
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                     <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-lg p-3 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.attachmentPreview && (
                    <div className="relative mb-2 h-48 w-48">
                      <Image
                        src={message.attachmentPreview}
                        alt="User attachment"
                        fill
                        className="rounded-md object-contain"
                      />
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                 {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-4">
                 <Avatar className="h-8 w-8">
                     <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                <div className="max-w-md rounded-lg p-3 text-sm bg-muted flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin"/>
                    <span>Thinking...</span>
                </div>
              </div>
            )}
            </div>
        </ScrollArea>
        <div className="mt-auto pt-4">
          {attachment && (
            <div className="mb-2 relative w-24 h-24 border rounded-md p-1 bg-muted">
                <Image
                    src={attachment.preview}
                    alt="File preview"
                    fill
                    className="object-contain rounded-md"
                />
                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => setAttachment(null)}
                    disabled={isLoading}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="e.g., Can I take Ibuprofen with Aspirin?" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx" />
              <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Attach file</span>
              </Button>
              <Button type="submit" disabled={isLoading} size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
