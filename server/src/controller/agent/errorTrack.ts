import { NextFunction, Request, Response } from "express";
import CustomError from "../../lib/util/CustomError";
import Project from "../../model/projectModel";
import Error from "../../model/errorModel";
import {ErrorLogPayload} from "../../lib/types/type"
export const handleIncomingError = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
console.log("hi")
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

  const errorLog = new Error({
    projectId: project._id,
    statusCode,
    method,
    route,
    message
  });

  await errorLog.save();

};
