"use client";
import { getErrorAnalysis, resolveError, unResolveError } from "@/lib/api";
import { ErrorLog } from "@/lib/interface";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiServer,
  FiRefreshCcw,
} from "react-icons/fi";
import AIAnalysisModal from "../modal/AIAnalysisModal";

const ErrorLogCard = ({ error, index, isHighlighted, id }: {
  error: ErrorLog;
  index: number;
  isHighlighted?: boolean;
  id?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isResolved, setIsResolved] = useState(error.resolved);

  const resolveMutation = useMutation({
    mutationFn: () => resolveError(error._id!),
    onSuccess: () => setIsResolved(true),
  });

  const unResolveMutation = useMutation({
    mutationFn: () => unResolveError(error._id!),
    onSuccess: () => setIsResolved(false),
  });

  const { mutate, data, isPending, isError } = useMutation({
    mutationFn: (errorMessage: string) => getErrorAnalysis(errorMessage),
  });

  const handleAnalyze = () => {
    const errorMessage = `
statusCode: ${error.statusCode}
method: ${error.method}
route: ${error.route}
message: ${error.message}
createdAt: ${error.createdAt}`.trim();
    
    mutate(errorMessage, {
      onSuccess: () => setModalOpen(true),
    });
  };

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, scale: isHighlighted ? [1, 1.03, 1] : 1 }}
      transition={{ delay: index * 0.05, scale: { duration: isHighlighted ? 0.8 : 0 } }}
      className={`bg-white rounded-xl shadow-lg border mb-4 overflow-hidden transition-all ${
        isResolved ? "border-green-400" : "border-gray-100"
      }`}
    >
      <div
        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition ${
          isResolved ? "bg-green-50" : ""
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4 w-full relative">
          {isResolved && (
            <FiCheckCircle className="absolute top-2 right-2 text-green-500 text-xl" />
          )}
          <div className="flex-grow">
            <p className="font-medium text-gray-600 truncate max-w-md">{error.route}</p>
            <p className="text-sm text-gray-500 truncate max-w-xl">{error.message}</p>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <FiServer className="text-gray-400" />
            <span className="text-sm">{new Date(error.createdAt).toLocaleString()}</span>
            {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gray-50 p-4 border-t"
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-600">Error Details</p>
                <pre className="bg-white p-3 rounded mt-2 text-xs overflow-x-auto">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Actions</p>
                <div className="space-y-2 mt-2">
                  {isResolved ? (
                    <div className="p-3 bg-green-100 text-green-700 rounded text-center flex flex-col items-center">
                      <FiCheckCircle className="text-green-500 text-2xl" />
                      <p className="mt-2">This issue is resolved.</p>
                      <button
                        onClick={() => unResolveMutation.mutate()}
                        className="mt-2 flex items-center bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition"
                      >
                        <FiRefreshCcw className="mr-2" /> Mark as Unresolved
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handleAnalyze}
                        disabled={isPending}
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                      >
                        {isPending ? "Analyzing..." : "Investigate"}
                      </button>
                      <AIAnalysisModal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                        data={data}
                      />
                      {isError && (
                        <p className="text-red-500">Error analyzing the issue</p>
                      )}
                      <button
                        onClick={() => resolveMutation.mutate()}
                        className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition"
                      >
                        Mark as Resolved
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ErrorLogCard;
