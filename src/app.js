
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express();

app.use(cors({
  origin:process.env.CORS_ORIGIN ,
  credentials:true
}))
app.use(express.json({limit:"16kb"})) // used for data of json files
app.use(express.urlencoded({
    extended:true,limit:"16kb"})) // kisi url me jo characters aate hai wo iske through aate hai
app.use(express.static("public"))  // ye config jb hm koi images wagaira rkhte hai uske liyee hai aur public jo hi wo folder ka name hai 
app.use(cookieParser())

// routes import 

import userrouter from './routes/user.routes.js'

// routes declaration
app.use("/api/v1/users",userrouter)

//https:localhost:8000/api/v1/users/register

export{ app }