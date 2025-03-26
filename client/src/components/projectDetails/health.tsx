"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, Tooltip,  ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { format, addHours, subHours } from 'date-fns';
import {
  getPerformanceData,
  getServerMetrics,
  getSystemMetrics,
  getTrafficMetrics,
  getStabilityMetrics,
  getProjectById,
} from "@/lib/api"; ;
import {
  PerformanceMetrics,
  ServerMetrics,
  SystemMetrics,
  TrafficMetrics,
  StabilityMetrics,
  Project,
} from "@/lib/interface";
import SkeletonMetrics from "../skeltons/systemMetricsSkeleton";
import withAuth from "@/lib/withAuth";
import { generateHealthMetricsPDF } from "@/lib/util/pdf"; 
import { BsFileEarmarkPdfFill } from "react-icons/bs";


const getHealthColor = (status : string) => {
  switch (status?.toLowerCase()) {
    case 'critical':
      return 'red-500';
    case 'warning':
      return 'yellow-500';
    case 'healthy':
    default:
      return 'green-500';
  }
};

function convertBytes(bytes : number) : string {
  if (typeof bytes !== "number" || bytes < 0) return "Invalid input";

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  let index = 0;

  while (bytes >= 1024 && index < units.length - 1) {
      bytes /= 1024;
      index++;
  }

  return `${bytes.toFixed(2)} ${units[index]}`;
}

