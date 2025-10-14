// src/ai/flows/detect-drug-interactions.ts
'use server';

/**
 * @fileOverview Detects potential drug-to-drug interactions, including risk levels and alternative suggestions.
 *
 * - detectDrugInteractions - A function that handles the drug interaction detection process.
 * - DetectDrugInteractionsInput - The input type for the detectDrugInteractions function.
 * - DetectDrugInteractionsOutput - The return type for the detectDrugInteractions function.
 */

import {ai} from '@/app/ai/genkit';
import {z} from 'genkit';

const DetectDrugInteractionsInputSchema = z.object({
  drugList: z
    .array(z.string())
    .describe('A list of drug names to check for interactions.'),
});
export type DetectDrugInteractionsInput = z.infer<typeof DetectDrugInteractionsInputSchema>;

const InteractionSchema = z.object({
  drugA: z.string().describe('The name of the first drug.'),
  drugB: z.string().describe('The name of the second drug.'),
  riskLevel: z
    .enum(['Low', 'Moderate', 'High'])
    .describe('The risk level of the interaction.'),
  description: z.string().describe('A description of the interaction.'),
  alternatives: z.array(z.string()).describe('Alternative drug suggestions.'),
});

const DetectDrugInteractionsOutputSchema = z.object({
  interactions: z.array(InteractionSchema).describe('A list of drug interactions.'),
});
export type DetectDrugInteractionsOutput = z.infer<typeof DetectDrugInteractionsOutputSchema>;

export async function detectDrugInteractions(input: DetectDrugInteractionsInput): Promise<DetectDrugInteractionsOutput> {
  return detectDrugInteractionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectDrugInteractionsPrompt',
  input: {schema: DetectDrugInteractionsInputSchema},
  output: {schema: DetectDrugInteractionsOutputSchema},
  prompt: `You are a pharmacist. Determine if there are any interactions between the following list of drugs:

  {{#each drugList}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  For each potential interaction, identify the risk level (Low, Moderate, or High), describe the interaction, and suggest alternative medications if possible.  Make sure to populate the alternatives field even if no alternatives exist.

  Return the data in the following JSON format:
  {
    "interactions": [
      {
        "drugA": "",
        "drugB": "",
        "riskLevel": "",
        "description": "",
        "alternatives": [ ]
      }
    ]
  }
  `,
});

const detectDrugInteractionsFlow = ai.defineFlow(
  {
    name: 'detectDrugInteractionsFlow',
    inputSchema: DetectDrugInteractionsInputSchema,
    outputSchema: DetectDrugInteractionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
