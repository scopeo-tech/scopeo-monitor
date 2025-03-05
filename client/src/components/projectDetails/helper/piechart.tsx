import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ISecurity } from './cards'
import { timeOptions } from '../accessMonitor'

const Piechart = ({ stats, pieTimeRange, setPieTimeRange }: { stats: ISecurity, pieTimeRange: string, setPieTimeRange: React.Dispatch<React.SetStateAction<string>> , isStatsLoading: boolean }) => {

    const pieData: { name: string; value: number; color: string }[] = [
        { name: "Total Logins", value: Math.max(0.1 ,stats.totalLogins), color: "#16C47F" },
        { name: "Success Logins", value: Math.max(0.1 ,stats.successLogins), color: "#13A76C" },
        { name: "Failed Logins", value: Math.max(0.1 ,stats.failedLogins), color: "#A1C416" },
        { name: "Unusual Logins", value: Math.max(0.1 ,stats.totalUnusual), color: "#C4B216" },
        { name: "Brute Force Attempt", value: Math.max(0.1 ,stats.bruteForce), color: "#C47F16" },
        { name: "Brute Force Attack", value: Math.max(0.1 ,stats.unusualConsecSuccess), color: "#5C7F16" },
        { name: "High-Freq Login Anomaly", value: Math.max(0.1 ,stats.unusualHighFreq), color: "#C45F16" },
    ];
    return (
        <div className="flex-[29] flex flex-col items-center p-2 justify-between h-full bg-white rounded-lg">
            <div className="flex w-full items-center justify-between">
                <p className="font-semibold text-start">Login metrics</p>
                <button className="flex items-center" onClick={() => setPieTimeRange(prev => prev === "all" ? "today" : timeOptions[timeOptions.indexOf(prev) + 1])}>
                    <div className='w-[5px] mt-1 me-1 h-[5px] rounded-full bg-gray-400'/>
                    <p className="font-semibold text-xs text-gray-400">{pieTimeRange == "today" ? "Today" : pieTimeRange == "all" ? "All" : "Last " + pieTimeRange}</p>
                </button>
            </div>

            <ResponsiveContainer width="80%" height="80%">
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={3}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

            {/* Stats under the donut graph */}
            <div className="text-gray-600 text-xs w-full font-semibold">
                <div className="grid grid-cols-2 gap-1">
                    {pieData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                ></span>
                                <span>{item.name}</span>
                            </div>
                            <span>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Piechart
