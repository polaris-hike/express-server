import express, {Express, Request,Response,NextFunction} from 'express';   // 启动服务
import mongoose from 'mongoose'; // 用来连接数据库
/*import cors from 'cors';         // 解决跨域
import morgan from "morgan";     // 输出访问日志
import helmet from 'helmet';  */   // 安全过滤
import multer from "multer";     // 上传头像
import path from "path";
import 'dotenv/config';          // 读取 .env 然后写入 process.env
import errorMiddleware from "./middleware/errorMiddleware";
import HttpException from "./exception/HttpException";
import {Slider} from "./models";
import * as UserController from './controllers/user'
import * as SliderController from './controllers/slider'
import bodyParser from "body-parser";


// 指定上传文件的存储空间
const storage = multer.diskStorage({
    // 指定上传的目录
    destination: path.join(__dirname,'public','uploads'),
    filename(_req:Request,file:Express.Multer.File,callback) {
        callback(null,Date.now()+path.extname(file.originalname))
    }
});
const upload =multer({storage})

const app:Express = express();
/*app.use(cors);
app.use(morgan('dev'));
app.use(helmet);*/
/*app.use(express.static(path.join(__dirname,'public')));*/
app.use(express.static(path.join(__dirname,'public')));
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With');
    res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
    res.header('X-Powered-By', '3.2.1')
    if(req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
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
app.post('/user/uploadAvatar',upload.single('avatar'), UserController.uploadAvatar)

app.get('/sliders/list',SliderController.list)

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
    await mongoose.connect(MONGODB_URL);
    await createInitialSliders();
    const PORT = process.env.PORT || 8003;
    app.listen(PORT,()=>{
        console.log(`Running on http://localhost:${PORT}`)
    })
})()

async function createInitialSliders() {
    const sliders = await Slider.find();
    if(sliders.length === 0) {
        const sliders = [
            {
                url:'https://imgsa.baidu.com/forum/w%3D580/sign=815c232d5f3d26972ed3085565fab24f/940b0ff2d7ca7bcb2bf6d9c8b0096b63f724a84a.jpg',
            },
            {
                url:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2805577034,826713399&fm=26&gp=0.jpg',
            },
            {
                url:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3665917667,4181822611&fm=26&gp=0.jpg',
            }
        ]
        await Slider.create(sliders)
    }
}