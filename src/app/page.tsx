'use client';

import { useState, useCallback } from 'react';
import { documentAnalysisAndJsonOutput } from '@/ai/flows/document-analysis-and-json-output';
import type { DocumentAnalysisOutput } from '@/ai/flows/document-analysis-and-json-output';
import { ocrAndTextExtraction } from '@/ai/flows/ocr-and-text-extraction';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Sparkles, X, Download, FileType, FileJson } from 'lucide-react';
import FileUploader from '@/components/file-uploader';
import AnalysisView from '@/components/analysis-view';
import { Button } from '@/components/ui/button';

type FileInfo = {
  name: string;
  size: number;
  type: string;
};

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysisOutput | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);
      setAnalysis(null);
      setTextContent(null);
      setFileInfo({ name: file.name, size: file.size, type: file.type });

      try {
        let documentContent = '';
        const supportedTextBasedFiles = [
          'text/plain',
          'text/csv',
          'application/json',
          'text/markdown',
        ];

        if (file.type.startsWith('image/') || file.type === 'application/pdf') {
          const dataUrl = await readFileAsDataURL(file);
          const ocrResult = await ocrAndTextExtraction({ imageDataUri: dataUrl });
          documentContent = ocrResult.extractedText;
        } else if (supportedTextBasedFiles.includes(file.type)) {
          documentContent = await readFileAsText(file);
        } else {
          throw new Error(
            `File type '${file.type}' is not yet supported for content analysis. Please upload an image, PDF, or text file.`
          );
        }

        setTextContent(documentContent);

        if (!documentContent.trim()) {
          throw new Error(
            'Could not extract any text from the document. The file might be empty or unreadable.'
          );
        }

        const analysisResult = await documentAnalysisAndJsonOutput({ documentContent });
        setAnalysis(analysisResult);
      } catch (e: any) {
        const errorMessage = e.message || 'An unknown error occurred during analysis.';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const handleReset = () => {
    setAnalysis(null);
    setTextContent(null);
    setFileInfo(null);
    setError(null);
  };

  const handleDownload = (format: 'json' | 'csv' | 'pdf') => {
    if (!analysis) return;

    let data = '';
    let mimeType = '';
    let fileExtension = '';

    if (format === 'json') {
      data = JSON.stringify(analysis, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
    }
    // Add logic for CSV and PDF when available

    if (data) {
      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analysis_results.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      toast({
        variant: 'destructive',
        title: 'Download Not Available',
        description: `Exporting as ${format.toUpperCase()} is not yet implemented.`,
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-200px)] gap-4 text-center">
          <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
          <h2 className="text-2xl font-headline font-semibold">Analyzing your document...</h2>
          <p className="text-muted-foreground max-w-md">
            Our AI is working its magic. This may take a moment.
          </p>
        </div>
      ) : analysis ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-headline font-bold">Analysis Results</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" onClick={() => handleDownload('pdf')}>
                <Download /> PDF
              </Button>
              <Button variant="outline" onClick={() => handleDownload('csv')}>
                <FileType /> CSV
              </Button>
              <Button variant="outline" onClick={() => handleDownload('json')}>
                <FileJson /> JSON
              </Button>
              <Button onClick={handleReset}>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze New Document
              </Button>
            </div>
          </div>
          <AnalysisView analysis={analysis} textContent={textContent} fileInfo={fileInfo} />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-200px)] gap-4 text-center">
          <div className="bg-destructive/10 p-4 rounded-full">
            <X className="w-12 h-12 text-destructive" />
          </div>
          <h2 className="text-2xl font-headline font-semibold text-destructive">Analysis Failed</h2>
          <p className="text-muted-foreground max-w-lg">{error}</p>
          <Button onClick={handleReset} variant="destructive">
            Try Again
          </Button>
        </div>
      ) : (
        <FileUploader onFileUpload={handleFileUpload} />
      )}
    </>
  );
}
