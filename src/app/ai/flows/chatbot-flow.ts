'use server';
/**
 * @fileOverview An AI chatbot for answering medication-related questions.
 *
 * - medicationChat - A function that handles chatbot conversations.
 * - MedicationChatInput - The input type for the medicationChat function.
 * - MedicationChatOutput - The return type for the medicationChat function.
 */

import {ai} from '@/app/ai/genkit';
import {z} from 'genkit';

const MedicationChatInputSchema = z.object({
  question: z.string().describe("The user's question about medication."),
  drugList: z
    .array(z.string())
    .optional()
    .describe('The list of medications the patient is currently taking.'),
  attachmentDataUri: z
    .string()
    .optional()
    .describe(
      "An optional file attachment (e.g., image or document) as a data URI."
    ),
});
export type MedicationChatInput = z.infer<typeof MedicationChatInputSchema>;

const MedicationChatOutputSchema = z.object({
  answer: z.string().describe("The AI's answer to the user's question."),
});
export type MedicationChatOutput = z.infer<typeof MedicationChatOutputSchema>;

export async function medicationChat(input: MedicationChatInput): Promise<MedicationChatOutput> {
  return medicationChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicationChatPrompt',
  input: {schema: MedicationChatInputSchema},
  output: {schema: MedicationChatOutputSchema},
  prompt: `You are an AI medical assistant for MediCheck AI. Your role is to answer user questions about medications, their uses, and potential side effects in a clear, simple, and supportive tone.

  {{#if drugList}}
  The user is currently taking the following medications: {{#each drugList}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
  Use this list as the primary context for answering their question.
  {{/if}}

  {{#if attachmentDataUri}}
  The user has also provided the following attachment. Use it as additional context to answer their question.
  Attachment: {{media url=attachmentDataUri}}
  {{/if}}

  User's question: "{{question}}"

  When responding:
  1.  Carefully analyze the user's question and any attached file (image or document).
  2.  If the user's medication list is available, cross-reference any drug mentioned in the question or found in the attachment with the user's medication list.
  3.  If you identify a potential interaction, your response **must** clearly state that there might be an interaction and that they should consult with their doctor. For example: "Based on the information provided, there might be an interaction. It's important to check with your doctor before taking this new medication."
  4.  Provide a direct and easy-to-understand answer to the user's core question.
  5.  Avoid overly technical jargon.
  6.  **Crucially, always include a disclaimer** at the end that you are an AI assistant and your advice is not a substitute for professional medical consultation. Advise the user to speak with their doctor or pharmacist for any health concerns.

  Generate a helpful and safe response to the user's question.
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});

const medicationChatFlow = ai.defineFlow(
  {
    name: 'medicationChatFlow',
    inputSchema: MedicationChatInputSchema,
    outputSchema: MedicationChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
