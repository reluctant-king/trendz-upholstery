export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-beige/70 ${className}`} />;
}

export function SkeletonGrid({ count = 6, className = '' }) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}
