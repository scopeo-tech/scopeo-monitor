import { NextFunction, Request, Response } from "express";
import CustomError from "../../lib/util/CustomError";
import Project from "../../model/projectModel";
import Error from "../../model/errorModel";
import {AuthenticatedRequest, ErrorLogPayload} from "../../lib/types/type"
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export const handleIncomingError = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
console.log("..pipi...error incoming from agent..")
  const apiKey = req.headers["x-api-key"] as string;
  const passKey = req.headers["x-pass-key"] as string;
  if (!apiKey || !passKey) {
    return next(new CustomError(401, "Unauthorized"));
  }

  const project = await Project.findOne({ apiKey, passKey });
  
  if (!project) {
    return next(new CustomError(404, "No Project found"));
  }

  const { statusCode, route, method, message } = req.body as ErrorLogPayload;  

  if (!statusCode || !route || !method || !message) {
    return next(new CustomError(400, "Missing required fields"));
  }
  const errorCount = await Error.countDocuments({ projectId: new ObjectId(project._id) });

  if (errorCount >= 60) {
    const oldErrors = await Error.find({ projectId: new ObjectId(project._id) })
      .sort({ createdAt: 1 })
      .limit(10); 
    
    const oldIds = oldErrors.map((err) => err._id);
    await Error.deleteMany({ _id: { $in: oldIds } });
  }

  const errorLog = new Error({
    projectId: project._id,
    statusCode,
    method,
    route,
    message
  });

  await errorLog.save();

};



//controllers

const getCommonError = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { projectId } = req.params;

  if (!projectId) {
    return next(new CustomError(400, "Project ID is required"));
  }

  
    const commonError = await Error.aggregate([
      { $match: { projectId: new ObjectId(projectId) } },
      {
        $group: {
          _id: {
            statusCode: "$statusCode",
            method: "$method",
            route: "$route",
            message: "$message",
          },
          count: { $sum: 1 },
          firstOccurrence: { $min: "$createdAt" },
        },
      },
      { $sort: { count: -1, firstOccurrence: 1 } },
      { $limit: 1 },
    ]);

    if (commonError.length === 0) {
      return res.status(200).json({ message: "No errors found for this project" });
    }

    const mostCommonError = commonError[0];

    const response = {
      statusCode: mostCommonError._id.statusCode,
      method: mostCommonError._id.method,
      route: mostCommonError._id.route,
      message: mostCommonError._id.message,
      count: mostCommonError.count,
    };

    res.status(200).json(response);
};

const getLatestError = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { projectId } = req.params;

  if (!projectId) {
    return next(new CustomError(400, "Project ID is required"));
  }

  try {
    const latestError = await Error.findOne({ projectId: new ObjectId(projectId) })
      .sort({ createdAt: -1 })
      .select("statusCode method route message createdAt");

    if (!latestError) {
      return res.status(200).json({ message: "No errors found for this project" });
    }

    const response = {
      statusCode: latestError.statusCode,
      method: latestError.method,
      route: latestError.route,
      message: latestError.message,
      createdAt: latestError.createdAt,
    };

    res.status(200).json(response);
  } catch (error) {
    next(new CustomError(500, "Internal Server Error"));
  }
};

const getErrorMethodPercentages = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { projectId } = req.params;

  if (!projectId) {
    return next(new CustomError(400, "Project ID is required"));
  }

  try {
    const methodStats = await Error.aggregate([
      { $match: { projectId: new ObjectId(projectId) } },
      {
        $group: {
          _id: "$method",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$count" },
          methods: { $push: { method: "$_id", count: "$count" } },
        },
      },
      {
        $unwind: { path: "$methods", preserveNullAndEmptyArrays: true }, 
      },
      {
        $project: {
          _id: 0,
          method: "$methods.method",
          percentage: {
            $cond: {
              if: { $gt: ["$methods.count", 0] },
              then: { $multiply: [{ $divide: ["$methods.count", "$total"] }, 100] },
              else: 0,
            },
          },
        },
      },
    ]);

    const defaultMethods = ["GET", "POST", "PUT", "DELETE"];
    const response: Record<string, string> = {};

    defaultMethods.forEach((method) => {
      const stat = methodStats.find((s) => s.method === method);
      response[method] = stat ? `${stat.percentage.toFixed(2)}%` : "0.00%";
    });

    res.status(200).json(response);
  } catch (error) {
    next(new CustomError(500, "Internal Server Error"));
  }
};

export { getCommonError, getLatestError, getErrorMethodPercentages };
