import mongoose,{Schema} from "mongoose"
const msgSchema =new Schema({
    sender:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        trim:true
    },
    chat:{
        type:mongoose.Types.ObjectId,
        ref:"Chat"
    }
},{
    timestamps:true
});
 const Message = mongoose.model("Message",msgSchema)

 export default Message