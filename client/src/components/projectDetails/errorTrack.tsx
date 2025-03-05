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
import { FiAlertTriangle, FiAlertOctagon } from "react-icons/fi";
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
  } = useQuery({
    queryKey: ["errorStats", projectID, filter],
    queryFn: () => errorStats(projectID, filter),
    enabled: !!projectID,
  });

  const { data: latestError } = useQuery({
    queryKey: ["latestErrors", projectID, filter],
    queryFn: () => latestErrors(projectID, filter),
    enabled: !!projectID,
  });

  const { data: commonErrors } = useQuery({
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

  if (isLoading) return <p>Loading error data...</p>;
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
              onChange={(e) => setFilter(e.target.value)}
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
        <div className="bg-white shadow-lg h-52 rounded-2xl p-6 border-l-4 border-red-500">
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
            </div>
          ) : (
            <p className="text-gray-500 text-center">No common errors</p>
          )}
        </div>

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
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
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

      <div className="p-6 w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Error Logs</h2>
        <div className="bg-white rounded-2xl shadow-lg">
          <div
            className="max-h-[600px] overflow-y-auto"
            onScroll={handleScroll}
          >
            <table className="w-full table-fixed border-collapse">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  <th className="p-3 text-left w-1/6">Status Code</th>
                  <th className="p-3 text-left w-2/6">Message</th>
                  <th className="p-3 text-left w-1/6">Method</th>
                  <th className="p-3 text-left w-1/6">Route</th>
                  <th className="p-3 text-left w-1/6">Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.pages.map((page, index) => (
                  <React.Fragment key={index}>
                    {page.errors?.length > 0 ? (
                      [...page.errors]
                        .reverse()
                        .map(
                          (error: {
                            _id: string;
                            statusCode: number;
                            message: string;
                            method: string;
                            route: string;
                            createdAt: string;
                          }) => (
                            <tr key={error._id} className="border-b">
                              <td className="p-3">{error.statusCode}</td>
                              <td className="p-3">{error.message}</td>
                              <td className="p-3">{error.method}</td>
                              <td className="p-3">{error.route}</td>
                              <td className="p-3">
                                {new Date(error.createdAt).toLocaleString()}
                              </td>
                            </tr>
                          )
                        )
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-3 text-center">
                          No errors found.
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {isFetchingNextPage && (
                  <tr>
                    <td colSpan={5} className="p-3 text-center">
                      Loading more...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorTrack;
