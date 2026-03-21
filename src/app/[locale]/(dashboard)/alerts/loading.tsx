import { Card } from "@/components/ui/card";

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-muted ${className}`} />
  );
}

export default function AlertsLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Skeleton className="h-9 w-32 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4 flex flex-col items-center justify-center h-24">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-8 w-12" />
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Skeleton className="h-10 w-full sm:w-[200px]" />
        <Skeleton className="h-10 w-full sm:w-[200px]" />
      </div>

      <Card className="overflow-hidden">
        <div className="p-4">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <Skeleton className="h-12 w-full max-w-[200px]" />
                <Skeleton className="h-12 w-full max-w-[300px]" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
