import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../lib/types/type";
import Project from "../../model/projectModel";
import Security from "../../model/securityModel";
import Health from "../../model/healthModel";
import Error from "../../model/errorModel";
import Log from "../../model/logModel";
import CustomError from "../../lib/util/CustomError";
import crypto from "crypto";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

const generateApiKey = () => {
  return crypto.randomBytes(8).toString("hex");
};
const generatePassKey = () => {
  return crypto.randomBytes(8).toString("hex");
};

const getApiKey = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const apiKey = generateApiKey();
  return res
    .status(200)
    .json({ status: "success", message: "API key generated", data: apiKey });
};

const getPassKey = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const passKey = generatePassKey();
  return res
    .status(200)
    .json({ status: "success", message: "Pass key generated", data: passKey });
};

const createProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { name, apiKey, passKey, notificationStatus } = req.body;
  if (!name || !apiKey || !passKey) {
    return next(new CustomError(400, "Missing required fields"));
  }
  const nameExists = await Project.findOne({ name });
  const apiKeyExists = await Project.findOne({ apiKey });
  const passKeyExists = await Project.findOne({ passKey });
  if (nameExists || apiKeyExists || passKeyExists) {
    return next(new CustomError(400, "Project name already exists"));
  }
  const user = req?.user;
  if (!user) {
    return next(new CustomError(400, "User not found"));
  }
  await Project.create({ name, user, notificationStatus, apiKey, passKey });
  return res
    .status(201)
    .json({ status: "success", message: "Project created" });
};

const getProjectPassKey = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { projectId } = req.params;
  const user = req.user;
  if (!projectId) {
    return next(new CustomError(404, "Project ID not provided"));
  }
  const project = await Project.findOne(
    { user, _id: projectId },
    { passKey: 1 }
  );
  if (!project) {
    return next(new CustomError(404, "Project not found"));
  }
  return res
    .status(200)
    .json({
      status: "success",
      message: "Project found",
      data: project.passKey,
    });
};

const updateProjectStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { apiKey, PassKey, status } = req.body;
  const project = await Project.findOne({ apiKey, PassKey });
  if (!project) {
    return next(new CustomError(404, "Project not found"));
  }
  if (project.status) {
    project.status.connectionStatus = status;
    project.status.updatedAt = new Date();
  }else{
    return next(new CustomError(404, "Project not found , make sure you provided correct apikey and passkey"));
  }
  await project.save();

  return res
    .status(200)
    .json({ status: "success", message: "Project status updated" });
};

const flagOldStatuses=async ()=> {
    const twelveSecondsAgo = new Date(Date.now() - 12 * 1000); 
  
    await Project.updateMany(
      { "status.updatedAt": { $lt: twelveSecondsAgo } }, 
      { $set: { "status.connectionStatus": false } } 
    );
  }

//updateProject
const updateProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const {projectId} = req.params
  const {passKey,name } = req.body
  if(!projectId){
    return next(new CustomError(404, "Project ID not provided"));
  }
  const project = await Project.findOne({ _id: projectId });
  if (!project) {
    return next(new CustomError(404, "Project not found"));
  }
  if (name) {
    const nameExists = await Project.findOne({ name });
    if (nameExists) {
      return next(new Error("Project name can't be same as previous."));
    }
    project.name = name;
  }
  if(passKey){
    project.passKey = passKey;
  }
  await project.save();
  res.status(200).json({ success: true, message: "Project updated successfully.", project });
};


const checkProjectName = async (req: AuthenticatedRequest, res: Response, next:NextFunction) => {
  const {name} = req.body
  if(!name){
    return next(new Error("Project name is required."));
  }
  const existingProject = await Project.findOne({ name });
  if (existingProject) {
    return res.status(200).json({status:"success", message:"Project name can't be same as previous", data:true });
  }
  return res.status(200).json({status:"success", message:"Project name is available", data:false });
};

const deleteProject = async (req: AuthenticatedRequest, res: Response,next:NextFunction) => {
  const { projectId } = req.params;
  const user = req.user;
  if (!projectId) {
    return next(new CustomError(404, "Project ID not provided"));
  }
  const project = await Project.findOneAndDelete({ user, _id: projectId });
  if (!project) {
    return next(new CustomError(404, "Project not found"));
  }
  await Promise.all([
    Health.deleteMany({ project: projectId }),
    Log.deleteMany({ project: projectId }),
    Security.deleteMany({ project: projectId }),
    Error.deleteMany({ project: projectId }),
  ]);
  return res
    .status(200)
    .json({ status: "success", message: "Project deleted" });
};


const getErrorStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { projectId } = req.params;

  if (!projectId) {
    return next(new CustomError(400, "Project ID is required"));
  }

  const stats = await Error.aggregate([
    { $match: { projectId: new ObjectId(projectId) } },
    {
      $group: {
        _id: "$statusCode",
        count: { $sum: 1 },
        mostCommonRoute: { $first: "$route" },
        mostCommonMessage: { $first: "$message" },
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
          $sum: {
            $cond: { if: { $eq: ["$_id", 404] }, then: "$count", else: 0 },
          },
        },
        internalServerErrorCount: {
          $sum: {
            $cond: { if: { $eq: ["$_id", 500] }, then: "$count", else: 0 },
          },
        },
        badRequestCount: {
          $sum: {
            $cond: { if: { $eq: ["$_id", 400] }, then: "$count", else: 0 },
          },
        },
        mostCommonErrorCount: { $max: "$count" },
      },
    },
  ]);

  if (stats.length === 0) {
    return res.status(200).json({
      totalErrors: 0,
      authenticationCount: 0,
      notFoundCount: 0,
      internalServerErrorCount: 0,
      badRequestCount: 0,
      mostCommonErrorCount: 0,
    });
  }

  const errorSummary = stats[0];

  const response = {
    totalErrors: errorSummary.totalErrors,
    authenticationCount: errorSummary.authCount,
    notFoundCount: errorSummary.notFoundCount,
    internalServerErrorCount: errorSummary.internalServerErrorCount,
    badRequestCount: errorSummary.badRequestCount,
    mostCommonErrorCount: errorSummary.mostCommonErrorCount,
  };

  res.status(200).json(response);
};


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
  
};




export {
  getApiKey,
  getPassKey,
  createProject,
  getProjectPassKey,
  updateProjectStatus,
  flagOldStatuses,
  updateProject,
  checkProjectName,
  deleteProject,
  getErrorStats,
  getCommonError,
  getLatestError,
  getErrorMethodPercentages
};
