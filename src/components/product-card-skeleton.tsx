
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden h-full">
      <CardHeader className="p-0">
        <Skeleton className="aspect-square w-full" />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Skeleton className="h-5 w-1/3 mb-2" />
        <Skeleton className="h-6 w-full" />
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <Skeleton className="h-7 w-1/2" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </CardFooter>
    </Card>
  );
}
