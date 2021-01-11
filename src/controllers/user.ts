import {Request,Response,NextFunction} from "express";
import {User} from "../models";

export const register = async (req:Request,res:Response,_next:NextFunction)=>{
    const {username , password , confirmPassword, email} = req.body;
    const user = new User({username , password , confirmPassword, email})
    await user.save();
    res.json({
        success:true,
        data:user
    });
}