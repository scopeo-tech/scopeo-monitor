const SidebarSkeleton = () => {
    return (
      <div className="w-64 bg-emerald-400 text-white h-screen p-6 fixed left-0 top-14">
        {/* Create New Project Button */}
        <span className="flex items-center justify-center pt-7">
          <div className="w-32 h-5 bg-gray-300 animate-pulse rounded"></div>
        </span>
  
        {/* User Profile Skeleton */}
        <div className="mt-6 rounded-lg p-3">
          <div className="flex items-center w-48 gap-3 border-2 border-gray-400 rounded-3xl bg-gray-300 p-1 shadow-sm">
            {/* Profile Picture */}
            <div className="w-8 h-8 bg-gray-400 animate-pulse rounded-full"></div>
            {/* User Info */}
            <div>
              <div className="w-24 h-4 bg-gray-400 animate-pulse rounded"></div>
              <div className="w-32 h-3 bg-gray-300 animate-pulse rounded mt-1"></div>
            </div>
          </div>
          {/* User Stats */}
          <div className="mt-4 space-y-1 text-sm text-center">
            <div className="flex gap-2">
              <span className="w-16 h-3 bg-gray-400 animate-pulse rounded"></span>
              <span className="w-12 h-3 bg-gray-300 animate-pulse rounded"></span>
            </div>
            <div className="flex gap-2">
              <span className="w-16 h-3 bg-gray-400 animate-pulse rounded"></span>
              <span className="w-8 h-3 bg-gray-300 animate-pulse rounded"></span>
            </div>
          </div>
        </div>
  
        {/* Sidebar Links Skeleton */}
        <div className="mt-64 space-y-4 p-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gray-300 animate-pulse rounded"></div>
            <div className="w-20 h-4 bg-gray-300 animate-pulse rounded"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gray-300 animate-pulse rounded"></div>
            <div className="w-20 h-4 bg-gray-300 animate-pulse rounded"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gray-300 animate-pulse rounded"></div>
            <div className="w-20 h-4 bg-gray-300 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  };
  
  export default SidebarSkeleton;
  