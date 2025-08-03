import mongoose from "mongoose";
import Like from "../modles/likes.model.js";
import Post from "../modles/posts.model.js";
import ApiError from "../utils/ApiError.js";
import User from "../modles/user.model.js";
const toggleLike = async (req, res) => {
  const { like } = req.body;
  const user = req.user;
  const { postId } = req.params;

  if (!postId) {
    throw new ApiError(404, "post not found");
  }
  const postExists = await Post.findById(postId);
  if (!postExists) {
    throw new ApiError(404, "post not found");
  }
  const targetUser = await User.findById(postExists.publisher).select(
    "blockedUsers"
  );

  if (targetUser?.blockedUsers?.includes(user._id)) {
    throw new ApiError(403, "post not found");
  }
  if (like === true) {
    const alreadyLiked = await Like.findOne({ post: postId, likedBy: user });

    if (alreadyLiked) {
      return res.status(200).json({ message: "Already liked" });
    } else {
      const likee = await Like.create({
        post: postExists,
        likedBy: user,
      });
      return res.status(200).json({
        message: "successfully liked",
      });
    }
  } else {
    const alreadyLiked = await Like.findOne({ post: postId, likedBy: user });

    if (!alreadyLiked) {
      return res.status(200).json({ message: "Already unliked" });
    } else {
      await Like.findOneAndDelete({
        post: postExists,
        likedBy: user,
      });
      return res.status(200).json({
        message: "successfully unliked",
      });
    }
  }
};

export { toggleLike };
