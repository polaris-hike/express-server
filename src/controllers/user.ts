import {Request, Response, NextFunction} from "express";
import {User, UserDocument} from "../models";
import {validateRegisterInput} from "../utils/validator";
import HttpException from "../exception/HttpException";
import {UNPROCESSABLE_ENTITY,UNAUTHORIZED} from "http-status-codes";
import jwt from 'jsonwebtoken';
import {UserPayload} from '../typings/payload';

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
export const validate = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if(authorization){
        const access_token = authorization.split(' ')[1];
        if(access_token){
            try {
                const userPayload:UserPayload = jwt.verify(access_token,process.env.JWT_SECRET_KEY || 'zhufeng') as UserPayload;
                const user:UserDocument | null = await User.findById(userPayload.id);
                if(user){
                    res.json({
                        success:true,
                        data:user.toJSON()
                    })
                }else {
                    next(new HttpException(UNAUTHORIZED, '用户未找到'))
                }
            }catch (error) {
                next(new HttpException(UNAUTHORIZED, 'access_token 不合法'))
            }
        }else {
            next(new HttpException(UNAUTHORIZED, 'access_token 未提供'))
        }
    }else {
        next(new HttpException(UNAUTHORIZED, 'authorization 未提供'))
    }
}