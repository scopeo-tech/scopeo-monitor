"use client";

import {
  errorStats,
  errorMethods as fetchErrorMethods,
  commonErros,
  latestErrors,
} from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

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


  const isAllZero =
    totalErrors.authCount === 0 &&
    totalErrors.notFoundCount === 0 &&
    totalErrors.internalServerErrorCount === 0 &&
    totalErrors.badRequestCount === 0;
  
    useEffect(() => {
      if (isAllZero && !showPopup) {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
      }
    }, [isAllZero,showPopup]);



    if (isLoading) return <p>Loading error data...</p>;
    if (!projectID) return <p>No project selected.</p>;
    
    return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-screen overflow-hidden">
      <div className="p-4 absolute right-10">
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

      <div className="p-4 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-2">Latest Error</h2>
        {latestError ? (
          <>
            <p>
              <b>Status Code:</b> {latestError.statusCode}
            </p>
            <p>
              <b>Route:</b> {latestError.route}
            </p>
            <p>
              <b>Method:</b> {latestError.method}
            </p>
            <p>
              <b>Message:</b> {latestError.message}
            </p>
          </>
        ) : (
          <p>No recent errors found.</p>
        )}
      </div>

      <div className="p-4 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-2">Most Common Error</h2>
        {commonErrors ? (
          <>
            <p>
              <b>Status Code:</b> {commonErrors.statusCode}
            </p>
            <p>
              <b>Route:</b> {commonErrors.route}
            </p>
            <p>
              <b>Method:</b> {commonErrors.method}
            </p>
            <p>
              <b>Message:</b> {commonErrors.message}
            </p>
          </>
        ) : (
          <p>No common errors found.</p>
        )}
      </div>

      <div className="p-4 rounded-2xl shadow-lg flex justify-center">
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

      <div className="p-4 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-2">Error Methods</h2>
        {errorMethods.map(
          ({ method, percentage }: { method: string; percentage: string }) => (
            <div key={method} className="mb-2">
              <p>
                <b>{method}:</b> {percentage || "0.00%"}
              </p>
            </div>
          )
        )}
      </div>

      <AnimatePresence>
        {showPopup && isAllZero && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 rounded-2xl shadow-lg bg-yellow-100 border-l-4 border-yellow-500 fixed top-4 left-4 z-50"
          >
            <h3 className="text-yellow-800 font-bold">No Errors Found</h3>
            <p className="text-yellow-700">
              This project hasn’t logged any errors yet. A minimal chart is
              shown for visualization.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ErrorTrack;
