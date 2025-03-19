import React from "react";
import { FiAlertTriangle, FiAlertOctagon } from "react-icons/fi";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";

const ErrorDashboardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* Latest Error Skeleton */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border-l-4 border-red-500 animate-pulse">
        <div className="flex items-center mb-4">
          <FiAlertTriangle className="text-red-500 mr-3" />
          <h2 className="text-xl font-semibold text-gray-800">Latest Error</h2>
        </div>
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 rounded"></div>
          <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
          <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Most Common Error Skeleton */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border-l-4 border-orange-500 animate-pulse">
        <div className="flex items-center mb-4">
          <FiAlertOctagon className="text-orange-500 mr-3" />
          <h2 className="text-xl font-semibold text-gray-800">Most Common Error</h2>
        </div>
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 rounded"></div>
          <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
          <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Pie Chart Skeleton */}
      <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center animate-pulse">
        <div className="w-40 h-40 bg-gray-200 rounded-full"></div>
      </div>

      {/* Bar Chart Skeleton */}
      <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center animate-pulse">
        <div className="w-full max-w-sm h-40 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default ErrorDashboardSkeleton;
