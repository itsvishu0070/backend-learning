import mongoose, {Schema} from "mongoose"

const subscriptionschema = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    channel:{ 
        type:Schema.Types.ObjectId,
        ref:"user"
    }

},{timestamps:true})


export const subscription = mongoose.model("subscription",subscriptionschema)