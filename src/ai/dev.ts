import { config } from 'dotenv';
config();

import '@/ai/flows/content-summarization.ts';
import '@/ai/flows/document-type-classification.ts';
import '@/ai/flows/ocr-and-text-extraction.ts';
import '@/ai/flows/structured-data-extraction.ts';
import '@/ai/flows/document-analysis-and-json-output.ts';
