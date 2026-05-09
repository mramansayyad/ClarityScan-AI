import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Analysis History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-12">
            <p>No analysis history found.</p>
            <p className="text-sm">Run a new analysis on the dashboard to see your history here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
