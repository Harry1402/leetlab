
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import express from 'express';

import authRoutes from './routes/auth.routes.js'; 
import problemRoutes from './routes/problem.routes.js';  

dotenv.config();

const app = express();
         
app.use(express.json());
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/prob",problemRoutes)

app.get("/",(req,res)=>{
  res.send("Hello 😂");
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});