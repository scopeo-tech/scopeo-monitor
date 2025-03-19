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
import {
  FiAlertTriangle,
  FiAlertOctagon,
  FiCode,
  FiMessageSquare,
  FiActivity,
  FiX,
  FiBarChart2,
} from "react-icons/fi";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showLatestError, setShowLatestError] = useState(true);
  const [showCommonError, setShowCommonError] = useState(true);
  const [isCommonExpanded, setIsCommonExpanded] = useState(false);

  const getErrorGradient = (statusCode: number) => {
    const gradients = [
      "from-red-500 to-orange-500",
      "from-purple-500 to-pink-500",
      "from-blue-500 to-indigo-500",
    ];
    return gradients[statusCode % gradients.length] || gradients[0];
  };

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
    refetchInterval: 6000,
    enabled: !!projectID,
  });

  const { data: latestError, refetch: latestErrorRefetch } = useQuery({
    queryKey: ["latestErrors", projectID, filter],
    queryFn: () => latestErrors(projectID, filter),
    refetchInterval: 6000,
    enabled: !!projectID,
  });

  const { data: commonErrors, refetch: commonErrorsRefetch } = useQuery({
    queryKey: ["commonErrors", projectID, filter],
    queryFn: () => commonErros(projectID, filter),
    refetchInterval: 6000,
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
    refetchInterval: 6000,
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
  const handleDismissLatestError = () => {
    setShowLatestError(false);
    setTimeout(() => {
      latestErrorRefetch();
      setShowLatestError(true);
    }, 500);
  };

  const handleViewLogs = () => {
    if (latestError) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleViewErrorDetails = () => {
    setIsCommonExpanded(!isCommonExpanded);
  };

  const handleIgnoreCommonError = () => {
    setShowCommonError(false);
    setTimeout(() => {
      commonErrorsRefetch();
      setShowCommonError(true);
    }, 500);
  };
  if (isLoading) return <p>Loading error data...</p>;

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
        <AnimatePresence>
          {showLatestError && (
            <motion.div
              key={"latestError"}
              className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className={`bg-gradient-to-r ${
                  latestError
                    ? getErrorGradient(latestError.statusCode)
                    : "from-gray-400 to-gray-500"
                } p-4 relative overflow-hidden`}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="bg-white bg-opacity-20 p-2 rounded-lg"
                      animate={{ rotate: [0, 10, 0, -10, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 5,
                        ease: "easeInOut",
                      }}
                    >
                      <FiAlertTriangle className="text-white text-xl" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-white">
                      Latest Error
                    </h2>
                  </div>

                  {latestError && (
                    <motion.div
                      className="font-mono font-bold text-white text-lg bg-black bg-opacity-20 px-3 py-1 rounded-full"
                      whileHover={{ scale: 1.05 }}
                    >
                      {latestError.statusCode}
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <div className="p-4">
                {latestError ? (
                  <div className="space-y-4">
                    <AnimatePresence>
                      <motion.div
                        key={"latestError route"}
                        className="group flex items-center space-x-3 bg-gray-50 p-3 rounded-xl cursor-pointer"
                        whileHover={{
                          y: -2,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                        onClick={() => setIsExpanded(!isExpanded)}
                      >
                        <FiCode className="text-blue-500 text-lg" />
                        <div className="flex-1">
                          <div className="text-sm text-gray-500">Route</div>
                          <div className="font-mono text-sm">
                            {latestError.route}
                          </div>
                        </div>
                        <div
                          className={`bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm transition-all ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        >
                          {latestError.method}
                        </div>
                      </motion.div>

                      {isExpanded && (
                        <motion.div
                          className="space-y-4 pt-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div
                            className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div className="flex items-start">
                              <FiMessageSquare className="text-yellow-500 mt-1 mr-3" />
                              <div>
                                <div className="text-sm text-gray-500 mb-1">
                                  Error Message
                                </div>
                                <div className="text-yellow-800 font-medium">
                                  {latestError.message}
                                </div>
                              </div>
                            </div>
                          </motion.div>

                          <motion.div
                            className="flex space-x-3"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="flex-1 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                              <div className="text-xs text-gray-500 mb-1">
                                Timestamp
                              </div>
                              <div className="text-sm text-gray-800">
                                {new Date(
                                  latestError.createdAt
                                ).toLocaleString()}
                              </div>
                            </div>
                            <div className="flex-1 p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                              <div className="text-xs text-gray-500 mb-1">
                                Error ID
                              </div>
                              <div className="text-sm text-gray-800 font-mono">
                                {latestError.id}
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      className="mt-4 flex justify-between"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.button
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
                        whileHover={{ scale: 1.05 }}
                        onClick={handleViewLogs}
                      >
                        <FiActivity size={14} />
                        <span>View logs</span>
                      </motion.button>

                      <motion.button
                        className="text-sm text-red-500 hover:text-red-700 flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-red-50 transition-all"
                        whileHover={{ scale: 1.05 }}
                        onClick={handleDismissLatestError}
                      >
                        <FiX size={14} />
                        <span>Dismiss</span>
                      </motion.button>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    className="flex flex-col items-center justify-center py-8 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                      animate={{
                        scale: [1, 1.05, 1],
                        backgroundColor: [
                          "rgb(220, 252, 231)",
                          "rgb(226, 246, 231)",
                          "rgb(220, 252, 231)",
                        ],
                      }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    >
                      <svg
                        xmlns="http:www.w3.org/2000/svg"
                        className="h-8 w-8 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                    <p className="text-gray-600 font-medium text-center">
                      All systems operational
                    </p>
                    <p className="text-gray-400 text-sm text-center mt-2">
                      No errors detected in the system
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Common Errors */}
        <AnimatePresence>
          {showCommonError && (
            <motion.div
              key={"commonError"}
              className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className={`bg-gradient-to-r ${
                  commonErrors
                    ? getErrorGradient(commonErrors.statusCode)
                    : "from-orange-400 to-amber-500"
                } p-4 relative overflow-hidden`}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="bg-white bg-opacity-20 p-2 rounded-lg"
                      animate={{ rotate: [0, 10, 0, -10, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 5,
                        ease: "easeInOut",
                      }}
                    >
                      <FiAlertOctagon className="text-white text-xl" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-white">
                      Most Common Error
                    </h2>
                  </div>

                  {commonErrors && (
                    <motion.div
                      className="font-mono font-bold text-white text-lg bg-black bg-opacity-20 px-3 py-1 rounded-full"
                      whileHover={{ scale: 1.05 }}
                    >
                      {commonErrors.statusCode}
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <div className="p-4">
                {commonErrors ? (
                  <div className="space-y-4">
                    <AnimatePresence>
                      <motion.div
                        key={"commonErrors route"}
                        className="group flex items-center space-x-3 bg-gray-50 p-3 rounded-xl cursor-pointer"
                        whileHover={{
                          y: -2,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                        onClick={() => setIsCommonExpanded(!isCommonExpanded)}
                      >
                        <FiCode className="text-orange-500 text-lg" />
                        <div className="flex-1">
                          <div className="text-sm text-gray-500">Route</div>
                          <div className="font-mono text-sm">
                            {commonErrors.route}
                          </div>
                        </div>
                        <div
                          className={`bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm transition-all ${
                            isCommonExpanded ? "rotate-90" : ""
                          }`}
                        >
                          {commonErrors.method}
                        </div>
                      </motion.div>

                      {isCommonExpanded && (
                        <motion.div
                          className="space-y-4 pt-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div
                            className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div className="flex items-start">
                              <FiMessageSquare className="text-orange-500 mt-1 mr-3" />
                              <div>
                                <div className="text-sm text-gray-500 mb-1">
                                  Error Message
                                </div>
                                <div className="text-amber-800 font-medium">
                                  {commonErrors.message}
                                </div>
                              </div>
                            </div>
                          </motion.div>

                          <motion.div
                            className="flex space-x-3"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="flex-1 p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                              <div className="text-xs text-gray-500 mb-1">
                                Occurrences
                              </div>
                              <div className="text-sm text-gray-800 font-semibold">
                                {commonErrors.count}
                              </div>
                            </div>
                            <div className="flex-1 p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl">
                              <div className="text-xs text-gray-500 mb-1">
                                First Seen
                              </div>
                              <div className="text-sm text-gray-800">
                                {new Date(
                                  commonErrors.firstSeen
                                ).toLocaleString()}
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      className="mt-4 flex justify-between"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.button
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
                        whileHover={{ scale: 1.05 }}
                        onClick={handleViewErrorDetails}
                      >
                        <FiBarChart2 size={14} />
                        <span>View analytics</span>
                      </motion.button>

                      <motion.button
                        className="text-sm bg-orange-100 text-orange-700 hover:bg-orange-200 flex items-center space-x-1 px-3 py-2 rounded-lg transition-all"
                        whileHover={{ scale: 1.05 }}
                        onClick={handleIgnoreCommonError}
                      >
                        <FiX size={14} />
                        <span>Dismiss</span>
                      </motion.button>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    className="flex flex-col items-center justify-center py-8 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                      animate={{
                        scale: [1, 1.05, 1],
                        backgroundColor: [
                          "rgb(220, 252, 231)",
                          "rgb(226, 246, 231)",
                          "rgb(220, 252, 231)",
                        ],
                      }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    >
                      <svg
                        xmlns="http:www.w3.org/2000/svg"
                        className="h-8 w-8 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                    <p className="text-gray-600 font-medium text-center">
                      No common errors detected
                    </p>
                    <p className="text-gray-400 text-sm text-center mt-2">
                      Your application is running smoothly
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pie chart of Error Stats */}
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

        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-center items-center">
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
            key={"popup"}
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

      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
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
          className="overflow-y-auto max-h-[70vh] p-4 transition-all duration-300 relative"
          onScroll={handleScroll}
          id="error-logs-container"
        >
          {data?.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.errors.map((error: ErrorLog, index) => (
                <ErrorLogCard
                  key={error._id}
                  error={error}
                  index={index}
                  isHighlighted={latestError && error._id === latestError._id}
                  id={`error-log-${error._id}`}
                />
              ))}
            </React.Fragment>
          ))}
          {isFetchingNextPage && (
            <motion.div
              className="text-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600"
                  xmlns="http:www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Loading more errors...</span>
              </div>
            </motion.div>
          )}
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
      </motion.div>
    </div>
  );
}

export default ErrorTrack;
