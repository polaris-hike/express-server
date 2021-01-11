import mongoose,{Schema,Model,Document} from 'mongoose';
import validator from "validator";

export interface UserDocument extends Document{
    username:string,
    password:string,
    email:string,
    avatar:string
}

const UserSchema:Schema<UserDocument> = new Schema({
    username:{
        type:String,
        required:[true,'用户名不能为空'],
        minlength:[6,'最小长度不能小于6位'],
        maxlength:[12,'最大长度不能大于12位']
    },
    password:String,
    avatar:String,
    email:{
        type:String,
        validate:{
          validator:validator.isEmail
        },
        trim:true
    }
},{timestamps:true});

export const User:Model<UserDocument> = mongoose.model<UserDocument>('user',UserSchema);