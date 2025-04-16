// ye verify karega ki user hai ya nhi hai

import { api_error } from "../utils/api_error.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import {user} from "../models/user.model.js"

export const verifyjwt = asynchandler(async(req, res ,next)=>{
   try {
    const token = req.cookies?.accesstoken || req.header("authorization")?.replace("Bearer","")
 
    if(!token){
    throw new api_error(401,"unauthorized request")
    }
    
   const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
   
   const User = await user.findById(decodedtoken?._id).select("-password - refreshtoken")
 
   if(!User){
     //
     throw new api_error(401,"invalid access token")
   }
   req.User=User;
   next()
 
   } catch (error) {
    throw new api_error(401, error?.message || "invalid access token")
   }
})