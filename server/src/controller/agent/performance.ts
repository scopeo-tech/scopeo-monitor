import { Request, Response } from "express";
import Performance from "../../model/performanceModel";
import Project from "../../model/projectModel";
import checkProjectOwnership from "../../lib/util/checkProjectOwnership";
import { NextFunction } from "express-serve-static-core";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

const handleIncomingPerformance = async (req: Request, res: Response) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const passKey = req.headers["x-pass-key"];

    if (!apiKey || !passKey) {
      return res.status(401).json({ message: "API key and Pass key required" });
    }

    const project = await Project.findOne({ apiKey, passKey });

    if (!project) {
      return res.status(403).json({ message: "Invalid API key or Pass key" });
    }

    const performanceData = req.body;

    const performanceCount = await Performance.countDocuments({ projectId: project._id });

    if (performanceCount >= 1500) {
      const oldPerformances = await Performance.find({ projectId: project._id })
        .sort({ createdAt: 1 })
        .limit(60);
      
      const oldIds = oldPerformances.map((perf) => perf._id);
      await Performance.deleteMany({ _id: { $in: oldIds } });
    }


    const latestPerformance = await Performance.findOne({ projectId: project._id }).sort({ createdAt: -1 });

    let updatedUptimePercentage = 100;
    let status = "up";
    let gapDuration = 0;

    if (latestPerformance) {
      const totalElapsedTime = (Date.now() - latestPerformance.createdAt.getTime()) / 1000;

      updatedUptimePercentage = totalElapsedTime > 0
        ? (1 - (latestPerformance.gapDuration / totalElapsedTime)) * 100
        : 100;

      updatedUptimePercentage = Math.max(0, Math.min(100, updatedUptimePercentage));

      status = latestPerformance.status || "up";
      gapDuration = latestPerformance.gapDuration || 0;
    }

    console.log("hiii perfooo", req.body);

    const newPerformance = new Performance({
      ...performanceData,
      projectId: project._id,
      uptimePercentage: updatedUptimePercentage,
      status: status,
      gapDuration: gapDuration,
    });

    await newPerformance.save();

    res.status(201).json({ message: "Performance data saved successfully" });
  } catch (error) {
    console.log("Error saving performance data", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const checkUptimeStatus = async () => {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    const projects = await Project.find();

    for (const project of projects) {
      const latestPerformance = await Performance.findOne({
        projectId: project._id,
      }).sort({ createdAt: -1 });

      if (latestPerformance) {
        const isDown = latestPerformance.createdAt < twoMinutesAgo;

        latestPerformance.status = isDown ? "down" : "up";
        latestPerformance.gapDuration = isDown
          ? (Date.now() - latestPerformance.createdAt.getTime()) / 1000
          : 0;

        const totalTimeObserved = (Date.now() - project.createdAt.getTime()) / 1000;
        const totalDownTime = latestPerformance.gapDuration;
        latestPerformance.uptimePercentage = 100 * (1 - (totalDownTime / totalTimeObserved));

        await latestPerformance.save();
      }
    }
};


//filtering

const getTimeFilter = (filter: string) => {
  const now = new Date();
  switch (filter) {
    case "1h":
      return { createdAt: { $gte: new Date(now.getTime() - 1 * 60 * 60 * 1000) } };
    case "24h":
      return { createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } };
    default:
      return { createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } };
  }
};





//controllers

