import Post from "../modles/posts.model.js"
import cloudinayUpload from "../utils/cloudinary.js"
const newPosts = async (req,res) => {
   try {
     const user =req.user;
     const {title} =req.body;
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
   } catch (error) {
    console.log(error);
    
    return res.status(500).json({
        message: "internal server error"
    })
   }
}
export {newPosts}