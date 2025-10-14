// src/ai/flows/suggest-alternative-drugs.ts
'use server';

/**
 * @fileOverview Suggests alternative drugs with lower interaction risks when a harmful interaction is detected.
 *
 * - suggestAlternativeDrugs - A function that suggests alternative drugs.
 * - SuggestAlternativeDrugsInput - The input type for the suggestAlternativeDrugs function.
 * - SuggestAlternativeDrugsOutput - The return type for the suggestAlternativeDrugs function.
 */

import {ai} from '@/app/ai/genkit';
import {z} from 'genkit';

const SuggestAlternativeDrugsInputSchema = z.object({
  drugs: z
    .array(z.string())
    .describe('An array of drug names to find alternatives for.'),
  interactionDescription: z
    .string()
    .describe('A description of the harmful interaction detected.'),
});
export type SuggestAlternativeDrugsInput = z.infer<
  typeof SuggestAlternativeDrugsInputSchema
>;

const SuggestAlternativeDrugsOutputSchema = z.object({
  alternativeDrugs: z
    .array(z.string())
    .describe(
      'An array of alternative drug names with lower interaction risks.'
    ),
  reasoning: z.string().describe('The reasoning behind the suggestions.'),
});
export type SuggestAlternativeDrugsOutput = z.infer<
  typeof SuggestAlternativeDrugsOutputSchema
>;

export async function suggestAlternativeDrugs(
  input: SuggestAlternativeDrugsInput
): Promise<SuggestAlternativeDrugsOutput> {
  return suggestAlternativeDrugsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternativeDrugsPrompt',
  input: {schema: SuggestAlternativeDrugsInputSchema},
  output: {schema: SuggestAlternativeDrugsOutputSchema},
  prompt: `You are a pharmacist recommending alternative drugs with lower interaction risks.

  Given the following drugs: {{drugs}}
  And the following interaction description: {{interactionDescription}}

  Suggest alternative drugs with lower interaction risks and explain your reasoning.
  Return the results in the following JSON format:
  {
    "alternativeDrugs": ["alternative drug 1", "alternative drug 2"],
    "reasoning": "The reasoning behind the suggestions."
  }`,
});

const suggestAlternativeDrugsFlow = ai.defineFlow(
  {
    name: 'suggestAlternativeDrugsFlow',
    inputSchema: SuggestAlternativeDrugsInputSchema,
    outputSchema: SuggestAlternativeDrugsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
