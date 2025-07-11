import { Router } from "express";
import { signup, login, logout, changeProfilepic, deleteProfilePic, updateUsername ,changeFullName, changePasswordIn, forgetPassword, changeEmail } from "../controllers/user.controller.js";
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
router.route("/logout").get(verifyUser,logout);
router.route("/verifyotp").post(verifyOtp);
router.route("/changeProfilePic").post(verifyUser,upload.fields([{
  name: "newProfilePic",
      maxCount: 1,
}]),changeProfilepic)
router.route("/getUser").get(verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.route("/deleteProfilePic").delete(verifyUser, deleteProfilePic);
router.route("/updateUsername").post(verifyUser, updateUsername);
router.route("/changeFullName").post(verifyUser, changeFullName);
router.route("/changePasswordIn").post(verifyUser, changePasswordIn);
router.route("/forgetPassword").post(forgetPassword);
router.route("/updatePassword/:token").post(async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verificationEmailToken.token !== token) {
      return res.status(400).json({ message: "Invalid token" });
    }
    if (user.verificationEmailToken.used) {
      return res.status(400).json({ message: "Token has already been used" });
    }
    

    user.passwordSchemapassword = newPassword;
    user.verificationEmailToken.used = true; // Mark the token as used
  
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in updatePassword:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

});
router.route("/changeEmail").post(verifyUser,changeEmail)
export default router;
