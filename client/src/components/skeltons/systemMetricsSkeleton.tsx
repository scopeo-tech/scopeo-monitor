const SkeletonMetrics = () => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* System Metrics Skeleton */}
      <div className="bg-white p-4 col-span-1 rounded-lg shadow-sm animate-pulse">
        <div className="h-4 w-32 bg-gray-300 rounded mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
              <div className="h-4 w-12 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Performance Chart Skeleton */}
      <div className="bg-white p-4 col-span-2 h-96 rounded-lg shadow-sm animate-pulse">
        <div className="h-4 w-48 bg-gray-300 rounded mb-4"></div>
        <div className="h-full w-full bg-gray-200 rounded"></div>
      </div>
      
      {/* Server Metrics Skeleton */}
      <div className="bg-white p-4 col-span-1 rounded-lg shadow-sm animate-pulse">
        <div className="h-4 w-32 bg-gray-300 rounded mb-4"></div>
        <div className="h-40 w-full bg-gray-200 rounded"></div>
      </div>
      
      {/* Traffic Metrics Skeleton */}
      <div className="bg-white p-4 col-span-1 rounded-lg shadow-sm animate-pulse">
        <div className="h-4 w-32 bg-gray-300 rounded mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
              <div className="h-4 w-12 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Stability Metrics Skeleton */}
      <div className="bg-white p-4 col-span-1 rounded-lg shadow-sm animate-pulse">
        <div className="h-4 w-32 bg-gray-300 rounded mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
              <div className="h-4 w-12 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonMetrics;
