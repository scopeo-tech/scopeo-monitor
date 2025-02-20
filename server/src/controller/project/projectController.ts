import { Request, Response,NextFunction } from "express";
import Project from "../../model/projectModel";
import crypto from "crypto";

const generateApiKey = () => {
    return crypto.randomBytes(16).toString("hex");
};
const generatePassKey = () => {
    return crypto.randomBytes(16).toString("hex");
};

const getApiKey = async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = generateApiKey();
    return res.status(200).json({ status: "success", message: "API key generated", data:apiKey });
};

const getPassKey = async (req: Request, res: Response, next: NextFunction) => {
    const passKey = generatePassKey();
    return res.status(200).json({ status: "success", message: "Pass key generated", data:passKey });
};

const createProject = async (req: Request, res: Response, next: NextFunction) => {
    const { name, apiKey, passKey ,notificationStatus} = req.body;
    const user = req?.user;
    const project = await Project.create({ name, 
        user, notificationStatus, apiKey, passKey });
    return res.status(201).json({ status: "success", message: "Project created" });
};


export { getApiKey, getPassKey , createProject };
