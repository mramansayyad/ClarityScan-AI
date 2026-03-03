import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, ShieldCheck, FileJson, FileType, Cpu, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: 'Real-time AI Processing',
      description: 'Get your documents analyzed in seconds, not hours. Our AI processes information at lightning speed.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-primary" />,
      title: 'Smart Data Extraction',
      description: 'Intelligently extracts and structures key information like names, dates, totals, and more with high accuracy.',
    },
    {
      icon: <GitBranch className="w-6 h-6 text-primary" />,
      title: 'Multi-format Support',
      description: 'Upload various file types including scanned images (JPG, PNG), and text-based files (TXT, CSV).',
    },
    {
      icon: <FileJson className="w-6 h-6 text-primary" />,
      title: 'Structured Output',
      description: 'Receive clean, machine-readable JSON output, making it easy to integrate with your other systems.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: 'Secure & Encrypted',
      description: 'Your data is important. We use industry-standard encryption to ensure your documents are safe and secure.',
    },
    {
      icon: <FileType className="w-6 h-6 text-primary" />,
      title: 'Exportable Results',
      description: 'Easily download your analysis results in various formats including JSON, with more coming soon.',
    },
  ];

export default function AboutPage() {
  return (
    <div className="space-y-12">
        <section className="text-center bg-card border border-border/50 rounded-xl p-8 lg:p-12">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">Intelligent Document Analysis</Badge>
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-card-foreground">
                Transform Documents into Structured Insights
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                ClarityScan AI leverages cutting-edge generative AI to read, understand, and extract key information from your documents, turning unstructured text into clean, actionable data.
            </p>
            <div className="mt-8 flex justify-center">
                <Link href="/" passHref>
                    <Button size="lg">
                        Go to Dashboard
                    </Button>
                </Link>
            </div>
        </section>

        <section>
            <div className="text-center mb-10">
                <h2 className="text-3xl font-headline font-bold">Powerful Features, Simple Interface</h2>
                <p className="mt-2 text-muted-foreground">Everything you need to automate your document workflows.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg hover:border-primary/50 transition-shadow duration-300">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        {feature.icon}
                        <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="text-center">
            <h2 className="text-3xl font-headline font-bold">How It Works</h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">A simple, three-step process to get from document to data.</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border/50 hidden md:block" />
                <div className="relative flex flex-col items-center gap-4 p-6 bg-card rounded-lg border">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border-2 border-primary">1</div>
                    <h3 className="font-semibold text-lg">Upload Document</h3>
                    <p className="text-sm text-muted-foreground">Drag and drop or select an image or text file.</p>
                </div>
                <div className="relative flex flex-col items-center gap-4 p-6 bg-card rounded-lg border">
                     <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border-2 border-primary">2</div>
                    <h3 className="font-semibold text-lg">AI Analyzes</h3>
                    <p className="text-sm text-muted-foreground">Our model performs OCR, classification, and data extraction.</p>
                </div>
                <div className="relative flex flex-col items-center gap-4 p-6 bg-card rounded-lg border">
                     <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border-2 border-primary">3</div>
                    <h3 className="font-semibold text-lg">Review & Export</h3>
                    <p className="text-sm text-muted-foreground">View the structured data and download it as JSON.</p>
                </div>
            </div>
        </section>
    </div>
  );
}
