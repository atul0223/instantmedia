import mongoose from "mongoose";
import Like from "../modles/likes.model.js";
import Post from "../modles/posts.model.js";
import ApiError from "../utils/ApiError.js";
import User from "../modles/user.model.js";
const toggleLike =async(req,res)=>{
    const {like} =req.body;
    const user =req.user;
    const {postId} =req.params;
    
    if (!postId) {
        throw new ApiError(404,"post not found");
    }
    const postExists =await Post.findById(postId)
    if (!postExists) {
        throw new ApiError(404,"post not found");
    }
       const targetUser = await User.findById(postExists.publisher).select("blockedUsers");

        if (targetUser?.blockedUsers?.includes(user._id)) {
        throw new ApiError(403, "post not found");
        }
    if (like===true) {
        const alreadyLiked = await Like.findOne({ post: postId, likedBy: user });

        if (alreadyLiked) {
            return res.status(200).json({ message: "Already liked" });

        }
        else{const likee=await Like.create({
            post:postExists,
            likedBy:user
        })
        return res.status(200).json({
            message :"successfully liked"
        })}
        
    }
    else {
     const alreadyLiked = await Like.findOne({ post: postId, likedBy: user });

        if (!alreadyLiked) {
            return res.status(200).json({ message: "Already unliked" });

        }
        else{
            await Like.findOneAndDelete({
            post:postExists,
            likedBy:user
        })
        return res.status(200).json({
            message :"successfully unliked"
        })}
    }
}
const likeCountAndList =async(req,res)=>{
    const {postId} =req.params;
    const user=req.user;
    
    if (!postId) {
        throw new ApiError(404,"post not found");
        
    }
    const postExists =await Post.findById(postId)
    if (!postExists) {
        throw new ApiError(404,"post not found");
        
    }
     const targetUser= await User.findById(postExists.publisher).select("blockedUsers");

        if (targetUser?.blockedUsers?.includes(user._id)) {
        throw new ApiError(403, "post not found");
        }
    
    const postLikes =await Post.aggregate([
       {$match:{
   _id: new ObjectId("687168f33bc187c665b9639f")
  }},
   {
     $lookup: {
       from:"likes",
       localField:"_id",
       foreignField:"post",
       as:"likesDoc"
     }
   },
   {
   $addFields: {
  likesCount: { $size: "$likesDoc" },
  isLiked: {
    $in: [
     new ObjectId(req.user._id),
      {
        $map: {
          input: "$likesDoc",
          as: "like",
          in: "$$like.likedBy"
        }
      }
    ]
  }


    }
   },

   {
    $project:{
        likesDoc:1,
        likesCount:1,
        isLiked:1
    }
   }
    ])
    
    if (postLikes.length === 0) {
        throw new ApiError(404,"post not found");
    }
    return res.status(200).json({
        message:"successfully fetched",
        likes:postLikes[0]

    })
}
export {toggleLike ,likeCountAndList}