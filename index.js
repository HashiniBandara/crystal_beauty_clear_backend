import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import verifyJWT from './middleware/auth.js';
import orderRouter from './routes/orderRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import cors from 'cors';
import dotenv from 'dotenv'; 
import reviewRouter from './routes/reviewRouter.js';

dotenv.config();

const app = express();

app.use(cors());

mongoose.connect(process.env.MONGO_URL).then(
    ()=>{
        console.log("Connected to the database");
    }
).catch(
    ()=>{
        console.log("Connection failed");
    }
)




app.use(bodyParser.json());
app.use(verifyJWT)


app.use("/api/user",userRouter)
app.use("/api/product",productRouter)
app.use("/api/order",orderRouter)
app.use("/api/categories", categoryRouter)
app.use("/api/review", reviewRouter);


app.listen(3000, 
    ()=>{
        console.log("Server is running on port 3000");
    }
)