/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  errorStats,
  errorMethods as fetchErrorMethods,
  commonErros,
  latestErrors,
  getAllErrors,
} from "@/lib/api";
import { CiFilter } from "react-icons/ci";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FiAlertTriangle, FiAlertOctagon, FiCode } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React from "react";
import ErrorLogCard from "../ui/ErrorLogs";
import { ErrorLog } from "@/lib/interface";
import ErrorDashboardSkeleton from "../skeltons/errorTrackingSkeleton";

const COLORS = ["#90BAAD", "#689689", "#B0CA87", "#ADF6B1"];

function ErrorTrack() {
  const { projectID } = useParams() as { projectID: string };

  const [showPopup, setShowPopup] = useState(false);
  const [filter, setFilter] = useState("all");

  const {
    data: totalErrors = {
      authCount: 0,
      notFoundCount: 0,
      internalServerErrorCount: 0,
      badRequestCount: 0,
      totalErrors: 0,
    },
    isLoading,
    refetch: errorStatsRefetch,
  } = useQuery({
    queryKey: ["errorStats", projectID, filter],
    queryFn: () => errorStats(projectID, filter),
    enabled: !!projectID,
  });

  const { data: latestError, refetch: latestErrorRefetch } = useQuery({
    queryKey: ["latestErrors", projectID, filter],
    queryFn: () => latestErrors(projectID, filter),
    enabled: !!projectID,
  });

  const { data: commonErrors, refetch: commonErrorsRefetch } = useQuery({
    queryKey: ["commonErrors", projectID, filter],
    queryFn: () => commonErros(projectID, filter),
    enabled: !!projectID,
  });

  const {
    data: errorMethods = [
      { method: "GET", percentage: "0.00%" },
      { method: "POST", percentage: "0.00%" },
      { method: "PUT", percentage: "0.00%" },
      { method: "DELETE", percentage: "0.00%" },
    ],
    refetch: errorMethodsRefetch,
  } = useQuery({
    queryKey: ["errorMethods", projectID, filter],
    queryFn: () => fetchErrorMethods(projectID, filter),
    enabled: !!projectID,
  });

  const pieData = [
    {
      name: "Authentication",
      value: totalErrors?.authCount || 0.01,
    },
    { name: "Not Found", value: totalErrors?.notFoundCount || 0.01 },
    {
      name: "Internal Server",
      value: totalErrors?.internalServerErrorCount || 0.01,
    },
    { name: "Bad Request", value: totalErrors?.badRequestCount || 0.01 },
  ];

  const barData = errorMethods.map(
    (method: { method: string; percentage: string }) => ({
      method: method.method,
      percentage: parseFloat(method.percentage.replace("%", "")),
    })
  );

  const isAllZero =
    (totalErrors?.authCount || 0) === 0 &&
    (totalErrors?.notFoundCount || 0) === 0 &&
    (totalErrors?.internalServerErrorCount || 0) === 0 &&
    (totalErrors?.badRequestCount || 0) === 0;

  useEffect(() => {
    if (!isLoading && isAllZero && !showPopup) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  }, [isAllZero, filter, isLoading]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["errors", projectID],
      queryFn: ({ pageParam = 1 }: { pageParam?: number }) => {
        return getAllErrors(projectID, pageParam, 20);
      },
      getNextPageParam: (lastPage: {
        currentPage: number;
        hasNextPage: boolean;
        errors: [];
      }) => {
        return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
      },
      initialPageParam: 1,
      enabled: !!projectID,
    });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 10 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  const handleFilterChange = async (newFilter: string) => {
    setFilter(newFilter);

    await Promise.all([
      errorStatsRefetch(),
      latestErrorRefetch(),
      commonErrorsRefetch(),
      errorMethodsRefetch(),
    ]);
  };

  if (isLoading) return <ErrorDashboardSkeleton/>;
  if (!projectID) return <p>No project selected.</p>;

  return (
    <div>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Error Tracking Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <CiFilter size={25} className="text-gray-600 ms-3" />
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="1h">Last 1 Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 ">
        <div className="bg-white shadow-lg  rounded-2xl p-6 border-l-4 border-red-500">
          <div className="flex items-center mb-4">
            <FiAlertTriangle className="text-red-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">
              Latest Error
            </h2>
          </div>
          {latestError ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Status Code</span>
                <span className="font-bold text-red-600">
                  {latestError.statusCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Route</span>
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {latestError.route}
                </code>
              </div>
              <div className="flex justify-between">
                <span>Method</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {latestError.method}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Message</span>
                <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                  {latestError.message}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No recent errors</p>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border-l-4 border-orange-500">
          <div className="flex items-center mb-4">
            <FiAlertOctagon className="text-orange-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">
              Most Common Error
            </h2>
          </div>
          {commonErrors ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Status Code</span>
                <span className="font-bold text-orange-600">
                  {commonErrors.statusCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Route</span>
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {commonErrors.route}
                </code>
              </div>
              <div className="flex justify-between">
                <span>Method</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {commonErrors.method}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Message</span>
                <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                  {commonErrors.message}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No common errors</p>
          )}
        </div>
        {/* ${(percent * 100).toFixed(0)}% if get time */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
          <div className="w-full max-w-sm text-xs">
            <PieChart width={400} height={400}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name }) => `${name}`}
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-center  items-center">
          <div className="w-full max-w-sm">
            <BarChart width={400} height={300} data={barData}>
              <XAxis dataKey="method" stroke="#6B7280" className="text-sm" />
              <YAxis
                stroke="#6B7280"
                label={{
                  value: "Percentage",
                  angle: -90,
                  position: "insideLeft",
                  className: "text-sm",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#F3F4F6",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="percentage"
                fill="#3B82F6"
                barSize={40}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPopup && isAllZero && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-1/2 right-8 transform -translate-y-1/2 z-50 max-w-sm w-full"
          >
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg shadow-lg flex items-center space-x-4">
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-yellow-800 mb-2">
                  No Errors Found
                </h3>
                <p className="text-yellow-700 text-sm">
                  This project hasn&apos;t logged any errors yet. A minimal
                  chart is shown for visualization.
                </p>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="text-yellow-600 hover:text-yellow-800 transition-colors focus:outline-none"
              >
                <IoIosCloseCircleOutline size={28} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <FiAlertTriangle className="text-red-500" size={30} />
            <h2 className="text-3xl font-bold text-gray-800">Error Logs</h2>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <FiCode className="text-gray-400" />
            <span>
              {data?.pages.reduce(
                (total, page) => total + page.errors.length,
                0
              )}{" "}
              Total Errors
            </span>
          </div>
        </div>

        <div
          className="overflow-y-auto max-h-[70vh] p-4"
          onScroll={handleScroll}
        >
          {data?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.errors.map((error: ErrorLog, index) => (
                <ErrorLogCard key={error._id} error={error} index={index} />
              ))}
            </React.Fragment>
          ))}
          {isFetchingNextPage && <p>Loading more errors...</p>}
        </div>

        {hasNextPage && (
          <div className="text-center mt-6">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition flex items-center mx-auto"
            >
              {isFetchingNextPage ? (
                <>
                  <span className="animate-spin mr-2">↻</span>
                  Loading...
                </>
              ) : (
                "Load More Errors"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ErrorTrack;
