'use client';

import { FileScan, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary/10 border-2 border-primary/50 rounded-md flex items-center justify-center">
          <FileScan className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-xl font-headline font-bold">ClarityScan AI</h1>
      </div>
      <div className="flex items-center gap-4">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full w-9 h-9"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-700" />
            )}
          </Button>
        )}
        <div className="text-right hidden sm:block">
          <p className="text-xs text-muted-foreground">by Aman Sayyad</p>
        </div>
      </div>
    </header>
  );
}
