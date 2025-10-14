import { config } from 'dotenv';
config();

import '@/app/ai/flows/explain-interaction-risks';
import '@/app/ai/flows/suggest-alternative-drugs';
import '@/app/ai/flows/detect-drug-interactions';
import '@/app/ai/flows/parse-prescription-flow';
import '@/app/ai/flows/chatbot-flow';
