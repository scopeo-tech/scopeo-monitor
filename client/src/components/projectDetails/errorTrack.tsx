"use client";
import {
  errorStats,
  errorMethods as fetchErrorMethods,
  commonErros,
  latestErrors,
} from "@/lib/api";
import axiosErrorManager from "@/lib/util/axiosErrorManager";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#90BAAD", "#689689", "#B0CA87", "#ADF6B1"];

interface TotalErrors {
  authenticationCount: number;
  notFoundCount: number;
  internalServerErrorCount: number;
  badRequestCount: number;
  totalErrors: number;
}

interface ErrorsInter {
  statusCode: number;
  route: string;
  method: string;
  message: string;
}

interface ErrorMethods {
  GET: string;
  POST: string;
  PUT: string;
  DELETE: string;
}

function ErrorTrack() {
  const { projectID } = useParams() as { projectID: string };

  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const [totalErrors, setTotalErrors] = useState<TotalErrors>({
    authenticationCount: 0,
    notFoundCount: 0,
    internalServerErrorCount: 0,
    badRequestCount: 0,
    totalErrors: 0,
  });

  const [commonErrors, setCommonErrors] = useState<ErrorsInter | null>(null);
  const [latestError, setLatestError] = useState<ErrorsInter | null>(null);
  const [errorMethods, setErrorMethods] = useState<ErrorMethods>({
    GET: "0.00%",
    POST: "0.00%",
    PUT: "0.00%",
    DELETE: "0.00%",
  });

  console.log("Project ID:", projectID);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (projectID) {
          setIsLoading(true);

          const statsRes = await errorStats(projectID);
          setTotalErrors(
            statsRes || {
              authenticationCount: 0,
              notFoundCount: 0,
              internalServerErrorCount: 0,
              badRequestCount: 0,
              totalErrors: 0,
            }
          );

          const commonRes = await commonErros(projectID);
          setCommonErrors(commonRes || null);

          const latestRes = await latestErrors(projectID);
          setLatestError(latestRes || null);

          const methodsRes = await fetchErrorMethods(projectID);
          setErrorMethods(
            methodsRes || {
              GET: "0.00%",
              POST: "0.00%",
              PUT: "0.00%",
              DELETE: "0.00%",
            }
          );
        }
      } catch (error) {
        axiosErrorManager(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectID]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <p>Loading error data...</p>;
  if (!projectID) return <p>No project selected.</p>;

  const pieData = [
    {
      name: "Authentication Errors",
      value: totalErrors?.authenticationCount || 0.01,
    },
    { name: "Not Found", value: totalErrors?.notFoundCount || 0.01 },
    {
      name: "Internal Server",
      value: totalErrors?.internalServerErrorCount || 0.01,
    },
    { name: "Bad Request", value: totalErrors?.badRequestCount || 0.01 },
  ];

  const isAllZero =
    totalErrors.authenticationCount === 0 &&
    totalErrors.notFoundCount === 0 &&
    totalErrors.internalServerErrorCount === 0 &&
    totalErrors.badRequestCount === 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-screen overflow-hidden">
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
          <Pie data={pieData} cx="50%" cy="50%" outerRadius={150} fill="#8884d8" dataKey="value">
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

       {/* Error Method Percentages */}
       <div className="p-4 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-2">Error Method Percentages</h2>
        {Object.entries(errorMethods || {}).length > 0 ? (
          Object.entries(errorMethods).map(([method, percentage]) => (
            <p key={method}>
              <b>{method}:</b> {percentage}
            </p>
          ))
        ) : (
          <p>No error methods found.</p>
        )}
      </div>

      <AnimatePresence>
        {showPopup && isAllZero && (
          <motion.div initial={{ x: "-100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "-100%", opacity: 0 }} transition={{ duration: 0.5 }} className="p-4 rounded-2xl shadow-lg bg-yellow-100 border-l-4 border-yellow-500 fixed top-4 left-4 z-50">
            <h3 className="text-yellow-800 font-bold">No Errors Found</h3>
            <p className="text-yellow-700">This project hasn’t logged any errors yet. A minimal chart is shown for visualization.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ErrorTrack;
