/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { ErrorLog } from "@/lib/interface";
import { motion,AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiServer } from "react-icons/fi";

const ErrorLogCard = ({ error, index }: { error: ErrorLog, index: number }) => {
    const [isExpanded, setIsExpanded] = useState(false);
  
    const getStatusColor = (statusCode:number) => {
      if (statusCode >= 500) return 'bg-red-500';
      if (statusCode >= 400) return 'bg-orange-500';
      if (statusCode >= 300) return 'bg-yellow-500';
      return 'bg-green-500';
    };
  
    const getMethodColor = (method: 'GET' | 'POST' | 'PUT' | 'DELETE') => {
      const methodColors: { [key in 'GET' | 'POST' | 'PUT' | 'DELETE']: string } = {
        GET: 'bg-blue-500',
        POST: 'bg-green-500',
        PUT: 'bg-yellow-500',
        DELETE: 'bg-red-500'
      };
      return methodColors[method] || 'bg-gray-500';
    };
  
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 mb-4 overflow-hidden"
      >
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-4 w-full">
            <div 
              className={`w-3 h-3 rounded-full ${getStatusColor(error.statusCode)}`}
            />
            <div className="flex-grow">
              <div className="flex items-center space-x-2">
                <span 
                  className={`px-2 py-1 rounded text-xs text-white ${getMethodColor(error.method)}`}
                >
                  {error.method}
                </span>
                <span className="text-gray-600 font-medium truncate max-w-md">
                  {error.route}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1 truncate max-w-xl">
                {error.message}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <FiServer className="text-gray-400" />
              <span className="text-sm">
                {new Date(error.createdAt).toLocaleString()}
              </span>
              {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
        </div>
  
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gray-50 p-4 border-t"
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-600">Error Details</p>
                  <pre className="bg-white p-3 rounded mt-2 text-xs overflow-x-auto">
                  {JSON.stringify(
                      (({ _id, projectId, __v, ...rest }) => rest)(error), 
                      null, 
                      2
                    )}
                  </pre>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Potential Actions</p>
                  <div className="space-y-2 mt-2">
                    <button 
                      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                    >
                      Investigate
                    </button>
                    <button 
                      className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                    >
                      Mark as Resolved
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  export default  ErrorLogCard;