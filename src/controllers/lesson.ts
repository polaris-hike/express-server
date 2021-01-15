import {Lesson, LessonDocument} from "../models";
import {Request,Response} from "express";

export const list = async (_req:Request,res:Response)=>{
  const lessons:LessonDocument[] = await Lesson.find();
  res.json({
    success:true,
    data:lessons
  })
}