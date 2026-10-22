export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800 ${className}`} />
);

export const EventCardSkeleton = () => (
  <div className="card overflow-hidden">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="space-y-3 p-5">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

export const StatCardSkeleton = () => (
  <div className="card p-6">
    <Skeleton className="mb-4 h-10 w-10 rounded-xl" />
    <Skeleton className="mb-2 h-7 w-24" />
    <Skeleton className="h-4 w-32" />
  </div>
);
