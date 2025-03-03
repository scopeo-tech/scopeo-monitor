import { NextFunction, Request, Response } from "express";
import CustomError from "../../lib/util/CustomError";
import Project from "../../model/projectModel";
import Error from "../../model/errorModel";
import {AuthenticatedRequest, ErrorLogPayload} from "../../lib/types/type"
import mongoose from "mongoose";
import checkProjectOwnership from "../../lib/util/checkProjectOwnership";

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

const getTimeFilter = (filter: string) => {
  const now = new Date();
  switch (filter) {
    case "today":
      return { createdAt: { $gte: new Date(now.setHours(0, 0, 0, 0)) } };
    case "week":
      return { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
    case "month":
      return { createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } };
    default:
      return {};
  }
};



const getErrorStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  if (!(await checkProjectOwnership(req, next))) return;

  const { projectId } = req.params;
  const { filter } = req.query;

  if (!projectId) {
    return next(new CustomError(400, "Project ID is required"));
  }

  const dateFilter = getTimeFilter(filter as string);

  const stats = await Error.aggregate([
    { $match: { projectId: new ObjectId(projectId), ...dateFilter } },
    {
      $group: {
        _id: "$statusCode",
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        totalErrors: { $sum: "$count" },
        authCount: {
          $sum: {
            $cond: {
              if: { $or: [{ $eq: ["$_id", 401] }, { $eq: ["$_id", 403] }] },
              then: "$count",
              else: 0,
            },
          },
        },
        notFoundCount: {
          $sum: { $cond: { if: { $eq: ["$_id", 404] }, then: "$count", else: 0 } },
        },
        internalServerErrorCount: {
          $sum: {
            $cond: {
              if: { $and: [{ $gte: ["$_id", 500] }, { $lte: ["$_id", 599] }] },
              then: "$count",
              else: 0,
            },
          },
        },
        badRequestCount: {
          $sum: {
            $cond: {
              if: {
                $and: [
                  { $gte: ["$_id", 400] },
                  { $lte: ["$_id", 499] },
                  { $not: { $in: ["$_id", [401, 403, 404]] } },
                ],
              },
              then: "$count",
              else: 0,
            },
          },
        },
      },
    },
  ]);

  const response = stats.length
    ? stats[0]
    : {
        totalErrors: 0,
        authenticationCount: 0,
        notFoundCount: 0,
        internalServerErrorCount: 0,
        badRequestCount: 0,
      };

  res.status(200).json(response);
};




const getCommonError = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  if (!(await checkProjectOwnership(req, next))) return;

  const { projectId } = req.params;
  const { filter } = req.query;

  if (!projectId) {
    return next(new CustomError(400, "Project ID is required"));
  }

  const dateFilter = getTimeFilter(filter as string);

  const commonError = await Error.aggregate([
    { $match: { projectId: new ObjectId(projectId), ...dateFilter } },
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
    return res.status(200).json({ message: "No errors found for this project", data: [] });
  }

  const mostCommonError = commonError[0];

  res.status(200).json({
    statusCode: mostCommonError._id.statusCode,
    method: mostCommonError._id.method,
    route: mostCommonError._id.route,
    message: mostCommonError._id.message,
    count: mostCommonError.count,
  });
};


const getLatestError = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  if (!(await checkProjectOwnership(req, next))) return;

  const { projectId } = req.params;
  const { filter } = req.query;

  if (!projectId) {
    return next(new CustomError(400, "Project ID is required"));
  }

  const dateFilter = getTimeFilter(filter as string);

  const latestError = await Error.findOne({ projectId: new ObjectId(projectId), ...dateFilter })
    .sort({ createdAt: -1 })
    .select("statusCode method route message createdAt");

  if (!latestError) {
    return res.status(200).json({ message: "No errors found for this project" });
  }

  res.status(200).json({
    statusCode: latestError.statusCode,
    method: latestError.method,
    route: latestError.route,
    message: latestError.message,
    createdAt: latestError.createdAt,
  });
};


const getErrorMethodPercentages = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  if (!(await checkProjectOwnership(req, next))) return;

  const { projectId } = req.params;
  const { filter } = req.query;

  if (!projectId) {
    return next(new CustomError(400, "Project ID is required"));
  }

  const dateFilter = getTimeFilter(filter as string);

  const methodStats = await Error.aggregate([
    { $match: { projectId: new ObjectId(projectId), ...dateFilter } },
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
    { $unwind: "$methods" },
    {
      $project: {
        _id: 0,
        method: "$methods.method",
        percentage: {
          $multiply: [{ $divide: ["$methods.count", "$total"] }, 100],
        },
      },
    },
  ]);

  const methodOrder = ["GET", "POST", "PUT", "DELETE"];

  const response = methodOrder.map((method) => {
    const foundMethod = methodStats.find((stat) => stat.method === method);
    return {
      method,
      percentage: foundMethod ? `${foundMethod.percentage.toFixed(2)}%` : "0.00%",
    };
  });

  res.status(200).json(response);
};




export { getErrorStats, getCommonError, getLatestError, getErrorMethodPercentages };
