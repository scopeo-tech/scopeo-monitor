import React from "react";

export interface UnusualLoginSummaryProps {
  totalUnusualLogins: number;
  reasonsCount: Record<string, number>;
  frequentUserAgents: string[];
}


const UnusualLoginSummary: React.FC<UnusualLoginSummaryProps> = ({
  totalUnusualLogins,
  reasonsCount,
  frequentUserAgents,
}) => {
  return (
    <div className="w-full">
      <div className="space-y-5">
        <p className="text-gray-600  text-sm font-semibold">
          <span className="font-medium text-sm">Total Unusual Logins:</span> {totalUnusualLogins}
        </p>
        <div>
          <h3 className="font-medium text-gray-600 mb-5 text-sm">Reasons for Unusual Logins:</h3>
          <ul className="mt-1 text-gray-500 space-y-5 font-semibold">
            {Object.entries(reasonsCount ?? {}).map(([reason, count]) => (
              <li key={reason} className="text-sm">
                {reason}: {count} occurrences
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-y-auto scrollbar-hide">
          <h3 className="font-medium text-gray-700 text-sm mb-5">Frequent User Agents:</h3>
          <ul className="mt-1 text-gray-500 font-semibold">
            {frequentUserAgents?.map((agent, index) => (
              <li key={index} className="text-sm">{agent}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UnusualLoginSummary;
