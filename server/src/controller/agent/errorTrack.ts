import { NextFunction, Request, Response } from "express";
import CustomError from "../../lib/util/CustomError";
import Project from "../../model/projectModel";
import Error from "../../model/errorModel";
import {ErrorLogPayload} from "../../lib/types/type"
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
