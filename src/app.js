import express  from "express";
import cors from "cors"
import cookieParser from "cookie-parser"; // server se user ke browser ki cookies ko access bhi kar paaye and set bhi kar paye 

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN, // KIS ORIGIN SE REQUEST ALLOW KARNI HAI
    credentials: true
}));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"})) // url se data lene ke liye
app.use(express.static("public"));
app.use(cookieParser())
// extended true se hum object ke andar object de skte hain

// importing routes 
import userRouter from "./routes/user.routes.js";

// router declaration
app.use("/api/v1/users",userRouter);

// http://localhost:3000/api/v1/users/register

export default app ;