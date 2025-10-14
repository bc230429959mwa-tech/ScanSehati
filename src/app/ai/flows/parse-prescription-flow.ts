'use server';
/**
 * @fileOverview Parses a prescription image to extract drug names.
 *
 * - parsePrescription - A function that handles the prescription parsing process.
 * - ParsePrescriptionInput - The input type for the parsePrescription function.
 * - ParsePrescriptionOutput - The return type for the parsePrescription function.
 */

import {ai} from '@/app/ai/genkit';
import {z} from 'genkit';

const ParsePrescriptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParsePrescriptionInput = z.infer<typeof ParsePrescriptionInputSchema>;

const ParsePrescriptionOutputSchema = z.object({
  drugList: z
    .array(z.string())
    .describe('A list of drug names extracted from the prescription.'),
});
export type ParsePrescriptionOutput = z.infer<typeof ParsePrescriptionOutputSchema>;

export async function parsePrescription(input: ParsePrescriptionInput): Promise<ParsePrescriptionOutput> {
  return parsePrescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parsePrescriptionPrompt',
  input: {schema: ParsePrescriptionInputSchema},
  output: {schema: ParsePrescriptionOutputSchema},
  prompt: `You are an expert at reading prescriptions. Analyze the provided image of a prescription and extract all drug names mentioned.

  Return only the drug names.

  Photo: {{media url=photoDataUri}}`,
});

const parsePrescriptionFlow = ai.defineFlow(
  {
    name: 'parsePrescriptionFlow',
    inputSchema: ParsePrescriptionInputSchema,
    outputSchema: ParsePrescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
