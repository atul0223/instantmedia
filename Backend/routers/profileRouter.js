import { Router } from "express";
import verifyUser from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { getFollowerFollowingList, toggleFollow } from "../controllers/follow.controller.js";
const router = Router();
import { getUserProfile } from "../controllers/userProfile.controller.js";
import { newPosts ,deletePost} from "../controllers/posts.controller.js";
import {toggleLike } from "../controllers/likes.controller.js";
import { addComment, deleteComments } from "../controllers/comments.controller.js";
import { toggleBlock } from "../controllers/blocked.controller.js";

import Like from "../modles/likes.model.js";

router.get("/:username",verifyUser , getUserProfile);
router.route("/:username/toggleFollow").post(verifyUser,toggleFollow);
router.route("/:username/List").get(verifyUser,getFollowerFollowingList)
router.route("/post").post(verifyUser ,upload.fields([
     {
      name: "post",
      maxCount: 1,
    },
]),newPosts)
router.route("/deletePost/:postid").delete(verifyUser, deletePost);
router.route("/:postId/togglelike").post(verifyUser,toggleLike);
router.route("/isLiked/:postId").get(verifyUser, async (req, res) => {
  const { postId } = req.params;
  const user = req.user;
  const likedPost = await Like.findOne({ post: postId, likedBy: user });
  res.status(200).json({ isLiked: likedPost ? true : false });
});
router.route("/:postId/addComment").post(verifyUser,addComment);

router.route("/deleteComment/:commentId").delete(verifyUser,deleteComments)

router.route("/:username/toggleBlock").post(verifyUser, toggleBlock);
export default router;
