'use server';
/**
 * @fileOverview This file implements a Genkit flow for content summarization.
 *
 * - summarizeContent - A function that generates an executive summary, key insights, important points, and risk flags from document content.
 * - ContentSummarizationInput - The input type for the summarizeContent function.
 * - ContentSummarizationOutput - The return type for the summarizeContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ContentSummarizationInputSchema = z.object({
  documentContent: z.string().describe('The full text content of the document to be summarized.'),
});
export type ContentSummarizationInput = z.infer<typeof ContentSummarizationInputSchema>;

const ContentSummarizationOutputSchema = z.object({
  executiveSummary: z.string().describe('A concise executive summary of the document content.'),
  keyInsights: z.array(z.string()).describe('A list of key insights derived from the document.'),
  importantPoints: z
    .array(z.string())
    .describe('A list of important points or crucial aspects highlighted in the document.'),
  riskFlags: z
    .array(z.string())
    .describe('A list of potential risks or anomalies identified in the document.'),
});
export type ContentSummarizationOutput = z.infer<typeof ContentSummarizationOutputSchema>;

export async function summarizeContent(
  input: ContentSummarizationInput
): Promise<ContentSummarizationOutput> {
  return contentSummarizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentSummarizationPrompt',
  input: { schema: ContentSummarizationInputSchema },
  output: { schema: ContentSummarizationOutputSchema },
  prompt: `You are an expert document analyst. Your task is to provide an executive summary, identify key insights, detect important points, and flag any potential risks or anomalies from the provided document content.

Document Content:
"""
{{{documentContent}}}
"""

Based on the document content, generate the following structured JSON output:

executiveSummary: A concise executive summary of the document content.
keyInsights: A list of significant findings.
importantPoints: A list of crucial aspects.
riskFlags: A list of potential risks or anomalies.

If no risks are found, return an empty array for riskFlags.
`,
});

const contentSummarizationFlow = ai.defineFlow(
  {
    name: 'contentSummarizationFlow',
    inputSchema: ContentSummarizationInputSchema,
    outputSchema: ContentSummarizationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
