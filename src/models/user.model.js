import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userschema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
            
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
            
        },
        avatar:{
            type:String,
            required:true,
            
        },
        coverimage:{
            type:String,
            
            
        },
        watch_history:[
            {
               type:Schema.Types.ObjectId 
            }
        ],
        password:{
            type:String,
            required:[true,'password in required']
        },
        refreshtoken:{
            type:String
        }

        
        


    } ,
    {
      timestamps  : true
    }

)
userschema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10)
    next()
}
)

userschema.methods.isPasswordCorrect= async function (password) {
    return await bcrypt.compare(password,this.password)
}
userschema.methods.generateAcsessToken = function(){
    jwt.sign(
    {
     _id:this._id ,
     email:this.email,
     username:this.username,
     fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_SECRET
    }
)
}
userschema.methods.generateRefreshToken = function(){
    jwt.sign(
        {
         _id:this._id 
        
         
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_SECRET 
        }
    )
}
export const user = mongoose.model("user",userschema)