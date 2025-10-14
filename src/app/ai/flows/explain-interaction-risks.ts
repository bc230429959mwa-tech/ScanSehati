// This is an AI-powered tool to explain the risks associated with detected drug interactions in plain language.

'use server';

import {ai} from '@/app/ai/genkit';
import {z} from 'genkit';

const ExplainInteractionRisksInputSchema = z.object({
  drugA: z.string().describe('The name of the first drug.'),
  drugB: z.string().describe('The name of the second drug.'),
  interactionDetails: z.string().describe('Details about the interaction between the two drugs.'),
  userContext: z.string().optional().describe('Optional context about the user, such as health conditions or other medications.'),
});

export type ExplainInteractionRisksInput = z.infer<typeof ExplainInteractionRisksInputSchema>;

const ExplainInteractionRisksOutputSchema = z.object({
  explanation: z.string().describe('A plain language explanation of the risks associated with the drug interaction.'),
  severity: z.enum(['Low', 'Moderate', 'High']).describe('The severity level of the interaction.'),
  recommendation: z.string().describe('A recommendation based on the interaction risks.'),
});

export type ExplainInteractionRisksOutput = z.infer<typeof ExplainInteractionRisksOutputSchema>;

export async function explainInteractionRisks(input: ExplainInteractionRisksInput): Promise<ExplainInteractionRisksOutput> {
  return explainInteractionRisksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainInteractionRisksPrompt',
  input: {schema: ExplainInteractionRisksInputSchema},
  output: {schema: ExplainInteractionRisksOutputSchema},
  prompt: `You are a helpful AI assistant specializing in explaining drug interactions to users in plain language. Your audience is a healthcare professional, so you can be slightly more technical but should remain clear and concise.

  Given two drugs, {{drugA}} and {{drugB}}, and the following details about their interaction:
  {{interactionDetails}}

  {{#if userContext}}
  Consider the following context about the patient: {{userContext}}.
  {{/if}}

  1.  **Explain the Interaction**: Describe the risks associated with this interaction. Detail the pharmacokinetic or pharmacodynamic mechanism if known (e.g., "Drug A inhibits the CYP3A4 enzyme, which is responsible for metabolizing Drug B, leading to increased plasma concentrations of Drug B and a higher risk of toxicity.").
  2.  **Determine Severity**: Classify the severity as Low, Moderate, or High based on the potential clinical impact.
  3.  **Provide a Recommendation**: Offer a clear, actionable recommendation. Examples: "Monitor patient for signs of [specific side effect]," "Consider reducing the dose of Drug B and monitoring plasma levels," or "Avoid co-administration. Consider using [alternative drug] instead of Drug A."

  Return the explanation, severity, and recommendation in the specified output format.
  `,
});

const explainInteractionRisksFlow = ai.defineFlow(
  {
    name: 'explainInteractionRisksFlow',
    inputSchema: ExplainInteractionRisksInputSchema,
    outputSchema: ExplainInteractionRisksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
