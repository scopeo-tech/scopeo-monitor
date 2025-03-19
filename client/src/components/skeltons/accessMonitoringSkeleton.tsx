"use client";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AccessMonitorSkeleton = () => {
  return (
    <div className="pb-2 m-0 text-gray-600">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
            <Skeleton height={24} width="80%" />
            <Skeleton height={32} width="100%" className="mt-2" />
          </div>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="flex h-96 justify-between pt-2 w-full gap-1">
        {/* Line Chart */}
        <div className="flex-[70] p-4 bg-white rounded-lg">
          <Skeleton height={20} width="50%" />
          <Skeleton height="90%" width="100%" className="mt-2" />
        </div>
        {/* Pie Chart */}
        <div className="flex-[30] p-4 bg-white rounded-lg">
          <Skeleton height={20} width="50%" />
          <div className="flex justify-center">
            <Skeleton circle width={120} height={120} />
          </div>
        </div>
      </div>

      {/* Logs and Summary Section Skeleton */}
      <div className="flex h-[300px] justify-between pt-2 w-full gap-1">
        {/* Logs List */}
        <div className="flex-[70] p-4 bg-white rounded-lg">
          <Skeleton height={20} width="40%" />
          <div className="mt-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} height={20} width="100%" />
            ))}
          </div>
        </div>
        {/* Summary Box */}
        <div className="flex-[29] p-4 bg-white rounded-lg">
          <Skeleton height={20} width="60%" className="mb-4" />
          <Skeleton height={100} width="100%" />
        </div>
      </div>
    </div>
  );
};

export default AccessMonitorSkeleton;
