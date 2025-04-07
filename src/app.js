import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(cors({
  origin:process.env.CORS_ORIGIN ,
  credentials:true
}))
app.use(express.json({limit:"16kb"})) // used for data of json files
app.use(express.urlencoded({
    extented:true,limit:"16kb"})) // kisi url me jo characters aate hai wo iske through aate hai
app.use(express.static("public"))  // ye config jb hm koi images wagaira rkhte hai uske liyee hai aur public jo hi wo folder ka name hai 
app.use(cookieParser) 
export{ app }
