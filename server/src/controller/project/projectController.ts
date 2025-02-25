import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../lib/types/type";
import Project from "../../model/projectModel";
import CustomError from "../../lib/util/CustomError";
import crypto from "crypto";

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

  

export {
  getApiKey,
  getPassKey,
  createProject,
  getProjectPassKey,
  updateProjectStatus,
  flagOldStatuses
};
