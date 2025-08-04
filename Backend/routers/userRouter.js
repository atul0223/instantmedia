import { Router } from "express";
import {
  signup,
  login,
  logout,
  changeProfilepic,
  deleteProfilePic,
  updateUsername,
  changeFullName,
  changePasswordIn,
  forgetPassword,
  changeEmail,
  toggleProfileVisiblity,
  handleRequest,
} from "../controllers/user.controller.js";
import upload from "../middleware/multer.middleware.js";
import User from "../modles/user.model.js";
import jwt from "jsonwebtoken";
import verifyUser from "../middleware/auth.middleware.js";
import verifyOtp from "../controllers/otp.controller.js";
import generateJWT from "../utils/jwtokengenerator.js";
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
    if (user.verificationEmailToken.token !== token) {
      return res.status(400).send("Invalid token");
    }
    if (user.verificationEmailToken.used) {
      return res.status(400).send("Token has already been used");
    }
    if (user.isVerified) return res.send("Email already verified");

    user.isVerified = true;
    user.verificationEmailToken.used = true; // Mark the token as used
    user.verificationEmailToken.token = ""; // Clear the token after use
    await user.save();

    return res
      .status(200)
      .json({ message: "Email verified successfully!", success: true });
  } catch (err) {
    console.error("Verification error:", err);
    return res
      .status(400)
      .json({ message: "Invalid or expired token", success: false });
  }
});
router.route("/login").post(login);
router.route("/logout").get(verifyUser, logout);
router.route("/verifyotp").post(verifyOtp);
router.route("/changeProfilePic").post(
  verifyUser,
  upload.fields([
    {
      name: "newProfilePic",
      maxCount: 1,
    },
  ]),
  changeProfilepic
);
router.route("/getUser").get(verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "username profilePic fullName email profilePrivate"
    );
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

router.route("/changeEmail").post(verifyUser, changeEmail);
router
  .route("/toggleProfileVisiblity")
  .post(verifyUser, toggleProfileVisiblity);
router.route("/handleRequest/:targetUsername").post(verifyUser, handleRequest);
router.route("/isemailVerified/:username").get(async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("isVerified");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ isVerified: user.isVerified });
  } catch (error) {
    console.error("Error checking email verification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.route("/jwtverify/:token").get(async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ valid: false });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ valid: false });
    }
    if (user.verificationEmailToken.token !== token) {
      return res.status(400).json({ valid: false });
    }
    if (user.verificationEmailToken.used) {
      return res.status(400).json({ valid: false });
    }

    const tokenz = generateJWT(user, "15m");

    return res.status(200).json({ valid: true, token: tokenz });
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return res.status(401).json({ valid: false });
  }
});
router.route("/changePass/:token").post(async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;
  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.passwordSchema.password = newPassword;
    user.verificationEmailToken.token = ""; // Clear the token after use
    user.verificationEmailToken.used = true; // Mark the token as used
    await user.save({ validateBeforeSave: true });
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.route("/isUsernameAvailable/:username").get(async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(200).json({ available: false,
        message: "Username is already taken" });
    }
    return res.status(200).json({ available: true ,
      message: "Username is available"});
  } catch (error) {
    console.error("Error checking username availability:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
