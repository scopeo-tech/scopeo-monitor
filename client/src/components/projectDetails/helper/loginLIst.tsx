import React from 'react';

type LogEntry = {
  _id: string;
  ip: string;
  statusCode: number;
  isSuccess: boolean;
  userAgent: string;
  duration: number;
  isBruteForce: boolean;
  isUnusual: boolean;
  unusualReason: string | null;
  createdAt: string;
};

type LogsPageProps = {
  logs: LogEntry[];
};

function formatTimeAgo(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function LogsPage({ logs }: LogsPageProps) {
  return (
        <div className="w-full overflow-y-auto scrollbar-hide">
          {logs.map((log) => (
            <div key={log._id} className="p-4 hover:bg-gray-50 transition-colors border-b-2 border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    log.isSuccess ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span className="font-medium text-sm">
                    {log.isSuccess ? 'Success' : 'Failed'} ({log.statusCode})
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {formatTimeAgo(log.createdAt)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-500 w-20">IP:</span>
                  <span className="font-medium">{log.ip}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 w-20">Duration:</span>
                  <span>{log.duration}ms</span>
                </div>
              </div>
              
              <div className="mt-1 text-xs text-gray-600 truncate">
                <span className="text-gray-500">User Agent:</span> {log.userAgent}
              </div>
              
              {(log.isBruteForce || log.isUnusual) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {log.isBruteForce && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs font-medium">
                      Brute Force Attempt
                    </span>
                  )}
                  {log.isUnusual && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-medium">
                      Unusual Login: {log.unusualReason}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
  );
}