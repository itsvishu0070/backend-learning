import {asynchandler} from "../utils/asynchandler.js"
import {api_error} from "../utils/api_error.js"
import { user} from "../models/user.model.js"
import {upload_on_cloudinary} from "../utils/cloudinary.js"
import {api_response} from "../utils/api_response.js"
import jwt from "jsonwebtoken"
const generate_access_and_refresh_tokens=async(userId)=>{
try {
  const User = await user.findById(userId)
  const accesstoken = User.generateAcsessToken()
  const refreshtoken = User.generateRefreshToken()

  User.refreshtoken = refreshtoken
  await User.save({validateBeforeSave: false})
  return {accesstoken,refreshtoken}
} 
catch (error) {
    throw new api_error(500,"something went wrong while generating access and refresh token")
}
}

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

 const existeduser = await user.findOne({
    $or:[{username},{email}]
  })
  
  if(existeduser){
    throw new api_error(409,"user with email or username already exist")
  }

   console.log(req.files);

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
  
 const User = await user.create({
    fullname,
    avatar:avatar.url,
    coverimage:coverimage?.url || "",
    email,
    password,
    username:username.toLowerCase()
  })

  // checking wether user is created or not and removing password and refreshtoke

  const createduser = await user.findById(User._id).select(
    "-password -refreshtoken"
  )

  if(!createduser){
    throw new api_error(500,"something went wrong while registering the user")

  }

  return res.status(201).json(
    new api_response(200,createduser,"user registered successfully")
  )



})

const loginuser = asynchandler(async(req,res)=>{
        // req body ->data
        //username or email
        //find the user
        //password check
        //access and refresh token
        // send cookies

        const {email,username ,password} = req.body

        if(!username && !email){
          throw new api_error(400,"username or email is required")
        }
        
        //here is an alternative of code based on logic discusses in video:
        //if(!(username||email)){
        // throw new api_error(400,"username or email is  required")
        //}

        const User = await user.findOne({
          $or:[{username},{email}]
        })

        if(!User){
          throw new api_error(404,"user does not exist")
        }

        const ispasswordvalid  =  await User.isPasswordCorrect(password)

        if(!ispasswordvalid ){
          throw new api_error(401,"incorrect password")
        }

      const {accesstoken,refreshtoken}  = await generate_access_and_refresh_tokens(User._id)
      
      const loggedInUser = await user.findById(User._id)
      .select("-password -refreshtoken")

      const options= {
        httpOnly:true,
        secure:true
      }

      return res.
      status(200).
      cookie("accesstoken",accesstoken,options)
      .cookie("refreshtoken",refreshtoken,options)
      .json(
        new api_response(
          200,
          {
            User : loggedInUser ,accesstoken,
            refreshtoken
          },
          "user logged in successfully"
        )
      )


})  
      
const logoutuser = asynchandler(async(req,res)=>{
          await user.findByIdAndUpdate(
            req.User._id,
            {
              $set:{
                refreshtoken:undefined
              }
            },
            {
              new:true
            }
           )
           const options= {
            httpOnly:true,
            secure:true
          }
          return res
          .status(200)
          .clearCookie("accesstoken",options)
          .clearCookie("refreshtoken",options)
          .json(new api_response(200,{},"user logged out"))
})

const refreshaccesstoken= asynchandler( async(req,res)=>{
  const incomingrefreshtoken =  req.cookies.
  refreshtoken || req.body.refreshtoken

  if(!incomingrefreshtoken){
    throw new api_error(401,"unauthorized request")
  }
  
 try {
  const decodedtoken = jwt.verify(
     incomingrefreshtoken,
     process.env.REFRESH_TOKEN_SECRET
   )
 
  const User = await user.findById(decodedtoken?._id)
 
  if(!User){
   throw new api_error(401,"invalid refreshtoken")
 }
 
 if(incomingrefreshtoken!=User.refreshtoken){
   throw new api_error(401,"refresh token is expired or used")
 }
 
 const options={
   httpOnly:true,
   secure:true
 }
 
 const {accesstoken,newrefreshtoken} = await 
 generate_access_and_refresh_tokens(User._id)
 
 return res
 .status(200)
 .cookie("accesstoken",accesstoken,options)
 .cookie("refreshtoken",newrefreshtoken,options)
 .json(
   new api_response(
         200,
         {accesstoken ,  refreshtoken:newrefreshtoken},
         "access token refreshed"
        
       )
    )
 } catch (error) {
      throw new api_error(401,error?.message || "invalid refresh token")
 }
}) 

const changecurrentpassword = asynchandler(async(req,res)=>{
const {oldpassword , newpassword} = req.body 

const User = await user.findById(req.User?._id)
const isPasswordCorrect=await User.isPasswordCorrect(oldpassword)

if(!isPasswordCorrect){
  throw new api_error(400,"incorrect password")
}

User.password = newpassword
await User.save({validateBeforeSave:false})

return res
.status(200)
.json(new api_response(200,{},"password changed successfully"))

}) 

const getcurrentuser = asynchandler(async(req,res)=>{
  return res
  .status(200)
  .json( new api_response(200,req.user,"current user fetched successfully" ))
})

const updateaccountdetails = asynchandler(async(req,res)=>{
      const {fullname , email} = req.body
      if(!(fullname || email)){
        throw new api_error(400,"all fields are required")
      }

      const User = await user.findByIdAndUpdate(
        req.user?._id,
        {
          $set:{
            fullname,
            email:email
          }

        },
        {new:true}

      ).select("-password")

      return res
      .status(200)
      .json(new api_response(200,"account details updated successfully"))
})

const updateavatar = asynchandler(async(req,res)=>{
  const avatarlocalpath= req.file?.path
  
  if(!avatarlocalpath){
    throw new api_error(400,"avatar file is missing")
  }
  
  const avatar = await upload_on_cloudinary
  (avatarlocalpath)

  if(!avatar.url){
    throw new api_error(400,"error while uploading on avatar")
  }

  const User = await user.findByIdAndUpdate(
    req.User?._id,
    {
      $set:{
        avatar:avatar.url
      }
    },
    {new:true}

  ).select ("-password")

  return res
  .status(200)
  .json(
    new api_response(200,User," avatar updated successfully")
  )

})

const updatecoverimage = asynchandler(async(req,res)=>{
  const coverimagelocalpath= req.file?.path
  
  if(!coverimagelocalpath){
    throw new api_error(400,"coverimage file is missing")
  }
  
  const coverimage = await upload_on_cloudinary
  (coverimagelocalpath)

  if(!coverimage.url){
    throw new api_error(400,"error while uploading on coverimage")
  }

 const User = await user.findByIdAndUpdate(
    req.User?._id,
    {
      $set:{
        coverimage:coverimage.url
      }
    },
    {new:true}

  ).select ("-password")
  
  return res
  .status(200)
  .json(
    new api_response(200,User," cover image updated successfully")
  )

})

export {registeruser,
  loginuser,
  logoutuser,
  refreshaccesstoken,
  changecurrentpassword,
  getcurrentuser,
  updateaccountdetails,
  updateavatar,
  updatecoverimage
}