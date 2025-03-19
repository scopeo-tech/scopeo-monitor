"use client";

import RecentLogsSkeleton from '../skeltons/logsSkeleton';
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLogs } from "@/lib/api";
import { useParams } from "next/navigation";
import { useNotificationStore } from "@/lib/stores/notificationStore";
import { Log } from "@/lib/interface";

const timeFilters = [
    { label: "All", value: "" },
    { label: "Last Hour", value: "1h" },
    { label: "Last 24 Hours", value: "24h" },
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
];

const Activity = () => {
    const { projectID } = useParams() as { projectID: string };
    const [filter, setFilter] = useState("");
    const [liveLogs, setLiveLogs] = useState<Log[]>([]); 
    const { socket } = useNotificationStore(); 

    
    const { data, isLoading, isError } = useQuery({
        queryKey: ["logs", projectID, filter],
        queryFn: () => getLogs(projectID, filter),
        staleTime: 5 * 60 * 1000,
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

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Recent Logs</h2>
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
        </div>
    );
};

export default Activity;
