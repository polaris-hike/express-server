import mongoose,{Schema,Model,Document} from 'mongoose';
import bcryptjs from 'bcryptjs'
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
// 每次保存文档之前执行此操作
UserSchema.pre<UserDocument>('save',async function(next){
    if(!this.isModified('password')) {
        return next()
    }
    try {
        this.password = await bcryptjs.hash(this.password,10)
        next()
    }catch (error) {
        next(error)
    }
})

UserSchema.static('login',async function (this:any,username:string,password:string):Promise<UserDocument | null> {
    const user:UserDocument | null = await this.model('User').findOne({username});
    if(user){
        const matched = await bcryptjs.compare(password,user.password);
        if(matched){
            return user
        }else {
            return null
        }
    }else {
        return  null
    }
})
interface UserModel<T extends Document> extends Model <T>{
    login:(username:string,password:string)=>UserDocument | null
}
// @ts-ignore
export const User:UserModel<UserDocument> = mongoose.model<UserDocument,UserModel<UserDocument>>('User',UserSchema);