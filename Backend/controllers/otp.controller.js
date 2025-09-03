import User from "../modles/user.model.js";
import ApiError from "../utils/ApiError.js";
import { generateToken } from "./user.controller.js";
import jwt from "jsonwebtoken";
const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const tokenz = req.cookies?.email;

  if (!tokenz) {
    return res.status(400).json({ message: "please generate otp first" });
  }

  const decoded = jwt.verify(tokenz, process.env.JWT_SECRET);
  if (!decoded) {
    return res.status(400).json({ message: "invalid token" });
  }
  const user = await User.findById({ _id: decoded.id }).select(
    "-password,-refreshtoken"
  );

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  if (!otp) {
    return res.status(400).json({ message: "otp is required" });
  }
  if (otp.length !== 6) {
    return res.status(400).json({ message: "otp must be 6 digits" });
  }
  if (user.otp.toString() !== otp.toString()) {
    return res.status(400).json({ message: "invalid otp" });
  }
  const { accessToken, refreshToken, TrustToken } = generateToken(user._id);
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  };
  if (user.trustDevice === true) {
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    user.trustedDevices = TrustToken;
    user.otp = null;
    user.passwordSchema.attempts = 0; // Reset attempts on successful login
    await user.save({ validateBeforeSave: false });
    res.clearCookie("email", options);

    return res
      .status(200)
      .cookie("AccessToken", accessToken, options)
      .cookie("RefreshToken", refreshToken, options)
      .cookie("TrustedDevice", TrustToken, options)
      .json({
        message: "Successfully logged in",
      });
  } else if (user.trustDevice === false) {
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    user.otp = null;
    user.passwordSchema.attempts = 0; // Reset attempts on successful login
    await user.save({ validateBeforeSave: false });
    res.clearCookie("email", options);

    return res
      .status(200)
      .cookie("AccessToken", accessToken, options)
      .cookie("RefreshToken", refreshToken, options)
      .json({
        message: "Successfully logged in",
      });
  }
};
export default verifyOtp;
