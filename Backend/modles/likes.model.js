import mongoose from "mongoose";
import mongoos,{Schema} from "mongoose";

const likeSchema =new Schema({
    post:{
        type:mongoose.Types.ObjectId,
        ref:"Post",
        required:true,
        
    },
    likedBy:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        
    }
},{
    timestamps:true
})
const Like =mongoos.model("Like",likeSchema)
export default Like