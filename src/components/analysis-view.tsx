'use client';

import type { DocumentAnalysisOutput } from '@/ai/flows/document-analysis-and-json-output';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Database,
  BarChart2,
  AlertTriangle,
  FileText,
  Code,
  File,
  HardDrive,
  Type,
  TrendingUp,
  FlaskConical,
  ShieldAlert,
  ClipboardList,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import JsonViewer from './json-viewer';

interface AnalysisViewProps {
  analysis: DocumentAnalysisOutput;
  textContent: string | null;
  fileInfo: { name: string; size: number; type: string } | null;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const renderValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">N/A</span>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-muted-foreground">None</span>;
    return (
      <div className="flex flex-col gap-1">
        {value.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="mt-1 text-primary">&#8226;</span>
            <span>{renderValue(item)}</span>
          </div>
        ))}
      </div>
    );
  }
  if (typeof value === 'object') {
    return <JsonViewer data={value} />;
  }
  return String(value);
};

export default function AnalysisView({ analysis, textContent, fileInfo }: AnalysisViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left column for document preview */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <File className="w-5 h-5 text-primary" />
              Source Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            {fileInfo && (
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <strong className="shrink-0">Filename:</strong>{' '}
                  <span className="truncate text-muted-foreground">{fileInfo.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <HardDrive className="w-4 h-4 text-muted-foreground" />
                  <strong>Size:</strong>{' '}
                  <span className="text-muted-foreground">{formatBytes(fileInfo.size)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Type className="w-4 h-4 text-muted-foreground" />
                  <strong>Type:</strong> <Badge variant="secondary">{fileInfo.type}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Document Preview</CardTitle>
            <CardDescription>The raw text extracted for analysis.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-[60vh] w-full rounded-md border p-4 bg-background/50">
              <pre className="font-code text-sm whitespace-pre-wrap">
                {textContent || 'No text content.'}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Right column for analysis tabs */}
      <div className="lg:col-span-3">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
            <TabsTrigger value="overview">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="data">
              <Database className="w-4 h-4 mr-2" />
              Data
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart2 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="json">
              <Code className="w-4 h-4 mr-2" />
              JSON
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-primary" />
                    Document Type
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Badge className="text-lg py-1 px-3" variant="outline">
                    {analysis.document_type}
                  </Badge>
                  <div className="space-y-1 w-1/2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Confidence</span>
                      <span className="font-medium text-primary">
                        {(analysis.confidence_score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={analysis.confidence_score * 100} />
                  </div>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="font-headline">Executive Summary</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm prose-invert max-w-none">
                  <p>
                    {analysis.summary || (
                      <span className="text-muted-foreground">No summary available.</span>
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="font-headline">Key Points</CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.key_points && analysis.key_points.length > 0 ? (
                    <ul className="space-y-3">
                      {analysis.key_points.map((point, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No key points were identified.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="data" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Extracted Data</CardTitle>
                <CardDescription>All structured data extracted from the document.</CardDescription>
              </CardHeader>
              <CardContent>
                {analysis.extracted_fields ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px] font-semibold">Field</TableHead>
                          <TableHead className="font-semibold">Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(analysis.extracted_fields).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell className="font-medium capitalize">
                              {key.replace(/_/g, ' ')}
                            </TableCell>
                            <TableCell>{renderValue(value)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No fields were extracted.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Numerical Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.numerical_analysis && analysis.numerical_analysis.length > 0 ? (
                    <div className="space-y-4">
                      {analysis.numerical_analysis.map((item, i) => (
                        <div key={i} className="p-4 bg-card/50 rounded-lg border">
                          <p className="font-semibold">{item.insight}</p>
                          {item.value !== undefined && (
                            <p className="text-primary text-2xl font-bold">
                              {renderValue(item.value)}
                            </p>
                          )}
                          {item.trend && (
                            <p className="text-sm">
                              <strong>Trend:</strong> {item.trend}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No numerical analysis available.</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.sentiment_analysis ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Overall Sentiment</p>
                          <Badge
                            variant={
                              analysis.sentiment_analysis.overall_sentiment === 'Positive'
                                ? 'default'
                                : analysis.sentiment_analysis.overall_sentiment === 'Negative'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                            className="text-base"
                          >
                            {analysis.sentiment_analysis.overall_sentiment}
                          </Badge>
                        </div>
                        <div className="space-y-1 w-1/2">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Confidence</span>
                            <span className="font-medium text-primary">
                              {(analysis.sentiment_analysis.confidence_score * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={analysis.sentiment_analysis.confidence_score * 100} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Emotional Tone</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.sentiment_analysis.emotional_tone.map((tone) => (
                            <Badge key={tone} variant="outline">
                              {tone}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No sentiment analysis available.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="alerts" className="mt-6">
            <div className="grid gap-6">
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Risk Flags</AlertTitle>
                <AlertDescription>
                  {analysis.risk_flags && analysis.risk_flags.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {analysis.risk_flags.map((flag, i) => (
                        <li key={i}>{flag}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="flex items-center gap-2 mt-2">
                      <CheckCircle className="w-4 h-4 text-green-500" /> No risks were flagged.
                    </p>
                  )}
                </AlertDescription>
              </Alert>
              <Alert>
                <XCircle className="h-4 w-4" />
                <AlertTitle>Missing Data</AlertTitle>
                <AlertDescription>
                  {analysis.missing_data && analysis.missing_data.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {analysis.missing_data.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="flex items-center gap-2 mt-2">
                      <CheckCircle className="w-4 h-4 text-green-500" /> No missing data was
                      identified.
                    </p>
                  )}
                </AlertDescription>
              </Alert>
              <Alert>
                <ClipboardList className="h-4 w-4" />
                <AlertTitle>Recommended Actions</AlertTitle>
                <AlertDescription>
                  {analysis.recommended_actions && analysis.recommended_actions.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {analysis.recommended_actions.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="flex items-center gap-2 mt-2">
                      <CheckCircle className="w-4 h-4 text-green-500" /> No specific actions
                      recommended.
                    </p>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          <TabsContent value="json" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Raw JSON Output</CardTitle>
                <CardDescription>
                  The complete, unformatted JSON response from the AI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <JsonViewer data={analysis} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
