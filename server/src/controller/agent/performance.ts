import { Request, Response } from "express";
import Performance from "../../model/performanceModel";
import Project from "../../model/projectModel";
import checkProjectOwnership from "../../lib/util/checkProjectOwnership";
import { NextFunction } from "express-serve-static-core";

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
    case "24h":
      return { createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } };
    case "7d":
      return { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
    default:
      return {};
  }
};




//controllers

const getPerformanceData = async (req : Request, res : Response, next : NextFunction) => {
  if (!(await checkProjectOwnership(req, next))) return;

  const { projectId } = req.params;
  const { filter } = req.query;

  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  const dateFilter = getTimeFilter(filter as string || "");

  const performanceData = await Performance.find({
    projectId,
    ...dateFilter,
  })
    .sort({ createdAt: -1 })
    .exec();

  if (!performanceData.length) {
    return res
      .status(404)
      .json({ message: "No performance data found for this project" });
  }

  const formattedResponse = performanceData.map((data) => ({
    _id: data._id,
    projectId: data.projectId,
    uptimePercentage: data.uptimePercentage,
    latency: data.latency,
    responseTime: data.responseTime,
    gapDuration: data.gapDuration,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    requests: data.requests,
    systemUsage: data.systemUsage,
  }));

  res.status(200).json(formattedResponse);

};





export { handleIncomingPerformance, getPerformanceData, checkUptimeStatus };
