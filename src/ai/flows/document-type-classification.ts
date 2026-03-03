'use server';
/**
 * @fileOverview A Genkit flow for classifying the type of an uploaded document.
 *
 * - classifyDocumentType - A function that handles the document type classification process.
 * - DocumentTypeClassificationInput - The input type for the classifyDocumentType function.
 * - DocumentTypeClassificationOutput - The return type for the classifyDocumentType function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DocumentTypeClassificationInputSchema = z.object({
  documentContent: z.string().describe('The extracted text content of the document.'),
});
export type DocumentTypeClassificationInput = z.infer<typeof DocumentTypeClassificationInputSchema>;

const DocumentTypeClassificationOutputSchema = z.object({
  document_type: z
    .enum([
      'invoice',
      'receipt',
      'contract',
      'resume',
      'bank statement',
      'report',
      'email',
      'medical record',
      'legal document',
      'other',
    ])
    .describe('The detected type of the document.'),
  confidence_score: z
    .number()
    .min(0)
    .max(1)
    .describe('A confidence score (0-1) for the document type classification.'),
});
export type DocumentTypeClassificationOutput = z.infer<typeof DocumentTypeClassificationOutputSchema>;

const classifyDocumentTypePrompt = ai.definePrompt({
  name: 'classifyDocumentTypePrompt',
  input: { schema: DocumentTypeClassificationInputSchema },
  output: { schema: DocumentTypeClassificationOutputSchema },
  prompt: `You are an expert document classification AI.
Given the following document content, classify its type from the following options: invoice, receipt, contract, resume, bank statement, report, email, medical record, legal document, or other.
Provide a confidence score for your classification between 0 and 1.

Document Content:
---
{{{documentContent}}}
---

Return the document type and confidence score in the specified JSON format.`,
});

const documentTypeClassificationFlow = ai.defineFlow(
  {
    name: 'documentTypeClassificationFlow',
    inputSchema: DocumentTypeClassificationInputSchema,
    outputSchema: DocumentTypeClassificationOutputSchema,
  },
  async (input) => {
    const { output } = await classifyDocumentTypePrompt(input);
    return output!;
  }
);

export async function classifyDocumentType(input: DocumentTypeClassificationInput): Promise<DocumentTypeClassificationOutput> {
  return documentTypeClassificationFlow(input);
}
