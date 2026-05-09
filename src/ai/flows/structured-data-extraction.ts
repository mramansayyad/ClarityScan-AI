'use server';
/**
 * @fileOverview This file implements a Genkit flow for comprehensive data analysis and intelligent document extraction.
 *
 * - structuredDataExtraction - A function that orchestrates the document processing, data extraction, and analysis.
 * - StructuredDataExtractionInput - The input type for the structuredDataExtraction function.
 * - StructuredDataExtractionOutput - The return type for the structuredDataExtraction function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractedFieldValueConfidenceSchema = z.object({
  value: z.union([z.string(), z.number()]), // Allow string or number for value
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('Confidence score for this specific extraction (0-1).'),
});

const ExtractedCurrencyValueConfidenceSchema = z.object({
  value: z.number(),
  currency: z.string().optional(),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('Confidence score for this specific extraction (0-1).'),
});

const StructuredDataExtractionInputSchema = z.object({
  documentContent: z
    .string()
    .describe(
      'The textual content of the document after any OCR processing, or original text content.'
    ),
  sourceFileName: z
    .string()
    .optional()
    .describe('The original file name of the document, for context.'),
});
export type StructuredDataExtractionInput = z.infer<typeof StructuredDataExtractionInputSchema>;

const StructuredDataExtractionOutputSchema = z.object({
  document_type: z
    .string()
    .describe(
      'The automatically detected document type (e.g., invoice, receipt, contract, resume, bank statement, report, email, medical record, legal document, or other).'
    ),
  confidence_score: z
    .number()
    .min(0)
    .max(1)
    .describe('Confidence score for the document type classification (0-1).'),
  extracted_fields: z
    .object({
      names: z
        .array(ExtractedFieldValueConfidenceSchema.extend({ value: z.string() }))
        .describe('List of detected names.'),
      emails: z
        .array(ExtractedFieldValueConfidenceSchema.extend({ value: z.string().email() }))
        .describe('List of detected email addresses.'),
      phoneNumbers: z
        .array(ExtractedFieldValueConfidenceSchema.extend({ value: z.string() }))
        .describe('List of detected phone numbers.'),
      addresses: z
        .array(ExtractedFieldValueConfidenceSchema.extend({ value: z.string() }))
        .describe('List of detected addresses.'),
      dates: z
        .array(
          ExtractedFieldValueConfidenceSchema.extend({
            value: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          })
        )
        .describe('List of detected dates, formatted as YYYY-MM-DD.'),
      ids: z
        .array(ExtractedFieldValueConfidenceSchema.extend({ value: z.string() }))
        .describe('List of detected identification numbers.'),
      invoiceNumbers: z
        .array(ExtractedFieldValueConfidenceSchema.extend({ value: z.string() }))
        .describe('List of detected invoice numbers.'),
      orderNumbers: z
        .array(ExtractedFieldValueConfidenceSchema.extend({ value: z.string() }))
        .describe('List of detected order numbers.'),
      productNames: z
        .array(ExtractedFieldValueConfidenceSchema.extend({ value: z.string() }))
        .describe('List of detected product names.'),
      quantities: z
        .array(ExtractedFieldValueConfidenceSchema.extend({ value: z.number() }))
        .describe('List of detected quantities.'),
      prices: z
        .array(ExtractedCurrencyValueConfidenceSchema)
        .describe(
          'List of detected prices, as numerical values, with optional currency and confidence.'
        ),
      totals: z
        .array(ExtractedCurrencyValueConfidenceSchema)
        .describe(
          'List of detected totals, as numerical values, with optional currency and confidence.'
        ),
      other: z
        .array(
          z.object({
            key: z.string(),
            value: z.union([z.string(), z.number(), z.boolean()]),
            confidence: z.number().min(0).max(1),
          })
        )
        .describe(
          'List of other relevant key-value pairs not covered by specific fields, each with a key, value, and confidence score.'
        ),
    })
    .describe(
      'Structured and normalized data extracted from the document, with confidence levels for each item. Arrays for multiple records.'
    ),
  summary: z
    .string()
    .nullable()
    .describe('An executive summary of the content, or null if not applicable.'),
  key_points: z
    .array(z.string())
    .nullable()
    .describe('A list of important points or null if not applicable.'),
  numerical_analysis: z
    .object({
      total_sum: z
        .number()
        .optional()
        .describe('Sum of all numerical values like prices and totals.'),
      average_value: z.number().optional().describe('Average of significant numerical values.'),
      trends: z
        .string()
        .optional()
        .describe('Description of any detected trends in numerical data.'),
      missing_values: z
        .array(z.string())
        .optional()
        .describe('List of numerical values that seem missing or incomplete.'),
      outliers: z
        .array(z.object({ value: z.number(), description: z.string() }))
        .optional()
        .describe('List of identified numerical outliers with their descriptions.'),
    })
    .nullable()
    .describe(
      'Analysis of numerical data, or null if no numerical data or analysis is applicable.'
    ),
  sentiment_analysis: z
    .object({
      sentiment: z
        .enum(['Positive', 'Neutral', 'Negative', 'Mixed'])
        .optional()
        .describe('Overall sentiment of the text content.'),
      confidence: z
        .number()
        .min(0)
        .max(1)
        .optional()
        .describe('Confidence score for the sentiment analysis (0-1).'),
      emotional_tone: z
        .string()
        .optional()
        .describe('Description of the emotional tone of the content.'),
    })
    .nullable()
    .describe('Sentiment analysis for text-heavy content, or null if not applicable.'),
  risk_flags: z
    .array(z.string())
    .nullable()
    .describe('List of potential risks or anomalies detected, or null if none.'),
  missing_data: z
    .array(z.string())
    .nullable()
    .describe('List of data fields that were expected but could not be extracted or were unclear.'),
  recommended_actions: z
    .array(z.string())
    .nullable()
    .describe('List of recommended actions based on the analysis, or null if none.'),
});
export type StructuredDataExtractionOutput = z.infer<typeof StructuredDataExtractionOutputSchema>;

const structuredDataExtractionPrompt = ai.definePrompt({
  name: 'structuredDataExtractionPrompt',
  input: { schema: StructuredDataExtractionInputSchema },
  output: { schema: StructuredDataExtractionOutputSchema },
  prompt: `You are an advanced AI-powered data analysis and intelligent document extraction system.
Your role is to analyze the provided document content and extract structured, normalized data, perform comprehensive analysis, and summarize key insights.

Here is the document content:
{{documentContent}}

Original file name (for context, if available): {{{sourceFileName}}}

Follow these instructions precisely to generate a clean, structured JSON output:

1.  **document_type**: Automatically detect the document type from the following categories: 'invoice', 'receipt', 'contract', 'resume', 'bank statement', 'report', 'email', 'medical record', 'legal document', or 'other'.
2.  **confidence_score**: Provide a confidence score (0-1) for the detected document type classification.
3.  **extracted_fields**: Extract structured and normalized data fields. For each extracted item, include its 'value' and a 'confidence' score (0-1). If multiple records are present, return them as arrays. Remove duplicates and standardize data where appropriate (e.g., dates as YYYY-MM-DD, currency values as numbers).
    *   **names**: All detected names of individuals or organizations.
    *   **emails**: All detected email addresses.
    *   **phoneNumbers**: All detected phone numbers.
    *   **addresses**: All detected physical addresses.
    *   **dates**: All detected dates, strictly formatted as YYYY-MM-DD.
    *   **ids**: Any identification numbers (e.g., driver's license, passport, customer ID).
    *   **invoiceNumbers**: Detected invoice numbers.
    *   **orderNumbers**: Detected order numbers.
    *   **productNames**: Names of products or services mentioned.
    *   **quantities**: Numerical quantities of items.
    *   **prices**: Individual prices, as numerical values. Optionally, include the 'currency' (e.g., 'USD', 'EUR').
    *   **totals**: Total amounts, as numerical values. Optionally, include the 'currency'.
    *   **other**: Any other relevant key-value pairs not covered by the specific fields above. Provide a 'key', 'value', and 'confidence'.
4.  **summary**: Provide an executive summary of the document's content. If not applicable, return null.
5.  **key_points**: Highlight important points or findings. If not applicable, return null.
6.  **numerical_analysis**: If numerical data exists, perform analysis such as:
    *   'total_sum': Sum of all significant numerical values (e.g., prices, totals).
    *   'average_value': Average of significant numerical values.
    *   'trends': Description of any detected trends in numerical data.
    *   'missing_values': List of numerical values that seem missing or incomplete.
    *   'outliers': List of identified numerical outliers with their descriptions.
    If no numerical data or analysis is applicable, return null for this section.
7.  **sentiment_analysis**: If the content is text-heavy, perform sentiment analysis and return:
    *   'sentiment': 'Positive', 'Neutral', 'Negative', or 'Mixed'.
    *   'confidence': Confidence score for the sentiment analysis (0-1).
    *   'emotional_tone': A brief description of the emotional tone.
    If not applicable, return null.
8.  **risk_flags**: Flag any potential risks, anomalies, or red flags identified in the content. If none, return null.
9.  **missing_data**: List any specific data fields that were expected (based on document type) but could not be extracted or were unclear. If all expected data is found, return null.
10. **recommended_actions**: Based on the analysis, suggest any actionable recommendations. If none, return null.

**Important Rules:**
*   Do NOT hallucinate missing data. If information is unclear or unavailable, clearly state it or return null for the respective field/section.
*   Ensure accuracy, clarity, and structured formatting at all times.
*   Return the entire output as a single, valid JSON object following the schema precisely.
`,
});

const structuredDataExtractionFlow = ai.defineFlow(
  {
    name: 'structuredDataExtractionFlow',
    inputSchema: StructuredDataExtractionInputSchema,
    outputSchema: StructuredDataExtractionOutputSchema,
  },
  async (input) => {
    const { output } = await structuredDataExtractionPrompt(input);
    return output!;
  }
);

export async function structuredDataExtraction(
  input: StructuredDataExtractionInput
): Promise<StructuredDataExtractionOutput> {
  return structuredDataExtractionFlow(input);
}
