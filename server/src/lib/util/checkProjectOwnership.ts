import { NextFunction } from "express";
import { AuthenticatedRequest } from "../types/type";
import CustomError from "./CustomError";
import Project from "../../model/projectModel";

 const checkProjectOwnership = async (
    req: AuthenticatedRequest,
    next: NextFunction
  ): Promise<boolean | void> => {
    const { projectId } = req.params;
    const userId = req.user;
  
    if (!projectId || !userId) {
      return next(new CustomError(400, 'Project ID and user are required'));
    }

    const project = await Project.findOne({ _id: projectId });
  
    if (!project) {
      return next(new CustomError(403, 'Unauthorized: You do not own this project'));
    }
  
    return true;
  };

  export default checkProjectOwnership;