import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB= async() =>{
    try{
const connectionInstance = await mongoose.connect
(`${process.env.MONGODB_URI}/${DB_NAME}`)
console.log(`\n mongodb connected !! db host :${connectionInstance.connection.host}`);
    }
    catch(error){
        console.log("mongo db connection error:",error);
        process.exit(1); // we could have used throw error also

    }
}

export default connectDB