import {Lesson, LessonDocument} from "../models";
import {Request,Response} from "express";

export const list = async (req:Request,res:Response)=>{
  let {limit = 0,offset = 5,category = 'all'} = req.query;
  offset =  Number(offset);
  limit = Number(limit);
  let query:any = {};
  if(category && category !== 'all') {
    query.category = category
  }
  let total = await Lesson.count(query); // 符合查询条件的总条数
  const list:LessonDocument[] = await Lesson.find(query).sort({order:1}).skip(offset).limit(limit);
  res.json({
    success:true,
    data:{
      list,
      hasMore:total > offset + limit
    }
  })
}