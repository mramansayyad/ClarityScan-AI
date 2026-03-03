import CurrentYear from '@/components/current-year';

export default function Footer() {
    return (
        <footer className="px-8 py-4 text-center text-sm text-muted-foreground border-t">
            © <CurrentYear /> ClarityScan AI By <a href="https://amansayyad.page.gd" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Aman Sayyad</a>. All rights reserved.
        </footer>
    );
}
