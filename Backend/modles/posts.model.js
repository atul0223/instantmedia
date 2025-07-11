import mongoose,{Schema} from "mongoose";
const postSchema = new Schema({
    title:{
        type:String,
       default:Date()
    },
    post:{
        type:String,
        required:true
    },
    publisher:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    }
},{
    timestamps:true
});
const Post = mongoose.model("Post",postSchema)
export default Post;