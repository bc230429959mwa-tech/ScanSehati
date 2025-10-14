'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useToast } from '@/app/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { UploadCloud, Loader2 } from 'lucide-react';
import { getDrugsFromPrescription } from '@/app/actions';
import Image from 'next/image';

interface PrescriptionUploadProps {
  onDrugsParsed: (drugList: string[]) => void;
}

export function PrescriptionUpload({ onDrugsParsed }: PrescriptionUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) {
        // 4MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload an image smaller than 4MB.',
        });
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !preview) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select an image of your prescription to upload.',
      });
      return;
    }

    setIsLoading(true);

    const response = await getDrugsFromPrescription(preview);

    if (response && 'error' in response) {
      toast({
        variant: 'destructive',
        title: 'Error Parsing Prescription',
        description: response.error,
      });
    } else if (response.drugList) {
      onDrugsParsed(response.drugList);
      toast({
        title: 'Success!',
        description:
          "We've extracted the drugs from your prescription. They have been added to the list to check for interactions.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/25 p-8 text-center">
        <UploadCloud className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-xl font-semibold">Upload Doctor's Prescription</h3>
        <p className="text-muted-foreground">
          Drag and drop an image or click to browse.
        </p>
        <Input
          type="file"
          id="prescription-upload"
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </div>

      {preview && (
        <div className="space-y-4">
          <h4 className="font-semibold">Image Preview:</h4>
          <div className="overflow-hidden rounded-md border">
            <Image
              src={preview}
              alt="Prescription preview"
              width={600}
              height={400}
              className="h-auto w-full object-contain"
            />
          </div>
          <Button
            onClick={handleUpload}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing & Adding...
              </>
            ) : (
              'Parse & Add to List'
            )}
          </Button>
        </div>
      )}

      {!preview && (
        <Alert>
          <AlertTitle>No Prescription Selected</AlertTitle>
          <AlertDescription>
            Please select an image file (PNG, JPG, WEBP) of your prescription
            to begin. The file size should not exceed 4MB.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
