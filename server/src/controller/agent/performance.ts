import { Request, Response } from "express";
import Performance from "../../model/performanceModel";
import Project from "../../model/projectModel";

export const handleIncomingPerformance = async (
  req: Request,
  res: Response
) => {
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
    console.log("hiii perfooo", req.body);

    const newPerformance = new Performance({
      ...performanceData,
      projectId: project._id,
    });
    await newPerformance.save();

    res.status(201).json({ message: "Performance data saved successfully" });
  } catch (error) {
    console.log("Error saving performance data", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//controllers

export const getLatestPerformance = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const latestPerformance = await Performance.findOne({ projectId })
    .sort({ createdAt: -1 })
    .exec();
  if (!latestPerformance) {
    return res
      .status(404)
      .json({ message: "Performance data not found for this project" });
  }
  const formattedResponse = {
    _id: latestPerformance._id,
    projectId: latestPerformance.projectId,
    uptimePercentage: latestPerformance.uptimePercentage,
    latency: latestPerformance.latency,
    responseTime: latestPerformance.responseTime,
    createdAt: latestPerformance.createdAt,
    updatedAt: latestPerformance.updatedAt,
    requests: latestPerformance.requests,
    systemUsage: latestPerformance.systemUsage,
  };
  res.status(200).json(formattedResponse);
};
