//require('dotenv').config({path:'./env'})
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { app } from './app.js'; // Yeh line missing hai

import connectDB from "./db/index.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Yahan tu clearly .env file ka path de raha hai
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("MONGODB_URI:", process.env.MONGODB_URI);  // Testing line

connectDB()

.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running at port :${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO DB connection failed !!!",err);
})




























/* one of the approach of connecting database

import express from "express"
const app = express()
(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERRR:",error);
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`app is listning on port ${process.env.PORT}`);
        })
    } catch(error){
        console.log("error:",error)
        throw err
    }
})()
    */