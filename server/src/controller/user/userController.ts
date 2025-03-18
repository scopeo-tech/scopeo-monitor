import { Response,NextFunction } from "express";
import { AuthenticatedRequest } from "../../lib/types/type";
import User from "../../model/userModel";
import bcrypt from "bcryptjs";
import Project from "../../model/projectModel";
import Contact from "../../model/contactModel";
import CustomError from "../../lib/util/CustomError";
import { sendContactEmail } from "../../services/emailService";

const getUserById = async (req:AuthenticatedRequest, res:Response, next:NextFunction) =>{
    const user = await User.findById(req.user,{password:0})
    if (!user){
        return next (new CustomError(404,"user not found"))
    }
    const Data = {
        _id : user._id,
        username:user.username,
        email:user.email,
        joinedDate : user.createdAt ,
        
    }
    res.status(200).json({status:"success", message:"UserDetails", Data})
}

const getProjectList = async (req:AuthenticatedRequest, res:Response, next:NextFunction) =>{
    const userId = req.user
    if(!userId){
        return next (new CustomError(404,"user not found"))
    }
    const projects = await Project.find({ user: userId }, { passKey: 0 });

  const totalProjects = projects.length

  res.status(200).json({
    status: "success",
    message: "Project list retrieved",
    totalProjects,  
    data: projects || [], 
  });
};

const getProjectById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { projectId } = req.params;
    const user = req.user;
    if (!projectId) {
      return next(new CustomError(404, "Project ID not provided"));
    }
    const project = await Project.findOne({ user, _id: projectId });
    if (!project) {
      return next(new CustomError(404, "Project not found"));
    }
    return res
      .status(200)
      .json({ status: "success", message: "Project found", data: {name:project.name,created:project.createdAt} });
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

const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    
    const user = await User.findById(req.user);

    if (!user) {
        return next(new CustomError(404, "User not found"));
    }

    const { currentPassword, newPassword,  username } = req.body;

    if (!currentPassword) {
        return next(new CustomError(400, "Current password is required"));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return next(new CustomError(400, "Incorrect password"));
    }

    if (!newPassword && !username) {
        return next(new CustomError(400, "At least one field (newPassword, username) is required to update"));
    }

    if (username && username !== user.username) {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return next(new CustomError(400, "Username is already taken"));
        }
        user.username = username;
    }

    if (newPassword) {
        user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    return res.status(200).json({
        status: "success",
        message: "Profile updated successfully",
        data: {
            _id: user._id,
            username: user.username,
            email: user.email,
        },
    });
};

const deleteProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params; 

    if (!userId) {
        return next(new CustomError(400, "User ID is required"));
    }

    const user = await User.findById(userId);

    if (!user) {
        return next(new CustomError(404, "User not found"));
    }

    await Project.deleteMany({ user: userId });

    await User.findByIdAndDelete(userId);

    res.status(200).json({
        status: "success",
        message: "Profile and all associated projects deleted successfully",
    });
};

const checkUsername = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { username } = req.params; 

    if (!username) {
        return next(new CustomError(400, "Username is required"));
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.status(200).json({status:"success", message:"Username is already taken", data:true });
    }

    return res.status(200).json({status:"success", message:"Username is available", data:false });
};


const contactUs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { firstname,lastname, email, message } = req.body;
    if (!firstname||!lastname || !email || !message) {
        return next(new CustomError(400, "All fields are required"));
    }
    const contactEntry = new Contact({
        firstname,
        lastname,
        email,
        message,
    });
    await contactEntry.save();
    try {
        await sendContactEmail(firstname,lastname, email, message);
        return res.status(200).json({ status: "success", message: "Email sent successfully" });
    } catch (error) {
        return next(new CustomError(500, "Email sending failed"));
    }
}



export {
    getUserById,
    getProjectList,
    getProjectById,
    getUserProjectCount,
    updateProfile,
    deleteProfile,
    checkUsername,
    contactUs
}