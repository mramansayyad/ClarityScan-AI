'use client';

import { FileScan } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 border-2 border-primary/50 rounded-md flex items-center justify-center">
                    <FileScan className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-xl font-headline font-bold">ClarityScan AI</h1>
            </div>
            <div className="text-right">
                <p className="text-xs text-muted-foreground">by Aman Sayyad</p>
            </div>
        </header>
    );
}
