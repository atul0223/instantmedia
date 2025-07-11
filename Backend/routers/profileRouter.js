import { Router } from "express";
import verifyUser from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { getFollowerFollowingList, toggleFollow } from "../controllers/follow.controller.js";
const router = Router();
import { getUserProfile } from "../controllers/userProfile.controller.js";
import { newPosts } from "../controllers/posts.controller.js";

router.get("/:username", getUserProfile);
router.route("/:username/toggleFollow").post(verifyUser,toggleFollow);
router.route("/:username/List").get(getFollowerFollowingList)
router.route("/:username/post").post(verifyUser ,upload.fields([
     {
      name: "post",
      maxCount: 1,
    },
]),newPosts)
export default router;