import {Request,Response,NextFunction} from "express";
import HttpException from "../exception/HttpException";
import {INTERNAL_SERVER_ERROR} from "http-status-codes";

const errorMiddleware = (err:HttpException,_req:Request,res:Response,_next:NextFunction)=>{
    res.status(err.status ||INTERNAL_SERVER_ERROR).json({
        success:false,
        message:err.message,
        errors:err.errors
    })
}

export default errorMiddleware;