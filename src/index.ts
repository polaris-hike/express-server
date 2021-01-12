import express, {Express, Request,Response,NextFunction} from 'express';   // 启动服务
import mongoose from 'mongoose'; // 用来连接数据库
/*import cors from 'cors';         // 解决跨域
import morgan from "morgan";     // 输出访问日志
import helmet from 'helmet';  */   // 安全过滤
//import multer from "multer";     // 上传头像
//import path from "path";
import 'dotenv/config';          // 读取 .env 然后写入 process.env
import errorMiddleware from "./middleware/errorMiddleware";
import HttpException from "./exception/HttpException";
import * as UserController from './controllers/user'
import bodyParser from "body-parser";
const app:Express = express();
/*app.use(cors);
app.use(morgan('dev'));
app.use(helmet);*/
/*app.use(express.static(path.join(__dirname,'public')));*/

app.all('*', function(_req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.get('/',(_req,res,_next)=>{
    res.json({
        success:true,
        data:'hello world'
    });
});
// 注册接口
app.post('/user/register',UserController.register);
// 登录接口
app.post('/user/login',UserController.login);
app.get('/user/validate',UserController.validate)
// 没有匹配到任何路由，则创建一个自定义404错误对象并传递给错误处理中间件
app.use((_req:Request,_res:Response,next:NextFunction)=>{
    const error:HttpException = new HttpException(404,'尚未为此路径分配路由')
    next(error)
});
app.use(errorMiddleware);
(async function() {
    await mongoose.set('useNewUrlParser',true);
    await mongoose.set('useUnifiedTopology',true);
    const MONGODB_URL = process.env.MONGODB_URL || `mongodb://localhost/wuxuwei`;
    await mongoose.connect(MONGODB_URL)
    const PORT = process.env.PORT || 8002;
    app.listen(PORT,()=>{
        console.log(`Running on http://localhost:${PORT}`)
    })
})()
