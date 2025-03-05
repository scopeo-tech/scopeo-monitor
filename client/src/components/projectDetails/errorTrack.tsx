/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  errorStats,
  errorMethods as fetchErrorMethods,
  commonErros,
  latestErrors,
  getAllErrors,
} from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io"
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
      name: "Authentication Errors",
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
      <div className="p-4 w-full flex justify-end">
        <label htmlFor="filter" className="block text-lg font-bold mb-2">
          Filter Errors By:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded-lg shadow-sm"
        >
          <option value="all">All Time</option>
          <option value="1h">Last 1 Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 ">
        <div
          className="p-6 rounded-2xl shadow-lg border border-red-400 bg-red-100/10 backdrop-blur-lg 
      hover:shadow-red-500/50 transition-all duration-300"
        >
          <h2 className="text-2xl font-bold mb-4 text-red-500 drop-shadow-lg">
            Latest Error
          </h2>
          {latestError ? (
            <div className="space-y-3">
              <p className="text-lg">
                <b className="text-red-400">Status Code:</b>{" "}
                {latestError.statusCode}
              </p>
              <p className="text-lg">
                <b className="text-red-400">Route:</b> {latestError.route}
              </p>
              <p className="text-lg">
                <b className="text-red-400">Method:</b> {latestError.method}
              </p>
              <p className="text-lg">
                <b className="text-red-400">Message:</b> {latestError.message}
              </p>
            </div>
          ) : (
            <p className="text-gray-300">No recent errors found.</p>
          )}
        </div>

        <div className="p-6 rounded-2xl shadow-lg bg-white border border-red-500 shadow-red-500/40 hover:shadow-red-600/60 transition-shadow">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            Most Common Error
          </h2>
          {commonErrors ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <p className=" font-medium">
                  <span className="text-red-700 font-bold">Status Code:</span>{" "}
                  {commonErrors.statusCode}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <p className=" font-medium">
                  <span className="text-red-700 font-bold">Route:</span> {commonErrors.route}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <p className=" font-medium">
                  <span className="text-red-700 font-bold">Method:</span>{" "}
                  {commonErrors.method}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <p className=" font-medium">
                  <span className="text-red-700 font-bold">Message:</span>{" "}
                  {commonErrors.message}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No common errors found.</p>
          )}
        </div>

        <div className="p-4 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-center mb-4">
            Total Error Counts
          </h2>
          <div className="flex justify-center">
            <PieChart width={400} height={400}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
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

        <div>
          <div className="p-6 rounded-2xl shadow-lg bg-white border border-[#ff0d0d54] shadow-red-500/40 hover:shadow-red-600/60 transition-shadow">
            <div className="p-4 rounded-2xl">
              <h2 className="text-xl font-bold mb-2">Error Methods</h2>
              <BarChart width={400} height={300} data={barData}>
                <XAxis dataKey="method" stroke="#FF4D4D" />
                <YAxis stroke="#FF4D4D" />
                <Tooltip />
                <Legend />
                <Bar dataKey="percentage" fill="#9c100e" barSize={40} />
              </BarChart>
            </div>
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
          className="p-4 rounded-2xl shadow-lg bg-yellow-100 border-l-4 border-yellow-500 fixed top-96 right-8 z-50 flex items-center"
        >
          <div className="flex-grow">
            <h3 className="text-yellow-800 font-bold">No Errors Found</h3>
            <p className="text-yellow-700">
              This project hasn&apos;t logged any errors yet. A minimal chart is
              shown for visualization.
            </p>
          </div>
          <button 
            onClick={() => setShowPopup(false)} 
            className="ml-4 text-yellow-800 hover:text-yellow-600 focus:outline-none"
          >
            <IoIosCloseCircleOutline size={24} />
          </button>
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
