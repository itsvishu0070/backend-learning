import {asynchandler} from "../utils/asynchandler.js"
import {api_error} from "../utils/api_error.js"
import {user} from "../models/user.model.js"
import {upload_on_cloudinary} from "../utils/cloudinary.js"
import {api_response} from "../utils/api_response.js"

const registeruser = asynchandler(async(req,res)=>{
    // steps to keep in mind while creating user

    // get user details from front end
    // validation :- not empty
    // check if user already exists:username,email
    // check for images,check for avatar\
    // upload them to cloudinary,avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    //return res
 
    // yaha par directly hm bs json data hi kr handle kar skte hai lein file handle nhi kr skte 
    // file  handling ke liye hm multer ka use krenge

  const {fullname ,email ,username ,password } = req.body
  console.log("email:",email);  
  
  
  // if(fullname===""){
  //    throw new api_error(400,"full name is required") 
  // }

  // if we want then we can check for api error for each field like name,email,etc one by one
  //or we can use the below method

  if(
    [fullname,email,username,password].some((field)=>field.trim()==="")
  ){
     throw new api_error(400,"all fields are required")
  }

 const existeduser = user.findOne({
    $or:[{username},{email}]
  })
  
  if(existeduser){
    throw new api_error(409,"user with email or username already exist")
  }

  const avatarlocalpath = req.files?.avatar[0]?.path;
  const coverimagelocalpath = req.files?.coverimage[0]?.path;

  if(!avatarlocalpath){
    throw new api_error(400,"avatar file is required")
  }

  const avatar = await upload_on_cloudinary(avatarlocalpath)
  const coverimage = await upload_on_cloudinary(coverimagelocalpath)
  
  if(!avatar){
    throw new api_error(400,"avatar file is required")
  }

  // if everything is correct then create a user and make entry in database 
  
 const user = await user.create({
    fullname,
    avatar:avatar.url,
    coverimage:coverimage?.url || "",
    email,
    password,
    username:username.toLowerCase()
  })

  // checking wether user is created or not and removing password and refreshtoke

  const createduser = await user.findById(user._id).select(
    "-password -refreshtoken"
  )

  if(!createduser){
    throw new api_error(500,"something went wrong while registering the user")

  }

  return res.status(201).json(
    new api_response(200,"user registered successfully")
  )



})

export {registeruser}