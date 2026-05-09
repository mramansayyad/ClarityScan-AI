# API Reference - ClarityScan AI

ClarityScan AI uses Next.js Server Actions to handle operations securely on the server side. These actions interact with Google Genkit flows.

## Server Actions

### `documentAnalysisAndJsonOutput`

Analyzes the provided document content and returns a structured JSON output.

- **File**: `src/ai/flows/document-analysis-and-json-output.ts`
- **Input**:
  ```typescript
  {
    documentContent: string; // The raw text content of the document
  }
  ```
- **Output**:
  ```typescript
  {
    document_type: string;
    confidence_score: number;
    extracted_fields: Record<string, any> | null;
    summary: string | null;
    key_points: string[] | null;
    numerical_analysis: Array<{...}> | null;
    sentiment_analysis: {...} | null;
    risk_flags: string[] | null;
    missing_data: string[] | null;
    recommended_actions: string[] | null;
  }
  ```

### `ocrAndTextExtraction`

Performs OCR on an image or PDF to extract text.

- **File**: `src/ai/flows/ocr-and-text-extraction.ts`
- **Input**:
  ```typescript
  {
    imageDataUri: string; // Base64 data URI of the image or PDF
  }
  ```
- **Output**:
  ```typescript
  {
    extractedText: string;
  }
  ```

### `documentTypeClassification`

Classifies the type of the document.

- **File**: `src/ai/flows/document-type-classification.ts`
- **Input**:
  ```typescript
  {
    documentContent: string;
  }
  ```
- **Output**:
  ```typescript
  {
    documentType: string;
    confidenceScore: number;
  }
  ```

### `contentSummarization`

Generates a summary of the document content.

- **File**: `src/ai/flows/content-summarization.ts`
- **Input**:
  ```typescript
  {
    documentContent: string;
  }
  ```
- **Output**:
  ```typescript
  {
    summary: string;
  }
  ```

## Usage Example

To use these actions in a client component:

```typescript
'use client';

import { documentAnalysisAndJsonOutput } from '@/ai/flows/document-analysis-and-json-output';

async function handleAnalyze(text: string) {
  const result = await documentAnalysisAndJsonOutput({ documentContent: text });
  console.log(result.document_type);
}
```
