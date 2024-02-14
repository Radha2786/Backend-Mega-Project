// require ('dotenv').config({path: './env})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
dotenv.config({
    path: './.env'
})

connectDB().then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`listening on port ${process.env.PORT}`);
        app.on("error",(error)=>{
            console.log("ERR", error);
            throw error 
        })
    })
})
.catch((err)=>{
    console.log("Mongodb connection failed!" ,err);
})