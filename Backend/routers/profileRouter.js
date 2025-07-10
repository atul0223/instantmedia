import { Router } from "express";
import verifyUser from "../middleware/auth.middleware.js";
import { getFollowerFollowingList, toggleFollow } from "../controllers/follow.controller.js";
const router = Router();
import { getUserProfile } from "../controllers/userProfile.controller.js";

router.get("/:username", getUserProfile);
router.route("/:username/toggleFollow").post(verifyUser,toggleFollow);
router.route("/:username/List").get(getFollowerFollowingList)
export default router;