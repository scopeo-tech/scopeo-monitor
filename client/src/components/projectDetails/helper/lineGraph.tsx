import React, { useMemo } from 'react'
import { GoTriangleDown } from 'react-icons/go'
import {
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart
} from 'recharts'
import { format, parseISO, subDays, startOfDay, addHours } from 'date-fns'


interface LoginData {
  _id: string;
  project: string;
  statusCode: number;
  isSuccess: boolean;
  ip: string;
  userAgent: string;
  duration: number;
  isBruteForce: boolean;
  isUnusual: boolean;
  unusualReason?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


type ApiFunction = (projectId: string, timeRange: string) => Promise<{
  logins: LoginData[];
  summary: Record<string, number>;
}>;


interface LoginOption {
  label: string;
  value: string;
  api: ApiFunction;
}


interface ProcessedDataPoint {
  name: string;
  loginCount: number;
  avgDuration: number;
  errorCode200: number;
  errorCode400: number;
  errorCode401: number;
  errorCode403: number;
}

interface LineGraphProps {
  lineTimeRange: string;
  loginOptions: LoginOption[];
  handleLineTimeRangeChange: () => void;
  currentLogins: LoginData[];
  selectedLoginType: LoginOption;
  handleLoginTypeChange: (option: LoginOption) => void;
  dropDown: boolean;
  setDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

const processLoginData = (logins: LoginData[], timeRange: string): ProcessedDataPoint[] => {
  const endDate = new Date();
  const startDate = timeRange === 'today' ? subDays(endDate, 1)
    : timeRange === 'week' ? subDays(endDate, 7)
      : timeRange === 'month' ? subDays(endDate, 30)
        : subDays(endDate, 28);

  const intervals = timeRange === 'today' ? 24
    : timeRange === 'week' ? 7
      : timeRange === 'month' ? 30
        : 28;

  const processedData: ProcessedDataPoint[] = Array.from({ length: intervals }, (_, i) => {
    if (timeRange === 'today') {

      const hourLabels = [
        '12 am', '1 am', '2 am', '3 am', '4 am', '5 am', 
        '6 am', '7 am', '8 am', '9 am', '10 am', '11 am', 
        '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', 
        '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm'
      ];
      const intervalStart = addHours(startOfDay(startDate), i);
      const intervalEnd = addHours(startOfDay(startDate), i + 1);

      return {
        name: hourLabels[i],
        intervalStart: intervalStart,
        intervalEnd: intervalEnd,
        loginCount: 0,
        avgDuration: 0,
        errorCode200: 0,
        errorCode400: 0,
        errorCode401: 0,
        errorCode403: 0
      };
    } else {
      return {
        name: timeRange === 'today'
          ? `${i}h`
          : format(subDays(endDate, intervals - i - 1), 'MMM d'),
        loginCount: 0,
        avgDuration: 0,
        errorCode200: 0,
        errorCode400: 0,
        errorCode401: 0,
        errorCode403: 0
      };
    }
  });

  if (logins.length === 0) {
    return processedData;
  }

  logins.forEach(login => {
    const loginDate = parseISO(login.createdAt);

    if (loginDate >= startDate && loginDate <= endDate) {
      let index: number;
      if (timeRange === 'today') {

        index = loginDate.getHours();
      } else {
        index = Math.floor((loginDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
      }

      if (index >= 0 && index < processedData.length) {
        processedData[index].loginCount++;
        processedData[index].avgDuration += login.duration;

        if (login.statusCode === 200) processedData[index].errorCode200++;
        if (login.statusCode === 400) processedData[index].errorCode400++;
        if (login.statusCode === 401) processedData[index].errorCode401++;
        if (login.statusCode === 403) processedData[index].errorCode403++;
      }
    }
  });

  processedData.forEach(interval => {
    interval.avgDuration = interval.loginCount
      ? Number((interval.avgDuration / interval.loginCount).toFixed(2))
      : 0;
  });

  return processedData;
};

function LineGraph({
  lineTimeRange,
  loginOptions,
  handleLineTimeRangeChange,
  currentLogins,
  selectedLoginType,
  handleLoginTypeChange,
  dropDown,
  setDropdown
}: LineGraphProps) {
  const processedLoginData = useMemo(() =>
    processLoginData(currentLogins, lineTimeRange),
    [currentLogins, lineTimeRange]
  );

  return (
    <div className="flex-[70] h-full p-1 flex flex-col items-center justify-between bg-white rounded-lg">
      <div className='flex ps-10 pe-2 w-full items-center justify-between'>
        <div className='space-y-1'>
          <div className='w-full relative flex gap-2 justify-between'>
            <p className='font-semibold text-sm'>{selectedLoginType.label}</p>
            <button onClick={() => setDropdown((prev) => !prev)}>
              <GoTriangleDown />
            </button>
            {dropDown && (
              <div className="absolute bg-white border rounded shadow-md p-1 z-10 max-h-48 overflow-y-auto scrollbar-hide">
                {loginOptions?.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleLoginTypeChange(option)}
                    className="block w-full whitespace-nowrap text-left p-1 hover:bg-gray-100 text-sm"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleLineTimeRangeChange}
            className="text-xs text-gray-400 font-semibold"
          >
            {lineTimeRange === "today" ? "Today" : lineTimeRange === "all" ? "All" : `Last ${lineTimeRange}`}
          </button>
        </div>
        <div className='flex text-xs font-semibold text-gray-500'>
          <p>X-Time</p>
          <p className='ps-10'>Y-Metrics</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <ComposedChart data={processedLoginData}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#888", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#888", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "5px",
              border: "none"
            }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-4 shadow-lg rounded-lg">
                    <p className="font-bold">{payload[0].payload.name}</p>
                    <p>Logins: {payload[0].payload.loginCount}</p>
                    <p>Avg Duration: {payload[0].payload.avgDuration}ms</p>
                    <div className="mt-2">
                      <p>Status Codes:</p>
                      <p>200: {payload[0].payload.errorCode200}</p>
                      <p>400: {payload[0].payload.errorCode400}</p>
                      <p>401: {payload[0].payload.errorCode401}</p>
                      <p>403: {payload[0].payload.errorCode403}</p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <defs>
            <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16C47F" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#16C47F" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF6384" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#FF6384" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCode200" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2ECC40" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#2ECC40" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorError400" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF4136" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#FF4136" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorError401" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF851B" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#FF851B" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorError403" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0074D9" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0074D9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="loginCount"
            stroke="#16C47F"
            fill="url(#colorLogins)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="avgDuration"
            stroke="#FF6384"
            fill="url(#colorDuration)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="errorCode200"
            stroke="#2ECC40"
            fill="url(#colorCode200)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="errorCode400"
            stroke="#FF4136"
            fill="url(#colorError400)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="errorCode401"
            stroke="#FF851B"
            fill="url(#colorError401)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="errorCode403"
            stroke="#0074D9"
            fill="url(#colorError403)"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LineGraph