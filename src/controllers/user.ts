import {Request, Response, NextFunction} from "express";
import {User, UserDocument} from "../models";
import {validateRegisterInput} from "../utils/validator";
import HttpException from "../exception/HttpException";
import {UNPROCESSABLE_ENTITY,UNAUTHORIZED} from "http-status-codes";


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

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const {username, password} = req.body;
    try {
        const user:UserDocument | null = await User.login(username,password);
        if(user){
            const access_token = user.getAccessToken();
            res.json({
                success: true,
                data: access_token
            });
        }else {
            throw new HttpException(UNAUTHORIZED, '登录失败')
        }
    } catch (error) {
        next((error))
    }
}