import ApiError from "../utils/ApiError.js";
import Post from "../modles/posts.model.js";
import Comment from "../modles/comments.model.js";
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
const getComments = async (req, res) => {
  const { postId } = req.params;
  if (!postId) {
    throw new ApiError(404, "post not found");
  }
  const getPost = await Post.findById(postId);
  if (!getPost) throw new ApiError(404, "post not found");
  const commentsList = await Post.aggregate([
    { $match: { _id:new mongoose.Types.ObjectId(postId) } },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "CommentsList",
      },
    },
  ]);
 if( commentsList.length === 0) {
    return res.status(200).json({
      message: "No comments found",
      comments: [],
    });
  }
  return res.status(200).json({
    message: "successfully fetched comments",
    comments: commentsList[0].CommentsList,
  });
};
export { addComment, getComments };
