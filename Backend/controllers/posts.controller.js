
import Post from "../modles/posts.model.js"
import ApiError from "../utils/ApiError.js";
import cloudinayUpload from "../utils/cloudinary.js"
import { v2 as cloudinary } from "cloudinary";
const extractPublicId = (url) => {
  try {
    const regex = /\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z]+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (err) {
    console.error("Failed to extract public_id from URL:", url);
    return null;
  }
};
const newPosts = async (req,res) => {
   
    const {user} =req.params;
     const userX =req.user;
     const {title} =req.body;
     if (userX.username !==user) {
      throw new ApiError(403,"Forbidden Bad request")
     }
      const localFilePath = req.files?.post?.[0]?.path;
     if (!localFilePath) {
         throw new ApiError(402,"please provide a picture");
         
     }
     const upload =await cloudinayUpload(localFilePath)
     if (!upload) {
         throw new ApiError(500,"Error while uploading to cloudinary");
     }
     const post = await Post.create({
         title :title||Date(),   
         post :upload?.secure_url,
         publisher:user
 })
 return res.status(200).json({
     message:"successfully posted"
 })
   
}
    const deletePost = async (req, res) => {
 
    const user = req.user;
    const postId = req.params.postid;

    const selectedPost = await Post.findById(postId);
    if (!selectedPost) throw new ApiError(404, "Post not found");

    if (selectedPost.publisher.toString() !== user._id.toString()) {
      throw new ApiError(403, "Not authorized for this action");
    }

    const publicId = extractPublicId(selectedPost.post);

    const deleted = await Post.findOneAndDelete({ _id: postId });
    if (!deleted) throw new ApiError(500, "Error while deleting the post");

    await cloudinary.uploader.destroy(publicId);

    return res.status(200).json({ message: "Successfully deleted post" });

  
};
export {newPosts, deletePost}