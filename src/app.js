import express  from "express";
import cors from "cors"
import cookieParser from "cookie-parser"; // server se user ke browser ki cookie ko access bhi kar paaye and set bhi kar paye 

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN, // KIS ORIGIN SE REQUEST ALLOW KARNI HAI
    credentials: true
}));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"));
app.use(cookieParser())
// extended true se hum object ke andar object de skte hain

export default app ;