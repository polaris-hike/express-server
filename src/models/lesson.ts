import mongoose,{Schema,Model,Document} from 'mongoose';

export interface LessonDocument extends Document{
  order:number; // 顺序
  title:string; // 标题
  video:string; // 视频地址
  poster:string; // 海报地址
  url:string;  // url 地址
  price:string; // 价格
  category:string; // 分类
}

const LessonSchema:Schema<LessonDocument> = new Schema({
  order:Number,
  title:String, // 标题
  video:String, // 视频地址
  poster:String, // 海报地址
  url:String,  // url 地址
  price:String, // 价格
  category:String, // 分类
},{timestamps:true,toJSON:{
    transform:function (_doc:any,result:any) {
      result.id = result._id;
      delete result._id;
      delete result.__v;
      delete result.createdAt;
      delete result.updatedAt;
      return result;
    }
  }});

export const Lesson:Model<LessonDocument> = mongoose.model('Lesson',LessonSchema)