"use client"
import React, { useState, useEffect } from 'react'
import Cards from './helper/cards';
import Piechart from './helper/piechart';
import LineGraph from './helper/lineGraph';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { unususalLogin, allLogins, bruteForceLogin, failedLogins, securityStats } from '@/lib/api'
import LogsPage from './helper/loginLIst';
import UnusualLoginSummary, { UnusualLoginSummaryProps } from './helper/unusualSummery';
import LoginSummary, { LoginSummaryProps } from './helper/logSummery';
import BruteForceSummary, { BruteForceSummaryProps } from './helper/failSummery';
import AccessMonitorSkeleton from '../skeltons/accessMonitoringSkeleton';

const loginOptions = [
  { label: "All Logins", value: "allLogins", api: allLogins },
  { label: "Failed Logins", value: "failedLogins", api: failedLogins },
  { label: "Unusual Logins", value: "unusualLogin", api: unususalLogin },
  { label: "Brute Force", value: "bruteForceLogin", api: bruteForceLogin },
];
export const timeOptions = ["today", "week", "month", "all"];
const AccessMonitor = () => {
  const { projectID } = useParams() as { projectID: string };
  const [lineTimeRange, setLineTimeRange] = useState("today");
  const [pieTimeRange, setPieTimeRange] = useState("today");
  const [dropDown, setDropdown] = useState<boolean>(false);
  const [selectedLoginType, setSelectedLoginType] = useState(loginOptions[0]);
  const [currentLogins, setCurrentLogins] = useState([]);
  const [currentBruteSummary, setCurrentBruteSummary] = useState<BruteForceSummaryProps | null>(null);
  const [currentLoginSummary, setCurrentLoginSummary] = useState<LoginSummaryProps | null>(null);
  const [currentUnusualSummary, setCurrentUnusualSummary] = useState<UnusualLoginSummaryProps | null>(null);
  const getComponent = () => {
    switch (selectedLoginType.value) {
      case "allLogins":
        return <LoginSummary {...currentLoginSummary!} />;
      case "unusualLogin":
        return <UnusualLoginSummary {...currentUnusualSummary!} />;
      default:
        return <BruteForceSummary {...currentBruteSummary!} />;
    }
  }
  
  const { data: stats = {
    totalLogins: 0,
    successLogins: 0,
    failedLogins: 0,
    totalUnusual: 0,
    unusualHighFreq: 0,
    unusualConsecSuccess: 0,
    bruteForce: 0,
  }, isLoading: isStatsLoading } = useQuery({
    queryKey: ["securityStats", projectID, pieTimeRange],
    queryFn: () => securityStats(projectID, pieTimeRange),
    enabled: !!projectID,
    refetchInterval: 6000, 
  });

  const { data: loginData, isLoading: isLoginDataLoading } = useQuery({
    queryKey: ["loginData", projectID, lineTimeRange, selectedLoginType.value],
    queryFn: () => selectedLoginType.api(projectID, lineTimeRange),
    refetchInterval: 6000,
    enabled: !!projectID
  });
  useEffect(() => {
    if (loginData) {
      setCurrentLogins(loginData.logins || []);
      if (selectedLoginType.value === "bruteForceLogin" || selectedLoginType.value === "failedLogins") {
        setCurrentBruteSummary(loginData.summary);
        setCurrentLoginSummary(null)
        setCurrentUnusualSummary(null)
      }
      else if (selectedLoginType.value === "unusualLogin") {
        setCurrentUnusualSummary(loginData.summary);
        setCurrentBruteSummary(null)
        setCurrentLoginSummary(null)
      }
      else {
        setCurrentLoginSummary(loginData.summary);
        setCurrentBruteSummary(null)
        setCurrentUnusualSummary(null)
      }
    }
  }, [loginData, selectedLoginType.value]);
  const handleLineTimeRangeChange = () => {
    const currentIndex = timeOptions.indexOf(lineTimeRange);
    const nextIndex = (currentIndex + 1) % timeOptions.length;
    setLineTimeRange(timeOptions[nextIndex]);
  };
  const handleLoginTypeChange = (option: typeof loginOptions[0]) => {
    setSelectedLoginType(option);
    setDropdown(false);
  };

  if (isStatsLoading || isLoginDataLoading) return <AccessMonitorSkeleton />;

  return (
    <div className='pb-2 m-0 text-gray-600'>
      <Cards stats={stats} isLoading={isStatsLoading as boolean} />
      <div className="flex h-96 justify-between pt-2 w-full gap-1">
        <LineGraph currentLogins={currentLogins} lineTimeRange={lineTimeRange as string} handleLineTimeRangeChange={handleLineTimeRangeChange} loginOptions={loginOptions} selectedLoginType={selectedLoginType} handleLoginTypeChange={handleLoginTypeChange} dropDown={dropDown} setDropdown={setDropdown} />
        < Piechart stats={stats} pieTimeRange={pieTimeRange} setPieTimeRange={setPieTimeRange} isStatsLoading={isStatsLoading} />
      </div>
      {/* third section */}
      <div className='flex h-[300px] justify-between pt-2 w-full gap-1'>
        <div className="flex-[70] h-full p-1 flex flex-col items-center justify-between bg-white rounded-lg">
          <LogsPage logs={currentLogins} />
        </div>
        <div className="flex-[29] flex flex-col p-2 justify-between h-full bg-white rounded-lg">
          {isLoginDataLoading && <p className="text-center">Loading...</p>}
          {getComponent()}
        </div>
      </div>
    </div>
  )
}

export default AccessMonitor