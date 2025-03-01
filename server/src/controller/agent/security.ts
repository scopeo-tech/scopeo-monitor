import { Request, Response, NextFunction } from "express";
import Project from "../../model/projectModel";
import Security from "../../model/securityModel";
import CustomError from "../../lib/util/CustomError";
import { SecurityLogPayload } from "../../lib/types/type";

const handleIncomingSecurity = async (
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

  const security = req.body as SecurityLogPayload;

  if (!security) {
    return next(new CustomError(400, "Missing required fields"));
  }

  await Security.create({ project: project._id, ...security });
};


export {handleIncomingSecurity}