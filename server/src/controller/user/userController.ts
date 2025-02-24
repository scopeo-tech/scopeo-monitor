import { Response,NextFunction } from "express";
import { AuthenticatedRequest } from "../../lib/types/type";
import User from "../../model/userModel";
import Project from "../../model/projectModel";
import CustomError from "../../lib/util/CustomError";

const getUserById = async (req:AuthenticatedRequest, res:Response, next:NextFunction) =>{
    const user = await User.findById(req.user,{password:0})
    if (!user){
        return next (new CustomError(404,"user not found"))
    }
    const Data = {
        user : user._id,
        username:user.username,
        email:user.email,
        joinedDate : user.createdAt ,
        
    }
    res.status(200).json({status:"success", message:"UserDetails", Data})
}

const getProjectList = async (req:AuthenticatedRequest, res:Response, next:NextFunction) =>{
    const userId=req.user

    if(!userId){
        return next (new CustomError(404,"user not found"))
    }
    const projects = await Project.find({ user: userId });
  const totalProjects = projects.length

  res.status(200).json({
    status: "success",
    message: "Project list retrieved",
    totalProjects,  
    data: projects || [], 
  });
};

const getUserProjectCount = async (req:AuthenticatedRequest, res:Response, next:NextFunction) =>{
    const userId=req.user

    if(!userId){
        return next (new CustomError(404,"user not found"))
    }
    const totalProjects = await Project.countDocuments({ user: userId });

  res.status(200).json({
    status: "success",
    message: "Project count retrieved",
    data:  totalProjects
  });
};

export {getUserById,getProjectList,getUserProjectCount}