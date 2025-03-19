const RecentLogsSkeleton = () => {
    return (
      <div className="p-4">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-4">
          <div className="w-32 h-6 bg-gray-300 animate-pulse rounded-md"></div>
          <div className="w-24 h-8 bg-gray-300 animate-pulse rounded-md"></div>
        </div>
  
        {/* Logs Container Skeleton */}
        <div className="bg-slate-200 rounded-lg shadow-md p-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-5 bg-gray-300 animate-pulse rounded-md my-2"></div>
          ))}
        </div>
      </div>
    );
  };
  
  export default RecentLogsSkeleton;
  