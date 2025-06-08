import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 w-full h-full p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-sm">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-8 w-1/3" />
          </div>
        ))}
      </div>
      <Button variant="outline" className="mt-4 w-fit min-w-[150px] mx-auto" disabled>
        <Skeleton className="h-5 w-16" />
      </Button>
    </div>
  );
}