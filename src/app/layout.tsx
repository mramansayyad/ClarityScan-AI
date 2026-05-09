import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter, Sora } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
});

export const metadata: Metadata = {
  title: 'ClarityScan AI',
  description: 'Intelligent Document Analysis & Data Extraction',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <body className={cn('font-body antialiased bg-background text-foreground min-h-screen')}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Sidebar />
          <div className="ml-16 flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
