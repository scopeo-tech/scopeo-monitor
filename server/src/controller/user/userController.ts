import { Response,NextFunction } from "express";
import { AuthenticatedRequest } from "../../lib/types/type";
import User from "../../model/userModel";
import CustomError from "../../lib/util/CustomError";

const getUserById = async (req:AuthenticatedRequest, res:Response, next:NextFunction) =>{
    const user = await User.findById(req.user)
    if (!user){
        return next (new CustomError(404,"user not found"))
    }
    res.status(200).json({status:"success", message:"UserDetails", Data:user})
}

export {getUserById}