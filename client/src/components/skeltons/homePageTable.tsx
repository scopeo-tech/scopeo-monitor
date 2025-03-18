const TableSkeleton = () => {
    return (
      <div className="w-full">
        {/* Table Header Skeleton */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-sm">
              {["Project Name", "Status", "API Key", "Pass Key"].map((header, index) => (
                <th key={index} className="text-left py-4 px-4 font-medium text-gray-400">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
  
          <tbody>
            {/* Skeleton Rows */}
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="border-b text-sm animate-pulse">
                <td className="py-4 px-4">
                  <div className="h-4 w-32 bg-gray-300 rounded"></div>
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-6 bg-gray-300 rounded-full"></div>
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-40 bg-gray-300 rounded"></div>
                </td>
                <td className="py-4 px-4 flex items-center space-x-2">
                  <div className="h-4 w-20 bg-gray-300 rounded"></div>
                  <div className="h-4 w-4 bg-gray-300 rounded"></div>
                  <div className="h-4 w-4 bg-gray-300 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default TableSkeleton;
  