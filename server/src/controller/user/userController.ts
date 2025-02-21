import { Response,NextFunction } from "express";
import { AuthenticatedRequest } from "../../lib/types/type";
import User from "../../model/userModel";
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
        joinedDate : user.createdAt 
    }
    res.status(200).json({status:"success", message:"UserDetails", Data})
}

export {getUserById}