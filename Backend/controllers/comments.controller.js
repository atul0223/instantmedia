import ApiError from "../utils/ApiError.js";
import Post from "../modles/posts.model.js";
import Comment from "../modles/comments.model.js";

import User from "../modles/user.model.js";
import mongoose from "mongoose";
const addComment = async (req, res) => {
  const { inputComment } = req.body;
  const { postId } = req.params;
  const user = req.user;

  if (!postId) {
    throw new ApiError(404, "Post not found");
  }
  if (!inputComment || inputComment.trim() === null) {
    throw new ApiError(401, "comment cant be empty");
  }
  const postExists = await Post.findById(postId);
    const isBlocked = await User.findById(postExists.publisher).select("blockedUsers");
  
          if (isBlocked?.blockedUsers?.includes(user._id)) {
          throw new ApiError(403, "post not found");
          }
  if (!postExists) {
    throw new ApiError(404, "Post not found");
  }
  const createComment = await Comment.create({
    post: postId,
    commenter: user,
    comment: inputComment,
  });
  if (!createComment) {
    throw new ApiError(500, "internal server error");
  }
  return res.status(200).json({
    message: "successfully commented",
    comment: createComment.comment,
  });
};

const deleteComments = async (req, res) => {
const commentId = req.params.commentId;
console.log(commentId);

  const user = req.user;

  if (!commentId) {
    throw new ApiError(404, "Comment not found");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.commenter.toString() !== user._id.toString() ) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await Comment.findByIdAndDelete(commentId);
  
  return res.status(200).json({
    message: "Comment deleted successfully",
  });
}
export { addComment,  deleteComments };
