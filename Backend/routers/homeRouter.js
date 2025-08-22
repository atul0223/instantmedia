import Router from "express";
import verifyUser from "../middleware/auth.middleware.js";
import { homePage } from "../controllers/homePage.controller.js";
import User from "../modles/user.model.js";
import { getNotifications } from "../controllers/notification.controller.js";
const router = Router();

router.route("/").get(verifyUser, homePage);
router.route("/search").get(verifyUser, async (req, res) => {
  const { query } = req.query;
  const auser =req.user
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }
  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } },
      ],
    }).find({username:{$ne:auser.username}}).select(
      "-passwordSchema -refreshToken -verificationEmailToken -isVerified -trustDevice -otp -createdAt -updatedAt -__v -trustedDevices -email  -profilePrivate -blockedUsers"
    );

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({ message: "Internal server error" ,Error:error});
  }
});
router.route("/Notifications").get(verifyUser, getNotifications);
export default router;
