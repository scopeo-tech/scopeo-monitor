import React from "react";
import { motion } from "framer-motion";


interface SkeletonBoxProps {
  width: string | number;
  height: string | number;
  className?: string;
}
const SkeletonBox: React.FC<SkeletonBoxProps> = ({ width, height,className  }) => (
  <div
  className={`bg-gray-200 animate-pulse rounded-lg ${className || ""}`}
    style={{ width, height }}
  ></div>
);


const ErrorMetricsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* Latest Error Skeleton */}
      <motion.div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 p-4">
        <SkeletonBox width="100%" height="50px" />
        <div className="p-4 space-y-4">
          <SkeletonBox width="100%" height="40px" />
          <SkeletonBox width="100%" height="80px" />
          <div className="flex space-x-4">
            <SkeletonBox width="50%" height="60px" />
            <SkeletonBox width="50%" height="60px" />
          </div>
        </div>
      </motion.div>

      {/* Common Errors Skeleton */}
      <motion.div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 p-4">
        <SkeletonBox width="100%" height="50px" />
        <div className="p-4 space-y-4">
          <SkeletonBox width="100%" height="40px" />
          <SkeletonBox width="100%" height="80px" />
          <div className="flex space-x-4">
            <SkeletonBox width="50%" height="60px" />
            <SkeletonBox width="50%" height="60px" />
          </div>
        </div>
      </motion.div>

      {/* Pie Chart Skeleton */}
      <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
        <SkeletonBox width="300px" height="300px" className="rounded-full" />
      </div>

      {/* Bar Chart Skeleton */}
      <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
        <SkeletonBox width="350px" height="250px" />
      </div>
    </div>
  );
};

export default ErrorMetricsSkeleton;
