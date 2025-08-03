import { Router } from "express";
import verifyUser from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import {
  getFollowerFollowingList,
  toggleFollow,
} from "../controllers/follow.controller.js";
const router = Router();
import { getUserProfile } from "../controllers/userProfile.controller.js";
import { newPosts, deletePost } from "../controllers/posts.controller.js";
import { toggleLike } from "../controllers/likes.controller.js";
import {
  addComment,
  deleteComments,
} from "../controllers/comments.controller.js";
import { toggleBlock } from "../controllers/blocked.controller.js";

import Like from "../modles/likes.model.js";
import Post from "../modles/posts.model.js";
import mongoose from "mongoose";

router.get("/:username", verifyUser, getUserProfile);
router.route("/:username/toggleFollow").post(verifyUser, toggleFollow);
router.route("/:username/List").get(verifyUser, getFollowerFollowingList);
router.route("/post").post(
  verifyUser,
  upload.fields([
    {
      name: "post",
      maxCount: 1,
    },
  ]),
  newPosts
);
router.route("/deletePost/:postid").delete(verifyUser, deletePost);
router.route("/:postId/togglelike").post(verifyUser, toggleLike);
router.route("/isLiked/:postId").get(verifyUser, async (req, res) => {
  const { postId } = req.params;
  const user = req.user;
  const likedPost = await Like.findOne({ post: postId, likedBy: user });
  res.status(200).json({ isLiked: likedPost ? true : false });
});
router.route("/:postId/addComment").post(verifyUser, addComment);

router.route("/deleteComment/:commentId").delete(verifyUser, deleteComments);

router.route("/:username/toggleBlock").post(verifyUser, toggleBlock);
router.route("/getSinglePost/:postId").get(verifyUser, async (req, res) => {
  const { postId } = req.params;
  const user = req.user;
  const post = await Post.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "publisher",
        foreignField: "_id",
        as: "publisherDetails",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likes",
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: "$likes",
        },
      },
    },
    {
      $lookup: {
        from: "comments",
        let: { postId: new mongoose.Types.ObjectId(postId) },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$post", "$$postId"] },
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $lookup: {
              from: "users",
              localField: "commenter",
              foreignField: "_id",
              as: "commenterDetails",
            },
          },
          { $unwind: "$commenterDetails" },
          {
            $project: {
              _id: 1,
              comment: 1,
              commenterDetails: {
                username: "$commenterDetails.username",
                profilePic: "$commenterDetails.profilePic",
              },
            },
          },
        ],
        as: "comments",
      },
    },
    {
      $addFields: {
        commentsCount: {
          $size: "$comments",
        },
      },
    },
    {
      $unwind: {
        path: "$publisherDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        "publisherDetails.username": 1,
        "publisherDetails.profilePic": 1,
        comments: 1,
        likesCount: 1,
        commentsCount: 1,
        post: 1,
        title: 1,
      },
    },
  ]);
  console.log(post[0]);

  res.status(200).json({ post: post[0] });
});
export default router;
