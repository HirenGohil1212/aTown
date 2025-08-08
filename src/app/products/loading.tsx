
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCardSkeleton } from "@/components/product-card-skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-1/2 mx-auto mb-8" />

      {/* Filters Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Skeleton className="h-10 md:col-span-1" />
        <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </div>


      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
