import {Request, Response, NextFunction} from "express";
import {User, UserDocument} from "../models";
import {validateRegisterInput} from "../utils/validator";
import HttpException from "../exception/HttpException";
import {UNPROCESSABLE_ENTITY} from "http-status-codes";


export const register = async (req: Request, res: Response, next: NextFunction) => {
    const {username, password, confirmPassword, email} = req.body;
    try {
        const {valid, errors} = validateRegisterInput(username, password, confirmPassword, email)
        if (!valid) {
            throw new HttpException(UNPROCESSABLE_ENTITY, '用户提交的数据不正确', errors)
        }
        const oldUser:UserDocument | null = await User.findOne({username});
        if(oldUser) {
            throw new HttpException(UNPROCESSABLE_ENTITY, '用户名重复', errors)
        }
        const user:UserDocument = new User({username, password, confirmPassword, email})
        await user.save();
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next((error))
    }


}