const Health = () => {
  const { projectID } = useParams() as { projectID: string };
  const [serverFilter, setServerFilter] = useState("24h");

  const [systemFilter, setSystemFilter] = useState("24h");
  const [trafficFilter, setTrafficFilter] = useState("24h");
  const [stabilityFilter, setStabilityFilter] = useState("24h");

  const formatTimeDisplay = (date: Date) => {
    return format(date, "ha"); 
  };

  const generateTimeIntervals = () => {
    
    const now = new Date();
    
    
    const intervals = [];
    
    
    const startTime = subHours(now, 23);
    startTime.setMinutes(0, 0, 0);
    
    
    for (let i = 0; i < 24; i++) {
      const time = addHours(startTime, i);
      intervals.push(formatTimeDisplay(time));
    }
    
    return intervals;
  };

  
  const { data: performanceData, isLoading: perfLoading, error: perfError } = useQuery<PerformanceMetrics[]>({
    queryKey: ["performanceData", projectID ],
    queryFn: () => getPerformanceData(projectID, "24h"),
    refetchInterval: 6000,
  });

  const { data: serverMetrics, isLoading: serverLoading, error: serverError } = useQuery<ServerMetrics>({
    queryKey: ["serverMetrics", projectID, serverFilter],
    queryFn: () => getServerMetrics(projectID, serverFilter),
    refetchInterval: 6000,
  });

  const { data: systemMetrics, isLoading: systemLoading, error: systemError } = useQuery<SystemMetrics>({
    queryKey: ["systemMetrics", projectID, systemFilter],
    queryFn: () => getSystemMetrics(projectID, systemFilter),
    refetchInterval: 6000,
  });

  const { data: trafficMetrics, isLoading: trafficLoading, error: trafficError } = useQuery<TrafficMetrics>({
    queryKey: ["trafficMetrics", projectID, trafficFilter],
    queryFn: () => getTrafficMetrics(projectID, trafficFilter),
    refetchInterval: 6000,
  });

  const { data: stabilityMetrics, isLoading: stabilityLoading, error: stabilityError } = useQuery<StabilityMetrics>({
    queryKey: ["stabilityMetrics", projectID, stabilityFilter],
    queryFn: () => getStabilityMetrics(projectID, stabilityFilter),
    refetchInterval: 6000,
  });

  const { data: project } = useQuery<Project>({
      queryKey: ["project", projectID],
      queryFn: () => getProjectById(projectID),
    });

  if (perfLoading || serverLoading || systemLoading || trafficLoading || stabilityLoading) {
    return <SkeletonMetrics/>;
  }

  if (!projectID || typeof projectID !== "string") {
    return <div>Invalid project ID</div>;
  }

  if (perfError || serverError || systemError || trafficError || stabilityError) {
    return <div>Error loading data. Please try again.</div>;
  }

  const prepareChartData = (performanceData: PerformanceMetrics[]) => {
    if (!performanceData || performanceData.length === 0) return [];
    
    
    const timeIntervals = generateTimeIntervals();
    
    
    const hourlyDataMap = new Map();
    
    timeIntervals.forEach(hourLabel => {
      hourlyDataMap.set(hourLabel, {
        time: hourLabel,
        uptimePercentage: 0,
        latency: 0,
        responseTime: 0,
        requests: 0,
        averagePerSecond: 0,
        failedReq: 0,
        success: 0,
        errorrate: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        
        uptimePercentage_capped: 0,
        latency_capped: 0,
        responseTime_capped: 0,
        requests_capped: 0,
        averagePerSecond_capped: 0,
        failedReq_capped: 0,
        success_capped: 0,
        errorrate_capped: 0,
        cpuUsage_capped: 0,
        memoryUsage_capped: 0,
        diskUsage_capped: 0,
      });
    });

    performanceData.forEach(entry => {
      const entryDate = new Date(entry.createdAt);
      const hourKey = formatTimeDisplay(entryDate);
      
      
      if (hourlyDataMap.has(hourKey)) {
        hourlyDataMap.set(hourKey, {
          time: hourKey,
          
          uptimePercentage: entry.uptimePercentage,
          latency: entry.latency,
          responseTime: entry.responseTime,
          requests: entry.requests,
          averagePerSecond: entry.averagePerSecond,
          failedReq: entry.failedReq,
          success: entry.success,
          errorrate: entry.errorrate,
          cpuUsage: entry.cpuUsage ?? 0,
          memoryUsage: entry.memoryUsage ?? 0,
          diskUsage: entry.diskUsage ?? 0,
          
          uptimePercentage_capped: Math.min(entry.uptimePercentage, 200),
          latency_capped: Math.min(entry.latency, 200),
          responseTime_capped: Math.min(entry.responseTime, 200),
          requests_capped: Math.min(entry.requests, 200),
          averagePerSecond_capped: Math.min(entry.averagePerSecond, 200),
          failedReq_capped: Math.min(entry.failedReq, 200),
          success_capped: Math.min(entry.success, 200),
          errorrate_capped: Math.min(entry.errorrate, 200),
          cpuUsage_capped: Math.min(entry.cpuUsage ?? 0, 200),
          memoryUsage_capped: Math.min(entry.memoryUsage ?? 0, 200),
          diskUsage_capped: Math.min(entry.diskUsage ?? 0, 200),
        });
      }
    });
    
    
    return Array.from(hourlyDataMap.values());
  };

  const timeIntervals = generateTimeIntervals();

  const chartData = performanceData ? prepareChartData(performanceData) : [];

  const onFilterClick = (time:string):string => {
    return time==="24h" ? "1h" : "24h";
  };

  const showTime = (time:string) :string => {
    return time === "24h" ? "Last 24 Hours" : "Last 1 Hour";
  };

  const pieData = [
    { name: "Total Requests", value: (serverMetrics?.totalRequests ?? 0) >= 500 ? (serverMetrics?.totalRequests ?? 0) / 1000 : serverMetrics?.totalRequests ?? 0.1, color: "#22c55e" },
    { name: "Avg Response Time", value:  (serverMetrics?.avgResponseTime ?? 0) >= 500 ? (serverMetrics?.avgResponseTime ?? 0) / 1000 : serverMetrics?.avgResponseTime ?? 0.1, color: "#3b82f6" },
    { name: "Avg Latency", value: (serverMetrics?.avgLatency ?? 0) >= 500 ? (serverMetrics?.avgLatency ?? 0) / 1000 : serverMetrics?.avgLatency ?? 0.1, color: "#eab308" },
    { name: "Current Uptime", value: serverMetrics?.currentUptime || 0.1, color: "#a855f7" },
    { name: "Avg Uptime", value: serverMetrics?.avgUptimePercentage || 0.1, color: "#ef4444" },
  ];

  const handleDownloadPDF = () => {
    if (performanceData && serverMetrics && systemMetrics && trafficMetrics && stabilityMetrics) {
      generateHealthMetricsPDF(
        project?.name ?? "Project", 
        performanceData[0], 
        serverMetrics, 
        systemMetrics, 
        trafficMetrics, 
        stabilityMetrics
      );
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
  {/* First Row: Server Metrics */}
  <div className="bg-white p-4 col-span-1 rounded-lg shadow-sm">
    <div className="flex w-full items-center justify-between mb-4">
      <h3 className="text-sm font-semibold">System Metrics</h3>
      
      <div className="flex items-center">
        <div className="w-[5px] mt-1 me-1 h-[5px] rounded-full bg-gray-400"/>
        <button onClick={()=>setSystemFilter(onFilterClick(systemFilter))} className="font-semibold text-xs text-gray-500 hover:text-gray-600">{showTime(systemFilter)}</button>
      </div>
    </div>
    <div className="space-y-3 text-xs text-gray-500 hover:text-gray-600 font-semibold overflow-y-auto max-h-80   scrollbar-hide">
  {/* Overall Health */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-1">
      <span className={`w-2.5 h-2.5 rounded-full ${"bg-"+getHealthColor(systemMetrics?.overallHealth ?? 'unknown')}`}></span>
      <span>Overall Health</span>
    </div>
    <span className={`text-${getHealthColor(systemMetrics?.overallHealth ?? 'unknown')}`}>
  {systemMetrics?.overallHealth}
</span>
  </div>
  {/* CPU Usage */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-1">
      <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
      <span>Avg CPU Usage</span>
    </div>
    <span>{systemMetrics?.avgCpuUsage}%</span>
  </div>

  {/* Memory Usage */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-1">
      <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
      <span>Avg Memory Usage</span>
    </div>
    <span>{systemMetrics?.avgMemoryUsage}%</span>
  </div>

  {/* Disk Usage */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-1">
      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
      <span>Avg Disk Usage</span>
    </div>
    <span>{systemMetrics?.avgDiskUsage}%</span>
  </div>


  {/* Additional Metrics */}
  {[
    { label: "Max CPU Usage", value: systemMetrics?.maxCpuUsage, color: "red-500" },
    { label: "Max Disk Usage", value: systemMetrics?.maxDiskUsage, color: "yellow-500" },
    { label: "Max Memory Usage", value: systemMetrics?.maxMemoryUsage, color: "blue-500" },
    { label: "Latest CPU Usage", value: systemMetrics?.latestCpuUsage, color: "red-500" },
    { label: "Latest Disk Usage", value: systemMetrics?.latestDiskUsage, color: "yellow-500" },
    { label: "Latest Memory Usage", value: systemMetrics?.latestMemoryUsage, color: "blue-500" },
    { label: "CPU Health", value: systemMetrics?.healthStatus.cpu, color: getHealthColor(systemMetrics?.healthStatus.cpu ?? 'unknown') },
    { label: "Disk Health", value: systemMetrics?.healthStatus.disk, color: getHealthColor(systemMetrics?.healthStatus.disk ?? 'unknown') },
    { label: "Memory Health", value: systemMetrics?.healthStatus.memory, color: getHealthColor(systemMetrics?.healthStatus.memory ?? 'unknown') },
  ].map((item, index) => (
    <div key={index} className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <span className={`w-2.5 h-2.5 rounded-full ${"bg-"+item.color}`}></span>
        <span>{item.label}</span>
      </div>
      <span className={`${item.value=="critical"||item.value=="warning"?"text-"+item.color:null }`}>{item.value}</span>
    </div>
  ))}

  {/* Disk Details Mapping */}
  {systemMetrics?.diskDetails.map((disk, index) => (
    <div key={index} className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="font-bold">Drive</span>
        </div>
        <span className="font-bold">{disk.drive}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
          <span>Total Space</span>
        </div>
        <span>{convertBytes(disk.total)}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
          <span>Used Space</span>
        </div>
        <span>{convertBytes(disk.used)}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
          <span>Free Space</span>
        </div>
        <span>{convertBytes(disk.free)}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
          <span>Usage</span>
        </div>
        <span>{disk.usagePercent.toFixed(2)}%</span>
      </div>
    </div>
  ))}
</div>

  </div>

  {/* First Row: Performance Chart */}
  <div className="bg-white p-4 col-span-2 h-96 rounded-lg shadow-sm">
  <div className="flex ps-2 pe-2 w-full items-center justify-between mb-4">
    <div className="space-y-1 flex items-center">
      <p className="font-semibold text-sm">Performance Metrics (Last 24 Hours)</p>
      <button title="Download data as pdf" onClick={handleDownloadPDF} className="bg-blue py-1 px-2 text-gray-400 hover:text-gray-500"><BsFileEarmarkPdfFill className="text-sm" />  </button>
    </div>
    <div className="flex text-xs font-semibold text-gray-500 hover:text-gray-600">
      <p>X-Time</p>
      <p className="ps-10">Y-Metrics</p>
    </div>
  </div>
  <ResponsiveContainer width="100%" height="85%">
    <LineChart data={chartData}>
      <XAxis 
        dataKey="time" 
        tick={{ fill: "#888", fontSize: 10 }}
        axisLine={false}
        tickLine={false}
        ticks={timeIntervals}
      />
      <YAxis 
        tick={{ fill: "#888", fontSize: 10 }}
        axisLine={false}
        tickLine={false}
        domain={[0, 100]}
      />
      <Tooltip 
        contentStyle={{
          backgroundColor: "#fff",
          borderRadius: "5px",
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}
        formatter={(value, name, props) => {
          
          const originalName = typeof name === 'string' ? name.replace('_capped', '') : name;
          
          return [props.payload[originalName], originalName];
        }}
      />
      <Line type="monotone" dataKey="uptimePercentage_capped" stroke="#16C47F" strokeWidth={2} name="uptimePercentage_capped" dot={true} />
      <Line type="monotone" dataKey="latency_capped" stroke="#FF6384" strokeWidth={2} name="latency_capped" dot={true} />
      <Line type="monotone" dataKey="responseTime_capped" stroke="#36A2EB" strokeWidth={2} name="responseTime_capped" dot={true} />
      <Line type="monotone" dataKey="requests_capped" stroke="#FFCE56" strokeWidth={2} name="requests_capped" dot={true} />
      <Line type="monotone" dataKey="averagePerSecond_capped" stroke="#C47F16" strokeWidth={2} name="averagePerSecond_capped" dot={true} />
      <Line type="monotone" dataKey="failedReq_capped" stroke="#A1C416" strokeWidth={2} name="failedReq_capped" dot={true} />
      <Line type="monotone" dataKey="success_capped" stroke="#4BC0C0" strokeWidth={2} name="success_capped" dot={true} />
      <Line type="monotone" dataKey="errorrate_capped" stroke="#FF9F40" strokeWidth={2} name="errorrate_capped" dot={true} />
      <Line type="monotone" dataKey="cpuUsage_capped" stroke="#9966FF" strokeWidth={2} name="cpuUsage_capped" dot={true} />
      <Line type="monotone" dataKey="memoryUsage_capped" stroke="#FF6384" strokeWidth={2} name="memoryUsage_capped" dot={true} />
      <Line type="monotone" dataKey="diskUsage_capped" stroke="#36A2EB" strokeWidth={2} name="diskUsage_capped" dot={true} />
    </LineChart>
  </ResponsiveContainer>
</div>

  {/* Second Row: System Metrics */}
  <div className="bg-white p-4 col-span-1 rounded-lg shadow-sm">
      <div className="flex w-full justify-between">
        <h3 className="text-sm font-semibold mb-4">Server Metrics</h3>
        <button onClick={()=>setServerFilter(onFilterClick(serverFilter))} className="font-semibold text-xs text-gray-500 hover:text-gray-600">{showTime(serverFilter)}</button>
      </div>
      <div className="flex items-center space-x-4 z-0">
        {/* Labels on the left */}
        <div className="space-y-2 text-xs text-gray-500 hover:text-gray-600 font-semibold">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
        
        {/* Pie Chart */}
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={70}
              fill="#8884d8"
              strokeWidth={2}
              stroke="#fff"
              cornerRadius={5} 
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

  {/* Second Row: Traffic Metrics */}
  <div className="bg-white p-4 col-span-1 rounded-lg shadow-sm">
    <div className="flex w-full items-center justify-between mb-4">
      <h3 className="text-sm font-semibold">Traffic Metrics</h3>
      <div className="flex items-center">
        <div className="w-[5px] mt-1 me-1 h-[5px] rounded-full bg-gray-400"/>
        <button onClick={()=>setTrafficFilter(onFilterClick(trafficFilter))} className="font-semibold text-xs text-gray-500 hover:text-gray-600">{showTime(trafficFilter)}
        </button>
      </div>
    </div>
    <div className="space-y-3 text-xs text-gray-500 hover:text-gray-600 font-semibold">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          <span>Total Requests</span>
        </div>
        <span>{trafficMetrics?.metrics.totalRequests}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>Success Rate</span>
        </div>
        <span>{trafficMetrics?.metrics.successRate}%</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span>Error Rate</span>
        </div>
        <span>{trafficMetrics?.metrics.errorRate}%</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          <span>Traffic Health</span>
        </div>
        <span>{trafficMetrics?.metrics.trafficHealth}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>Avg request per minute</span>
        </div>
        <span>{trafficMetrics?.metrics.requestsPerMinute}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          <span>Peak request per second marked</span>
        </div>
        <span>{trafficMetrics?.metrics.requestsPerSecond?.peak}</span>
      </div>
      <p className="font-bold">Insights</p>
      {trafficMetrics?.insights.map((insight, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span>{insight}</span>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Second Row: Stability Metrics */}
  <div className="bg-white p-4 col-span-1 rounded-lg shadow-sm">
    <div className="flex w-full items-center justify-between mb-4">
      <h3 className="text-sm font-semibold">Stability Metrics</h3>
      <div className="flex items-center">
        <div className="w-[5px] mt-1 me-1 h-[5px] rounded-full bg-gray-400"/>
        <button onClick={()=>setStabilityFilter(onFilterClick(stabilityFilter))} className="font-semibold text-xs text-gray-500 hover:text-gray-600">{showTime(stabilityFilter)}</button>
      </div>
    </div>
    <div className="space-y-3 text-xs text-gray-500 hover:text-gray-600 font-semibold">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span>Failed Requests</span>
        </div>
        <span>{stabilityMetrics?.failedRequests}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          <span>Success Requests</span>
        </div>
        <span>{stabilityMetrics?.successRequests}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
          <span>Error Rate</span>
        </div>
        <span>{stabilityMetrics?.errorRate.toFixed(2)}%</span>
      </div>
    </div>
  </div>
</div>
  );
};

export default withAuth(Health);
