import { Router } from "express";
import verifyUser from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { getFollowerFollowingList, toggleFollow } from "../controllers/follow.controller.js";
const router = Router();
import { getUserProfile } from "../controllers/userProfile.controller.js";
import { newPosts ,deletePost} from "../controllers/posts.controller.js";
import { likeCountAndList, toggleLike } from "../controllers/likes.controller.js";
import { addComment, deleteComments, getComments } from "../controllers/comments.controller.js";
import { toggleBlock } from "../controllers/blocked.controller.js";

router.get("/:username",verifyUser , getUserProfile);
router.route("/:username/toggleFollow").post(verifyUser,toggleFollow);
router.route("/:username/List").get(verifyUser,getFollowerFollowingList)
router.route("/:username/post").post(verifyUser ,upload.fields([
     {
      name: "post",
      maxCount: 1,
    },
]),newPosts)
router.route("/:username/deletePost/:postid").delete(verifyUser, deletePost);
router.route("/:postId/togglelike").post(verifyUser,toggleLike);
router.route("/:postId/likes").get(verifyUser,likeCountAndList);
router.route("/:postId/addComment").post(verifyUser,addComment);
router.route("/:postId/getComment").get(verifyUser,getComments);
router.route("/:postId/deleteComment/:commentId").delete(verifyUser,deleteComments)
router.route("/download/:postId").get(verifyUser, async (req, res) => {
  const { postId } = req.params;
  if (!postId) {
    return res.status(404).json({ message: "Post not found" });
  }
  const downloadLink = await Post.findById(postId).select("post");
  res.status(200).json({
    message: "Download initiated",
    postId: postId,
    downloadLink: downloadLink.post ? downloadLink.post : "No post available for download"
  });
});
router.route("/:username/toggleBlock").post(verifyUser, toggleBlock);
export default router;