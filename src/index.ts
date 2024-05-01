import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors'
import "./config/mongoose";
import { connectDb } from './config/mongoose';
import router from './router';
connectDb();
const app = express();

app.use(cors({
    credentials: true
}));
app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())



app.use('/', router())
app.listen(2020, () => {
    console.log('server is running on port 2020')
})

