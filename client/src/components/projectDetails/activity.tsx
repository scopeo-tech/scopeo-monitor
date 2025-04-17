"use client"

import RecentLogsSkeleton from '../skeltons/logsSkeleton';
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLogs , getRoutesFromDb,getLogsByRoute, getProjectById } from "@/lib/api";
import { useParams } from "next/navigation";
import { useNotificationStore } from "@/lib/stores/notificationStore";
import { Log, Project } from "@/lib/interface";
import withAuth from '@/lib/withAuth';
import { generateLogsPDF } from '@/lib/util/pdf';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';


const timeFilters = [
    { label: "All", value: "" },
    { label: "Last Hour", value: "1hour" },
    { label: "Last 24 Hours", value: "1day" },
    { label: "Last 7 Days", value: "1week" },
    { label: "Last 30 Days", value: "1month" },
];

const Activity = () => {
    const { projectID } = useParams() as { projectID: string };
    const [filter, setFilter] = useState("");
    const [selectedRoute, setSelectedRoute] = useState<string>("");
    const [liveLogs, setLiveLogs] = useState<Log[]>([]); 
    const { socket } = useNotificationStore(); 

    
    const { data, isLoading, isError } = useQuery({
        queryKey: ["logs", projectID, filter],
        queryFn: () => getLogs(projectID, filter),
        staleTime: 5 * 60 * 1000,
    });

    const {data:routes} = useQuery({
        queryKey: ["routes", projectID],
        queryFn: () => getRoutesFromDb(projectID),
        enabled: !!projectID,
        refetchInterval:6000
      });

      const { data: logsByRoutesData} = useQuery<Log[]>({
        queryKey: ["logsByRoutes", projectID, selectedRoute],
        queryFn: () => getLogsByRoute(projectID, selectedRoute),
        enabled: !!selectedRoute,
        refetchInterval: 6000,
    });
    const { data: project } = useQuery<Project>({
          queryKey: ["project", projectID],
          queryFn: () => getProjectById(projectID),
        });
    const logs: Log[] = data?.data?.slice(0, 50) || [];

    
    useEffect(() => {
        if (!socket) return;

        const handleNewLog = (newLog: Log) => {
            setLiveLogs((prevLogs) => [newLog, ...prevLogs].slice(0, 50)); 
        };

        socket.on("logs", handleNewLog);

        return () => {
            socket.off("logs", handleNewLog); 
        };
    }, [socket]);
  
    if (isLoading) return <RecentLogsSkeleton/>;
    if (isError) {
        return <p className="text-red-500">Error fetching logs.</p>;
    }

    const handleDownloadPdf = ()=>{
        if (project) {
            generateLogsPDF(project.name, logs);
        }
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <div className='flex items-center gap-4'>
                <h2 className="text-2xl font-bold">Recent Logs</h2>
                <button title="Download data as pdf" onClick={handleDownloadPdf} className="bg-blue py-1 px-2 text-gray-400 hover:text-gray-500"><BsFileEarmarkPdfFill className="text-sm" />  </button>
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border p-2 rounded-md"
                >
                    {timeFilters.map(({ label, value }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-slate-200 rounded-lg shadow-md p-4">
                {liveLogs.length > 0 || logs.length > 0 ? (
                    <pre className="whitespace-pre-wrap text-sm">
                        {[...liveLogs, ...logs].map((log) => (
                            <code key={log._id} className="block border-b border-gray-400 py-2">
                                {log.method} {log.route} - {log.statusCode} ({log.duration}ms)
                            </code>
                        ))}
                    </pre>
                ) : (
                    <p className="text-center text-gray-500">No logs available.</p>
                )}
            </div>
            <div className="flex justify-between items-center my-4">
                <h2 className="text-2xl font-bold">Logs By Routes</h2>
                <select
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                    className="border p-2 rounded-md"
                >
                    {["none",...routes]?.map((route: string,index: number) => (
                        <option key={index+route} value={route}>
                            {route}
                        </option>
                    ))}
                </select>
            </div>
            <div className="bg-slate-200 rounded-lg shadow-md p-4">
                {logsByRoutesData?.length ?? 0 > 0 ? (
                    <pre className="whitespace-pre-wrap text-sm">
                        {logsByRoutesData?.map((log) => (
                            <code key={log._id} className="block border-b border-gray-400 py-2">
                                {log.method} {log.route} - {log.statusCode} ({log.duration}ms)
                            </code>
                        ))}
                    </pre>
                ) : (
                    <p className="text-center text-gray-500">No logs available.</p>
                )}
            </div>
        </div>
    );
};

export default withAuth(Activity);
