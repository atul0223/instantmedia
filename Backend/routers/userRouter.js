import { Router } from "express";
import { signup, login, logout } from "../controllers/user.controller.js";
import upload from "../middleware/multer.middleware.js";
import User from "../modles/user.model.js";
import jwt from "jsonwebtoken";
import verifyUser from "../middleware/auth.middleware.js";
import verifyOtp from "../controllers/otp.controller.js";
const router = Router();
router.route("/signup").post(
  upload.fields([
    {
      name: "profilePic",
      maxCount: 1,
    },
  ]),
  signup
);
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).send("User not found");

    if (user.isVerified) return res.send("Email already verified");

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("Verification error:", err);
    return res.status(400).send("Invalid or expired token");
  }
});
router.route("/login").post(login);
router.route("/logout").get(verifyUser,logout)
router.route("/verifyotp").post(verifyOtp)
export default router;
