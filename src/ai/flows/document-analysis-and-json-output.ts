'use server';
/**
 * @fileOverview This file implements the Genkit flow for comprehensive document analysis and structured JSON output.
 * It detects document types, extracts structured data, performs numerical and sentiment analysis,
 * generates summaries, identifies key points, flags risks, and compiles all results into a
 * clean, structured JSON format.
 *
 * - documentAnalysisAndJsonOutput - The main function to initiate the document analysis flow.
 * - DocumentAnalysisInput - The input type for the documentAnalysisAndJsonOutput function.
 * - DocumentAnalysisOutput - The return type for the documentAnalysisAndJsonOutput function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DocumentAnalysisInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The raw text content of the document to be analyzed.'),
});
export type DocumentAnalysisInput = z.infer<typeof DocumentAnalysisInputSchema>;

const DocumentAnalysisOutputSchema = z.object({
  document_type: z
    .string()
    .describe(
      'Automatically detected document type (e.g., invoice, receipt, contract, resume, bank statement, report, email, medical record, legal document, or other).'
    ),
  confidence_score: z
    .number()
    .min(0)
    .max(1)
    .describe('Confidence score (0-1) for the document type classification.'),
  extracted_fields: z
    .record(
      z.string(),
      z.union([
        z.string(),
        z.array(z.string()),
        z.number(),
        z.boolean(),
        z.null(),
      ])
    )
    .nullable()
    .describe(
      'Structured and normalized data extracted from the document, including names, emails, phone numbers, addresses, dates (YYYY-MM-DD), IDs, invoice numbers, order numbers, product names, quantities, prices, totals. Remove duplicates, standardize currency values. If multiple records are present, return them as arrays. If a field is not found or is unclear, set its value to null or omit it. Do not hallucinate missing data.'
    ),
  summary: z
    .string()
    .nullable()
    .describe('An executive summary of the document content.'),
  key_points: z
    .array(z.string())
    .nullable()
    .describe('Key insights and important points detected in the document.'),
  numerical_analysis: z
    .array(
      z.object({
        insight: z
          .string()
          .describe('Description of the numerical insight or calculation.'),
        value: z
          .any()
          .optional()
          .describe('The calculated value for the insight (e.g., total, average).'),
        trend: z
          .string()
          .optional()
          .describe('Observed trend (e.g., "increasing", "decreasing", "stable").'),
        outliers: z
          .array(z.any())
          .optional()
          .describe('Identified outlier values if applicable.'),
        missing_values: z
          .array(z.string())
          .optional()
          .describe('Description of missing numerical values if applicable.'),
      })
    )
    .nullable()
    .describe(
      'Analysis of numerical data including totals, averages, trends, comparisons, missing values detection, and outlier identification. Returns null if no numerical data or analysis is applicable.'
    ),
  sentiment_analysis: z
    .object({
      overall_sentiment: z
        .enum(['Positive', 'Neutral', 'Negative'])
        .describe('Overall sentiment classification.'),
      confidence_score: z
        .number()
        .min(0)
        .max(1)
        .describe('Confidence score (0-1) for the sentiment analysis.'),
      emotional_tone: z
        .array(z.string())
        .describe('Assessment of emotional tones present (e.g., Joy, Sadness, Anger, Surprise, Fear, Neutral).'),
    })
    .nullable()
    .describe(
      'Sentiment analysis for text-heavy content, including classification, confidence, and emotional tone assessment. Returns null if not applicable (e.g., purely numerical content).'
    ),
  risk_flags: z
    .array(z.string())
    .nullable()
    .describe('Potential risks or anomalies flagged in the document.'),
  missing_data: z
    .array(z.string())
    .nullable()
    .describe(
      'List of crucial information that was expected but found to be missing or unclear in the document.'
    ),
  recommended_actions: z
    .array(z.string())
    .nullable()
    .describe('Suggested actions based on the document analysis.'),
});
export type DocumentAnalysisOutput = z.infer<typeof DocumentAnalysisOutputSchema>;

export async function documentAnalysisAndJsonOutput(
  input: DocumentAnalysisInput
): Promise<DocumentAnalysisOutput> {
  return documentAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'documentAnalysisPrompt',
  input: { schema: DocumentAnalysisInputSchema },
  output: { schema: DocumentAnalysisOutputSchema },
  prompt: `You are an advanced AI-powered data analysis and intelligent document extraction system.
Your goal is to analyze the provided document content thoroughly and return all findings in a structured JSON format, adhering strictly to the provided schema.

--- Document Content ---
{{{documentContent}}}
--- End Document Content ---

**Instructions:**

1.  **Document Type and Confidence:** Automatically detect the document type (e.g., invoice, receipt, contract, resume, bank statement, report, email, medical record, legal document, or other) and assign a confidence score (0-1) for this classification.
2.  **Data Extraction:** Extract structured and normalized data. For example: names, emails, phone numbers, addresses, dates (format as YYYY-MM-DD), IDs, invoice numbers, order numbers, product names, quantities, prices, totals. Remove duplicates, standardize currency values. If multiple records are present, return them as arrays. If a specific field is not found or is unclear, set its value to null or omit it. Do not hallucinate missing data.
3.  **Executive Summary:** Provide a concise executive summary of the document content. Return null if not applicable or content is too short for a meaningful summary.
4.  **Key Points:** Highlight key insights and detect important points from the document as an array of strings. Return null if not applicable.
5.  **Numerical Analysis:** If numerical data exists in the document, perform analysis such as totals, averages, trends, comparisons, missing values detection, and outlier identification. Present each numerical insight as an object with 'insight' (description), 'value' (optional calculated value), 'trend' (optional, e.g., "increasing"), 'outliers' (optional array), and 'missing_values' (optional array of descriptions). Return null if no numerical data or analysis is applicable.
6.  **Sentiment Analysis:** If the content is text-heavy, perform sentiment analysis. Identify the 'overall_sentiment' (Positive, Neutral, or Negative), provide a 'confidence_score' (0-1), and list 'emotional_tone' as an array of relevant emotions (e.g., Joy, Sadness, Anger, Surprise, Fear, Neutral). Return null if sentiment analysis is not applicable (e.g., purely numerical content).
7.  **Risk Flags:** Flag any potential risks or anomalies identified in the document as an array of strings. Return null if none are detected.
8.  **Missing Data:** List any crucial information that was expected but found to be missing or unclear in the document as an array of strings. Return null if all expected data is present.
9.  **Recommended Actions:** Suggest actions that could be taken based on the document analysis as an array of strings. Return null if no specific actions are recommended.

**Important:** Always return the final output in a clean, structured JSON format that strictly conforms to the \`DocumentAnalysisOutputSchema\` provided. Ensure accuracy, clarity, and structured formatting at all times. If any section does not apply according to the instructions above, return its value as \`null\`.
`,
});

const documentAnalysisFlow = ai.defineFlow(
  {
    name: 'documentAnalysisAndJsonOutput',
    inputSchema: DocumentAnalysisInputSchema,
    outputSchema: DocumentAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate document analysis output.');
    }
    return output;
  }
);
