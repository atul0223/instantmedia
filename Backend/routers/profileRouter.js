import { Router } from "express";
import verifyUser from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { getFollowerFollowingList, toggleFollow } from "../controllers/follow.controller.js";
const router = Router();
import { getUserProfile } from "../controllers/userProfile.controller.js";
import { newPosts ,deletePost} from "../controllers/posts.controller.js";
import { likeCountAndList, toggleLike } from "../controllers/likes.controller.js";

router.get("/:username", getUserProfile);
router.route("/:username/toggleFollow").post(verifyUser,toggleFollow);
router.route("/:username/List").get(getFollowerFollowingList)
router.route("/:username/post").post(verifyUser ,upload.fields([
     {
      name: "post",
      maxCount: 1,
    },
]),newPosts)
router.route("/:username/deletePost/:postid").delete(verifyUser, deletePost);
router.route("/:postId/togglelike").post(verifyUser,toggleLike);
router.route("/:postId/likes").get(likeCountAndList);
export default router;