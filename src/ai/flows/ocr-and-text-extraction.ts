'use server';
/**
 * @fileOverview This file implements a Genkit flow for Optical Character Recognition (OCR) and text extraction.
 * It allows users to upload image-based documents (scanned PDFs, photos) and extracts readable text for further processing.
 *
 * - ocrAndTextExtraction - A function that handles the OCR and text extraction process.
 * - OcrAndTextExtractionInput - The input type for the ocrAndTextExtraction function.
 * - OcrAndTextExtractionOutput - The return type for the ocrAndTextExtraction function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OcrAndTextExtractionInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo or scanned document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type OcrAndTextExtractionInput = z.infer<typeof OcrAndTextExtractionInputSchema>;

const OcrAndTextExtractionOutputSchema = z.object({
  extractedText: z.string().describe('The text extracted from the image via OCR.'),
});
export type OcrAndTextExtractionOutput = z.infer<typeof OcrAndTextExtractionOutputSchema>;

export async function ocrAndTextExtraction(
  input: OcrAndTextExtractionInput
): Promise<OcrAndTextExtractionOutput> {
  return ocrAndTextExtractionFlow(input);
}

const ocrAndTextExtractionPrompt = ai.definePrompt({
  name: 'ocrAndTextExtractionPrompt',
  input: { schema: OcrAndTextExtractionInputSchema },
  output: { schema: OcrAndTextExtractionOutputSchema },
  prompt: `You are an OCR and text extraction specialist. Your task is to accurately extract all readable text from the provided image or document.

Only return the extracted text and do not add any additional commentary or formatting beyond the raw text content.

Image: {{media url=imageDataUri}}`,
});

const ocrAndTextExtractionFlow = ai.defineFlow(
  {
    name: 'ocrAndTextExtractionFlow',
    inputSchema: OcrAndTextExtractionInputSchema,
    outputSchema: OcrAndTextExtractionOutputSchema,
  },
  async (input) => {
    const { output } = await ocrAndTextExtractionPrompt({
      imageDataUri: input.imageDataUri,
    });
    return output!;
  }
);
