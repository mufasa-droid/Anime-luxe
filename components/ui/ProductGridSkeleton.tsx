export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-3xl">
          <div className="skeleton aspect-square rounded-t-3xl" />
          <div className="glass space-y-2 rounded-b-3xl p-5">
            <div className="skeleton h-3 w-16 rounded" />
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-5 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
