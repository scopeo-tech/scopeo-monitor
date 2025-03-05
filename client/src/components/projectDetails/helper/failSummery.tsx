import React from "react";

export interface BruteForceSummaryProps {
    totalAttempts: number;
    mostAttackedIP: string;
    groupedByIP: Record<string, number>;
    frequentUserAgents: string[];
}

const BruteForceSummary: React.FC<BruteForceSummaryProps> = ({
  totalAttempts,
  mostAttackedIP,
  groupedByIP,
  frequentUserAgents,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Brute Force Summary</h2>
      <div className="space-y-5">
        <p className="text-gray-600 text-sm font-semibold">
          <span className="font-medium text-sm">Total Attempts:</span> {totalAttempts}
        </p>
        <p className="text-gray-600 text-sm font-semibold">
          <span className="font-medium text-sm">Most Attacked IP:</span> {mostAttackedIP}
        </p>
        <div>
          <h3 className="font-medium text-gray-600 mb-5 text-sm">Attack Attempts by IP:</h3>
          <div className="h-14 overflow-y-auto scrollbar-hide">
            <ul className="mt-1 text-gray-500 space-y-5 font-semibold">
              {Object.entries(groupedByIP ?? {}).map(([ip, count]) => (
                <li key={ip} className="text-sm">
                  {ip}: {count} attempts
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-700 text-sm mb-5">Frequent User Agents:</h3>
          <div className="h-14 overflow-y-auto scrollbar-hide">
            <ul className="mt-1 text-gray-500 font-semibold space-y-5">
              {frequentUserAgents?.map((agent, index) => (
                <li key={index} className="text-sm">{agent}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BruteForceSummary;