import { Response,NextFunction } from "express";
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

const getApiKey = async (req:AuthenticatedRequest, res: Response, next: NextFunction) => {
    const apiKey = generateApiKey();
    return res.status(200).json({ status: "success", message: "API key generated", data:apiKey });
};

const getPassKey = async (req:AuthenticatedRequest, res: Response, next: NextFunction) => {
    const passKey = generatePassKey();
    return res.status(200).json({ status: "success", message: "Pass key generated", data:passKey });
};

const createProject = async (req:AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { name, apiKey, passKey ,notificationStatus} = req.body;
    if(!name || !apiKey || !passKey) {
        return next(new CustomError(400, "Missing required fields"));
    }
    const user = req?.user;
    if(!user) {
        return next (new CustomError(400, "User not found"));
    }
    await Project.create({ name, 
        user, notificationStatus, apiKey, passKey });
    return res.status(201).json({ status: "success", message: "Project created" });
};


export { getApiKey, getPassKey , createProject };
