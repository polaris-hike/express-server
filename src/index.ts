import express, {Express} from 'express';   // 启动服务
//import mongoose from 'mongoose'; // 用来连接数据库
import cors from 'cors';         // 解决跨域
import morgan from "morgan";     // 输出访问日志
import helmet from 'helmet';     // 安全过滤
//import multer from "multer";     // 上传头像
import 'dotenv/config';          // 读取 .env 然后写入 process.env
import path from "path";
import errorMiddleware from "./middleware/errorMiddleware";

const app:Express = express();
app.use(cors);
app.use(morgan('dev'));
app.use(helmet);
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json); // express.json = bodyParser.json
app.use(express.urlencoded({extended:true}));
app.get('/',(_req,res,_next)=>{
    res.send('hello world!');
});
app.use(errorMiddleware);
(async function() {
    /*await mongoose.set('useNewUrlParser',true);
    await mongoose.set('useUnifiedTopology',true);
    const MONGODB_URL = process.env.MONGODB_URL || `mongodb://localhost/wuxuwei`;
    await mongoose.connect(MONGODB_URL)*/
    const PORT = process.env.PORT || 8002;
    app.listen(PORT,()=>{
        console.log(`Running on http://localhost:${PORT}`)
    })
})()