const getPerformanceData = async (req: Request, res: Response, next: NextFunction) => {
  if (!(await checkProjectOwnership(req, next))) return;
  const { projectId } = req.params;
  const { filter } = req.query;
  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }
  const dateFilter = getTimeFilter(filter as string || "");
  const projectIdObj = new ObjectId(projectId);
  
  const allData = await Performance.aggregate([
    {
      $match: {
        projectId: projectIdObj,
        ...dateFilter
      }
    },
    {
      $sort: { createdAt: 1 }
    },
    {
      $project: {
        _id: 1,
        projectId: 1,
        status: 1,
        uptimePercentage: 1,
        latency: 1,
        responseTime: 1,
        gapDuration: 1,
        createdAt: 1,
        updatedAt: 1,
        requests: 1,
        systemUsage: 1
      }
    }
  ]);
  
  if (allData.length === 0) {
    const emptyData = [
      {
        _id: "",
        projectId: projectId,
        uptimePercentage: 0,
        latency: 0,
        responseTime: 0,
        createdAt: new Date(),
        requests: 0,
        averagePerSecond: 0,
        peakedPerSecond: 0,
        failedReq: 0,
        success: 0,
        errorrate: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0
      }
    ];
    return res.status(200).json(emptyData);
  }
  const data = allData.map((item) => {
    return {
      _id: item._id,
      projectId: item.projectId,
      uptimePercentage: item.uptimePercentage,
      latency: item.latency,
      responseTime: item.responseTime,
      createdAt: item.createdAt,
      requests: item.requests.totalRequests,
      averagePerSecond:item.requests.averagePerSecond,
      peakedPerSecond:item.requests.peakedPerSecond,
      failedReq:item.requests.failed,
      success:item.requests.success,
      errorrate:item.requests.errorRate,
      cpuUsage:item.systemUsage.cpuUsage.reduce((a: number, b:number) => a + b, 0) / item.systemUsage.cpuUsage.length,
      memoryUsage:item.systemUsage.memoryUsage.usagePercent,
      diskUsage:item.systemUsage.diskUsage.usagePercent
    };
  })
  res.status(200).json(data);
};


const getServerPerformanceMetrics = async (req: Request, res: Response, next: NextFunction) => {
  if (!(await checkProjectOwnership(req, next))) return;

  const { projectId } = req.params;
  const { filter } = req.query;

  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  const dateFilter = getTimeFilter(filter as string || "");
  const projectIdObj = new ObjectId(projectId);

  const aggregationPipeline = [
    { $match: { projectId: projectIdObj, ...dateFilter } },
    {
      $group: {
        _id: null,
        totalRequests: { $sum: "$requests.totalRequests" },
        avgResponseTime: { $avg: "$responseTime" },
        avgLatency: { $avg: "$latency" },
        avgUptimePercentage: { $avg: "$uptimePercentage" },
        httpStatusCounts: { $mergeObjects: "$requests.httpStatusCounts" },
        latestStatus: { $last: "$status" },
        upCount: { 
          $sum: { 
            $cond: [{ $eq: ["$status", "up"] }, 1, 0] 
          } 
        },
        totalCount: { $sum: 1 }
      },
    },
    {
      $project: {
        _id: 0,
        avgResponseTime: { $round: ["$avgResponseTime", 2] },
        avgLatency: { $round: ["$avgLatency", 2] },
        avgUptimePercentage: { $round: ["$avgUptimePercentage", 2] },
        currentUptime: { 
          $round: [{ $multiply: [{ $divide: ["$upCount", "$totalCount"] }, 100] }, 2] 
        },
        totalRequests: 1,
        httpStatusCounts: 1,
        latestStatus: 1
      },
    },
  ];

  const [metrics] = await Performance.aggregate(aggregationPipeline);

  if (!metrics) {
    return res.status(200).json({
      message: "No performance data found for this project",
      data: {}
    });
  }  

  res.status(200).json({
    projectId,
    ...metrics,
  });
};


