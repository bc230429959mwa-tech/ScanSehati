
'use server';

import {
  detectDrugInteractions,
  type DetectDrugInteractionsOutput,
} from '@/app/ai/flows/detect-drug-interactions';
import {
  parsePrescription,
  type ParsePrescriptionOutput,
} from '@/app/ai/flows/parse-prescription-flow';
import {
  medicationChat,
  type MedicationChatOutput,
} from '@/app/ai/flows/chatbot-flow';
import {
  explainInteractionRisks,
  type ExplainInteractionRisksOutput,
} from '@/app/ai/flows/explain-interaction-risks';

export async function checkInteractions(
  drugList: string[]
): Promise<DetectDrugInteractionsOutput | { error: string }> {
  if (!drugList || drugList.length < 2) {
    return { error: 'Please provide at least two drugs to check for interactions.' };
  }

  try {
    const result = await detectDrugInteractions({ drugList });
    return result;
  } catch (error) {
    console.error('Error in detectDrugInteractions flow:', error);
    return { error: 'Failed to check interactions due to a server error. Please try again later.' };
  }
}

export async function getDrugsFromPrescription(
  photoDataUri: string
): Promise<ParsePrescriptionOutput | { error: string }> {
  if (!photoDataUri) {
    return { error: 'Please provide a prescription image.' };
  }

  try {
    const result = await parsePrescription({ photoDataUri });
    return result;
  } catch (error) {
    console.error('Error in parsePrescription flow:', error);
    return {
      error:
        'Failed to parse prescription due to a server error. Please try again later.',
    };
  }
}

export async function askChatbot(
  question: string,
  drugList?: string[],
  attachmentDataUri?: string
): Promise<MedicationChatOutput | { error: string }> {
  if (!question) {
    return { error: 'Please provide a question.' };
  }

  try {
    const result = await medicationChat({ question, drugList, attachmentDataUri });
    return result;
  } catch (error) {
    console.error('Error in medicationChat flow:', error);
    return { error: 'Failed to get a response due to a server error. Please try again later.' };
  }
}

export async function getRiskExplanation(
  drugA: string,
  drugB: string,
  interactionDetails: string
): Promise<ExplainInteractionRisksOutput | { error: string }> {
  if (!drugA || !drugB || !interactionDetails) {
    return { error: 'Please provide the necessary details for an explanation.' };
  }

  try {
    const result = await explainInteractionRisks({ drugA, drugB, interactionDetails });
    return result;
  } catch (error) {
    console.error('Error in explainInteractionRisks flow:', error);
    return { error: 'Failed to get an explanation due to a server error. Please try again later.' };
  }
}
