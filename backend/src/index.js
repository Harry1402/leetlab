
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import express from 'express';

import authRoutes from './routes/auth.routes.js';  

dotenv.config();

const app = express();



app.use(express.json());
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/v1/auth",authRoutes)

app.get("/",(req,res)=>{
  res.send("ello 😂");
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});