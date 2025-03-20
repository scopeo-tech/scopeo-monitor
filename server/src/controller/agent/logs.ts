import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Project from "../../model/projectModel";
import Log from "../../model/logModel";
import CustomError from "../../lib/util/CustomError";
import { AuthenticatedRequest} from "../../lib/types/type";
import checkProjectOwnership from "../../lib/util/checkProjectOwnership";
import { io } from "../../socket";

export const handleIncomingLogs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const apiKey = req.headers["x-api-key"] as string;
    const passKey = req.headers["x-pass-key"] as string;
  
    if (!apiKey || !passKey) {
      return next(new CustomError(401, "Unauthorized"));
    }
  
    const project = await Project.findOne({ apiKey, passKey });
    if (!project) {
      return next(new CustomError(404, "Project not found"));
    }
  
    const { logs } = req.body 
  
    if (!logs || !logs.length) {
      return next(new CustomError(400, "Missing required fields"));
    }
  
    for (const log of logs) {
      const { route, message, statusCode, level, method } = log;
      if (!route || !message || !statusCode || !level || !method) {
        return next(new CustomError(400, "Missing required fields from log entry"));
      }
    }
  
    try {
      for (const log of logs) {
        const { route, message, statusCode, level, method } = log;
        const logCount = await Log.countDocuments({ project: project._id });
        if (logCount >= 120) {
          const oldLogs = await Log.find({ project: project._id })
            .sort({ createdAt: 1 })
            .limit(20);
          const oldIds = oldLogs.map((log) => log._id);
          await Log.deleteMany({ _id: { $in: oldIds } });
        }
        
       const newLogs = await Log.create({
          route,
          message,
          statusCode,
          level,
          method,
          duration: log.duration,
          project: project._id
        });
        io.emit("logs", newLogs, project.user.toString());
      }

      
      return res.status(200).json({ status: "success" });
    } catch (error) {
      return next(new CustomError(500, "Failed to process logs"));
    }
  };

 const getTimeFilter = (filter: string) => {    
    switch (filter) {       
      case "1hour":
        return { createdAt: { $gte: new Date(new Date().getTime() - 60 * 60 * 1000) } };
      case "1day":
        return { createdAt: { $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) } };
      case "1week":
        return { createdAt: { $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000) } };
      case "1month":
        return { createdAt: { $gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000) } }; 
      case "All days":
        return {};
      default:
        return {}; 
    }
 }

 export const getLogs = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!(await checkProjectOwnership(req, next))) return;
    const { projectId } = req.params;
    const { filter } = req.query;
    
    if (!projectId) {
      return next(new CustomError(400, "Project ID is required"));
    }
    const dateFilter = getTimeFilter(filter as string);
    try {
      const logs = await Log.find({ 
        project: new mongoose.Types.ObjectId(projectId), 
        ...dateFilter 
      }).sort({ createdAt: -1 });
      return res.status(200).json({ 
        status: "success", 
        data: logs,
        count: logs.length
      });
    } catch (error) {
      console.error('Error fetching logs:', error);
      return next(new CustomError(500, "Failed to fetch logs"));
    }
  }

export const getRoutesFromDb= async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!(await checkProjectOwnership(req, next))) return;
  const { projectId } = req.params;
  if (!projectId) {
    return next(new CustomError(400, "Project ID is required"));
  }
  const routes = await Log.distinct("route", { project: new mongoose.Types.ObjectId(projectId) });
  return res.status(200).json(routes);
}


export const logsByRoutes = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!(await checkProjectOwnership(req, next))) return;
    const { projectId } = req.params;
    const {route } = req.query;
    if (!projectId) {
      return next(new CustomError(400, "Project ID is required"))
    }
    const logs = await Log.find({ 
      project: new mongoose.Types.ObjectId(projectId),
      route
    }).sort({ createdAt: -1 });
      return res.status(200).json(logs);
      }