const getSystemHealthMetrics = async (req: Request, res: Response, next: NextFunction) => {
  if (!(await checkProjectOwnership(req, next))) return;

  const { projectId } = req.params;
  const { filter } = req.query;

  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  const dateFilter = getTimeFilter(filter as string || "");
  const projectIdObj = new ObjectId(projectId);

  const aggregationPipeline = [
    { $match: { projectId: projectIdObj, ...dateFilter } },
    {
      $group: {
        _id: null,
        avgCpuUsage: { $avg: { $avg: "$systemUsage.cpuUsage" } },
        maxCpuUsage: { $max: { $max: "$systemUsage.cpuUsage" } },
        avgMemoryUsage: { $avg: "$systemUsage.memoryUsage.usagePercent" },
        maxMemoryUsage: { $max: "$systemUsage.memoryUsage.usagePercent" },
        avgDiskUsage: { $avg: "$systemUsage.diskUsage.usagePercent" },
        maxDiskUsage: { $max: "$systemUsage.diskUsage.usagePercent" },
        latestDoc: { $last: "$$ROOT" }
      },
    },
    {
      $project: {
        _id: 0,
        avgCpuUsage: { $round: ["$avgCpuUsage", 2] },
        maxCpuUsage: { $round: ["$maxCpuUsage", 2] },
        avgMemoryUsage: { $round: ["$avgMemoryUsage", 2] },
        maxMemoryUsage: { $round: ["$maxMemoryUsage", 2] },
        avgDiskUsage: { $round: ["$avgDiskUsage", 2] },
        maxDiskUsage: { $round: ["$maxDiskUsage", 2] },
        latestCpuUsage: { $round: [{ $avg: "$latestDoc.systemUsage.cpuUsage" }, 2] },
        latestMemoryUsage: { $round: ["$latestDoc.systemUsage.memoryUsage.usagePercent", 2] },
        latestDiskUsage: { $round: ["$latestDoc.systemUsage.diskUsage.usagePercent", 2] },
        diskDetails: "$latestDoc.systemUsage.diskUsage.disks",
        timestamp: "$latestDoc.updatedAt"
      },
    },
    {
      $addFields: {
        healthStatus: {
          cpu: {
            $cond: [
              { $gt: ["$latestCpuUsage", 80] },
              "critical",
              {
                $cond: [
                  { $gt: ["$latestCpuUsage", 60] },
                  "warning",
                  "healthy"
                ]
              }
            ]
          },
          memory: {
            $cond: [
              { $gt: ["$latestMemoryUsage", 85] },
              "critical",
              {
                $cond: [
                  { $gt: ["$latestMemoryUsage", 70] },
                  "warning",
                  "healthy"
                ]
              }
            ]
          },
          disk: {
            $cond: [
              { $gt: ["$latestDiskUsage", 90] },
              "critical",
              {
                $cond: [
                  { $gt: ["$latestDiskUsage", 75] },
                  "warning",
                  "healthy"
                ]
              }
            ]
          }
        },
        recommendations: {
          $concatArrays: [
            //cpu recommendations
            {
              $cond: [
                { $gt: ["$latestCpuUsage", 80] },
                [{ resource: "CPU", message: "High CPU usage detected. Consider scaling up resources or optimizing application performance." }],
                {
                  $cond: [
                    { $gt: ["$latestCpuUsage", 60] },
                    [{ resource: "CPU", message: "Elevated CPU usage. Monitor for potential performance issues." }],
                    []
                  ]
                }
              ]
            },
            //memory recommendations
            {
              $cond: [
                { $gt: ["$latestMemoryUsage", 85] },
                [{ resource: "Memory", message: "Critical memory usage. Increase RAM allocation or address memory leaks." }],
                {
                  $cond: [
                    { $gt: ["$latestMemoryUsage", 70] },
                    [{ resource: "Memory", message: "Memory usage approaching limits. Consider optimization or scaling." }],
                    []
                  ]
                }
              ]
            },
            //disk recommendations
            {
              $cond: [
                { $gt: ["$latestDiskUsage", 90] },
                [{ resource: "Disk", message: "Critical disk space shortage. Urgent cleanup or expansion required." }],
                {
                  $cond: [
                    { $gt: ["$latestDiskUsage", 75] },
                    [{ resource: "Disk", message: "Disk space usage is high. Consider cleanup or adding storage." }],
                    []
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  ];

  const [metrics] = await Performance.aggregate(aggregationPipeline);

    if (!metrics) {
      return res.status(200).json({
        projectId,
        avgCpuUsage: 0,
        maxCpuUsage: 0,
        avgMemoryUsage: 0,
        maxMemoryUsage: 0,
        avgDiskUsage: 0,
        maxDiskUsage: 0,
        latestCpuUsage: 0,
        latestMemoryUsage: 0,
        latestDiskUsage: 0,
        diskDetails: [],
        timestamp: null,
        healthStatus: { cpu: "healthy", memory: "healthy", disk: "healthy" },
        recommendations: [],
        overallHealth: "healthy"
      });
  }

  //disk drive warnings
  if (metrics.diskDetails && metrics.diskDetails.length > 0) {
    const criticalDisks = metrics.diskDetails.filter((disk: { drive: string; usagePercent: number }) => disk.usagePercent > 90);
    const warningDisks = metrics.diskDetails.filter((disk: { drive: string; usagePercent: number }) => disk.usagePercent > 75 && disk.usagePercent <= 90);
    
    criticalDisks.forEach((disk: { drive: string; usagePercent: number }) => {
      metrics.recommendations.push({
        resource: `Disk ${disk.drive}`,
        message: `Critical: ${disk.drive} is at ${disk.usagePercent.toFixed(2)}% capacity. Immediate action required.`
      });
    });
    
    warningDisks.forEach((disk: { drive: string; usagePercent: number }) => {
      metrics.recommendations.push({
        resource: `Disk ${disk.drive}`,
        message: `Warning: ${disk.drive} is at ${disk.usagePercent.toFixed(2)}% capacity. Cleanup recommended.`
      });
    });
  }

  //overall system health status
  const statusPriority = { critical: 3, warning: 2, healthy: 1 };
  const healthStatuses = [
    metrics.healthStatus.cpu,
    metrics.healthStatus.memory, 
    metrics.healthStatus.disk
  ];
  
  //highest priority status
  let highestStatus = "healthy";
  for (const status of healthStatuses) {
    if (statusPriority[status as keyof typeof statusPriority] > statusPriority[highestStatus as keyof typeof statusPriority]) {
      highestStatus = status;
    }
  }
  
  metrics.overallHealth = highestStatus;

  res.status(200).json({
    projectId,
    ...metrics,
  });
};


const getTrafficLoadMetrics = async (req: Request, res: Response, next: NextFunction) => {
  if (!(await checkProjectOwnership(req, next))) return;

  const { projectId } = req.params;
  const { filter } = req.query;

  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  const dateFilter = getTimeFilter(filter as string || "");
  const projectIdObj = new ObjectId(projectId);

  const aggregationPipeline = [
    { $match: { projectId: projectIdObj, ...dateFilter } },
    {
      $group: {
        _id: null,
        totalRequests: { $sum: "$requests.totalRequests" },
        totalSuccess: { $sum: "$requests.success" },
        totalFailed: { $sum: "$requests.failed" },
        avgRequestsPerSecond: { $avg: "$requests.averagePerSecond" },
        peakRequestsPerSecond: { $max: "$requests.peakPerSecond" },
        httpStatusCounts: { $mergeObjects: "$requests.httpStatusCounts" },
        documentCount: { $sum: 1 },
        earliestTimestamp: { $min: "$createdAt" },
        latestTimestamp: { $max: "$updatedAt" }
      },
    },
    {
      $project: {
        _id: 0,
        totalRequests: 1,
        totalSuccess: 1,
        totalFailed: 1,
        avgRequestsPerSecond: { $round: ["$avgRequestsPerSecond", 2] },
        peakRequestsPerSecond: 1,
        httpStatusCounts: 1,
        errorRate: { 
          $cond: [
            { $eq: ["$totalRequests", 0] },
            0,
            { $round: [{ $multiply: [{ $divide: ["$totalFailed", "$totalRequests"] }, 100] }, 2] }
          ]
        },
        durationSeconds: { 
          $divide: [
            { $subtract: ["$latestTimestamp", "$earliestTimestamp"] }, 
            1000
          ] 
        },
        successRate: { 
          $cond: [
            { $eq: ["$totalRequests", 0] },
            0,
            { $round: [{ $multiply: [{ $divide: ["$totalSuccess", "$totalRequests"] }, 100] }, 2] }
          ]
        }
      },
    },
    {
      $addFields: {
        requestsPerMinute: { 
          $cond: [
            { $eq: ["$durationSeconds", 0] },
            0,
            { $round: [{ $multiply: [{ $divide: ["$totalRequests", "$durationSeconds"] }, 60] }, 2] }
          ]
        },
        trafficHealth: {
          $cond: [
            { $gt: ["$errorRate", 5] },
            "unhealthy",
            {
              $cond: [
                { $gt: ["$errorRate", 1] },
                "degraded",
                "healthy"
              ]
            }
          ]
        }
      }
    }
  ];

  const [metrics] = await Performance.aggregate(aggregationPipeline);

  if (!metrics) {
    return res.status(200).json({
      projectId,
      metrics: {
        totalRequests: 0,
        totalSuccess: 0,
        totalFailed: 0,
        requestsPerSecond: {
          average: 0,
          peak: 0
        },
        requestsPerMinute: 0,
        successRate: 0,
        errorRate: 0,
        trafficHealth: "unknown"
      },
      statusCodes: {
        informational: {},
        success: {},
        redirection: {},
        clientError: {},
        serverError: {}
      },
      insights: ["No traffic data available for the selected period."]
    });
  }
  

  const statusCodeGroups: { [key: string]: { [key: string]: number } } = {
    informational: {},
    success: {},
    redirection: {},
    clientError: {},
    serverError: {}
  };

  if (metrics.httpStatusCounts) {
    Object.entries(metrics.httpStatusCounts).forEach(([code, count]) => {
      const codeNum = parseInt(code);
      if (codeNum >= 100 && codeNum < 200) statusCodeGroups.informational[code] = count as number;
      else if (codeNum >= 200 && codeNum < 300) statusCodeGroups.success[code] = count as number;
      else if (codeNum >= 300 && codeNum < 400) statusCodeGroups.redirection[code] = count as number;
      else if (codeNum >= 400 && codeNum < 500) statusCodeGroups.clientError[code] = count as number;
      else if (codeNum >= 500 && codeNum < 600) statusCodeGroups.serverError[code] = count as number;
    });
  }

  const insights = [];
  
  if (metrics.errorRate > 5) {
    insights.push("High error rate detected. Investigate server-side issues.");
  } else if (metrics.errorRate > 1) {
    insights.push("Moderate error rate. Monitor for potential issues.");
  }
  
  if (metrics.peakRequestsPerSecond > metrics.avgRequestsPerSecond * 3) {
    insights.push("Traffic spikes detected. Consider load balancing or scaling solutions.");
  }
  
  if (statusCodeGroups.serverError && Object.keys(statusCodeGroups.serverError).length > 0) {
    insights.push("Server errors detected. Check application logs for details.");
  }

  res.status(200).json({
    projectId,
    metrics: {
      totalRequests: metrics.totalRequests,
      totalSuccess: metrics.totalSuccess,
      totalFailed: metrics.totalFailed,
      requestsPerSecond: {
        average: metrics.avgRequestsPerSecond,
        peak: metrics.peakRequestsPerSecond
      },
      requestsPerMinute: metrics.requestsPerMinute,
      successRate: metrics.successRate,
      errorRate: metrics.errorRate,
      trafficHealth: metrics.trafficHealth
    },
    statusCodes: statusCodeGroups,
    insights
  });
};


const getErrorStabilityMetrics = async (req: Request, res: Response, next: NextFunction) => {
  if (!(await checkProjectOwnership(req, next))) return;

  const { projectId } = req.params;
  const { filter } = req.query;

  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  const dateFilter = getTimeFilter(filter as string || "");
  const projectIdObj = new ObjectId(projectId);

  const aggregationPipeline = [
    { $match: { projectId: projectIdObj, ...dateFilter } },
    {
      $group: {
        _id: null,
        failedRequests: { $sum: "$requests.failed" },
        successRequests: { $sum: "$requests.success" },
        totalRequests: { $sum: "$requests.totalRequests" },
      },
    },
    {
      $project: {
        _id: 0,
        failedRequests: 1,
        successRequests: 1,
        errorRate: {
          $multiply: [
            { $divide: ["$failedRequests", "$totalRequests"] },
            100,
          ],
        },
      },
    },
  ];

  const [metrics] = await Performance.aggregate(aggregationPipeline);

  if (!metrics) {
    return res.status(200).json({
      projectId,
      failedRequests: 0,
      successRequests: 0,
      totalRequests: 0,
      errorRate: 0,
      message: "No error stability data found for this project",
    });
  }  

  res.status(200).json({
    projectId,
    ...metrics,
  });
};






export { handleIncomingPerformance, checkUptimeStatus ,getPerformanceData , getServerPerformanceMetrics, getSystemHealthMetrics, getTrafficLoadMetrics , getErrorStabilityMetrics };
