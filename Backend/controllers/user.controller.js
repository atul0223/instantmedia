import User from "../modles/user.model.js";
import ApiError from "../utils/ApiError.js";
import cloudinayUpload from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import generateJWT from "../utils/jwtokengenerator.js";
import sendVerificationEmail from "../utils/sendEmail.js";
import sendOtp from "../utils/sendOtp.js";
import jwt from "jsonwebtoken";

const extractPublicId = (url) => {
  try {
    const regex = /\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z]+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (err) {
    console.error("Failed to extract public_id from URL:", url);
    return null;
  }
};
const generateToken = (userId) => {
  const accessToken = generateJWT(userId, process.env.ACCESSTIME);
  const refreshToken = generateJWT(userId, process.env.REFRESHTIME);
  const TrustToken = generateJWT(userId, process.env.REFRESHTIME);
  const emailToken = generateJWT(userId, "10m");
  return { accessToken, refreshToken, TrustToken, emailToken };
};
const signup = async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body;
    if ([username, password, email, fullName].some((f) => !f?.trim())) {
      throw new ApiError(401, "User credentials can't be empty");
    }
    const localFilePath = req.files?.profilePic?.[0]?.path;
    const existedUser = await User.findOne({ username });
    if (existedUser) {
      throw new ApiError(401, "User name already exists");
    }
    const emailUsed = await User.findOne({ email });
    if (emailUsed) {
      throw new ApiError(401, "Email already used");
    }
    const profilePic = await cloudinayUpload(localFilePath);

    const newUser = new User({
      username,
      passwordSchema: {
        password,
      },
      email,
      fullName,
      profilePic: profilePic?.secure_url || process.env.DEFAULTPIC,
    });

    await newUser.save();

    if (!newUser) {
      throw new ApiError(502, "Error while saving data");
    }
    const token = generateJWT(newUser._id, process.env.EMAILTIME);

    await sendVerificationEmail(
      email,
      token,
      "Email Verification",
      "verify your email",
      "verify"
    );

    return res.status(200).json({
      message: "Successfully registered. Please verify your email.",
    });
  } catch (error) {
    console.error("Error in userController", error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};
const login = async (req, res) => {
 
  const { username, password, trustDevice } = req.body;
  if (username === null || password === null) {
    throw new ApiError(401, "usercredentials cant be empty");
  }
  const user = await User.findOne({ username });
  if (!user) throw new ApiError(401, "user does'nt exists please signup");
 const { emailToken } = generateToken(user._id);
  const validateUser = await user.validatePassword(password);

  if (!validateUser) {
    if (user.passwordSchema.attempts >= 5) {
      sendOtp(user.email);
       return res
      .cookie("email", emailToken, {
        httpOnly: true,
        secure: true,
        maxAge: 10 * 60 * 1000,
      })
      .status(429)
      .json({ message: "Too many login attempts. Please verify your identity." });
    }
    user.passwordSchema.attempts += 1;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(401, "incorrect password");
  }

  if (!user.isVerified) {
    const token = generateJWT(user._id, process.env.EMAILTIME);
    await sendVerificationEmail(
      user.email,
      token,
      "Email Verification",
      "verify your email",
      "verify"
    );
    throw new ApiError(300, "please verify email");
  }
  user.trustDevice = trustDevice;
  user.passwordSchema.attempts = 0; // Reset attempts on successful login
  await user.save({   validateBeforeSave: false });
  
  console.log("emailToken", emailToken, user._id);

  const trusted = req.cookies?.TrustedDevice;

  if (!trusted) {
    sendOtp(user.email);
    return res
      .cookie("email", emailToken, {
        httpOnly: true,
        secure: true,
        maxAge: 10 * 60 * 1000,
      })
      .status(300)
      .json({ message: "verify through otp sent on registered email" });
  }

  const decodedToken = jwt.verify(trusted, process.env.JWT_SECRET);

  const userT = await User.findById(decodedToken.id).select(
    "-password -refreshToken"
  );

  if (!userT || userT._id.toString() !== user._id.toString()) {
    sendOtp(user.email);
    return res
      .cookie("email", emailToken, {
        httpOnly: true,
        secure: true,
        maxAge: 10 * 60 * 1000,
      })
      .status(300)
      .json({ message: "verify through otp sent on registered email" });
  }

  const { accessToken, refreshToken } = generateToken(user._id);
  const options = {
    httpOnly: true,
    secure: true,
  };
  user.refreshToken = refreshToken;
  user.accessToken = accessToken;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .cookie("AccessToken", accessToken, options)
    .cookie("RefreshToken", refreshToken, options)
    .json({
      message: "Successfully logged in",
    });
};
const logout = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res.clearCookie("AccessToken", options);
  res.clearCookie("RefreshToken", options);
  return res.status(200).json({
    message: "Logout successful",
  });
};
const changeProfilepic = async (req, res) => {
  try {
    const newProfilepic = req.files?.newProfilePic?.[0]?.path;

    if (!newProfilepic) {
      throw new ApiError(400, "please provide a picture");
    }
    const profilePic = await cloudinayUpload(newProfilepic);
    if (!profilePic) {
      throw new ApiError(500, "Error uploading profile picture");
    }
    const publicId = extractPublicId(req.user.profilePic);
    await cloudinary.uploader.destroy(publicId);
    req.user.profilePic = profilePic?.secure_url || process.env.DEFAULTPIC;
    await req.user.save({ validateBeforeSave: false });
    return res.status(200).json({
      message: "Profile picture updated successfully",
      profilePic: req.user.profilePic,
    });
  } catch (error) {
    console.error("Error in changeProfilepic:", error);
    return res.status(500).json({
      message: "Something went wrong while updating profile picture",
    });
  }
};
const deleteProfilePic = async (req, res) => {
  try {
    const publicId = extractPublicId(req.user.profilePic);

    await cloudinary.uploader.destroy(publicId);
    req.user.profilePic = process.env.DEFAULTPIC;

    await req.user.save({ validateBeforeSave: false });
    return res.status(200).json({
      message: "Profile picture deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProfilePic:", error);
    return res.status(500).json({
      message: "Something went wrong while deleting profile picture",
    });
  }
};
const updateUsername = async (req, res) => {
  try {
    const { newUsername } = req.body;
    const user = req.user;
    if (newUsername === null || newUsername.trim() === "") {
      throw new ApiError(401, "Username can't be empty");
    }

    const UniqueUser = await User.findOne({ username: newUsername });
    if (UniqueUser) {
      throw new ApiError(401, "Username already exists");
    }
    user.username = newUsername;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
      message: "Username updated successfully",
      Newusername: user.username,
    });
  } catch (error) {
    console.error("Error in updateUsername:", error);
    return res.status(500).json({
      message: "Something went wrong while updating username",
    });
  }
};
const changeFullName = async (req, res) => {
  const { newFullName } = req.body;
  const user = req.user;

  if (!newFullName || newFullName.trim() === "") {
    throw new ApiError(401, "Full name can't be empty");
  }

  user.fullName = newFullName;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json({
    message: "Full name updated successfully",
    NewfullName: user.fullName,
  });
};
const changePasswordIn = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;
const { emailToken } = generateToken(user._id);
  if (!oldPassword || !newPassword) {
    throw new ApiError(401, "Old password and new password can't be empty");
  }

  const isMatch = await user.validatePassword(oldPassword);
  if (!isMatch) {
     if (user.passwordSchema.attempts >= 5) {
      sendVerificationEmail(
        user.email,
        emailToken,
        "Password Reset",
        "reset your password",
        "updatePassword"
      );
      return res
        .status(429)
        .json({ message: "Too many incorrect attempts. Please change your password through the link sent to your email." });
    }
    user.passwordSchema.attempts += 1;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(401, "incorrect password");
  }
   

  user.passwordSchema.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json({
    message: "Password updated successfully",
  });
};
const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email || email.trim() === "") {
    throw new ApiError(401, "Email can't be empty");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const { emailToken } = generateToken(user._id);
  user.verificationEmailToken.token = emailToken;
  user.verificationEmailToken.used = false; // Ensure the token is not marked as used2
  await user.save({ validateBeforeSave: false });
  sendVerificationEmail(
    email,
    emailToken,
    "Password Reset",
    "reset your password",
    "updatePassword"
  );
  return res.status(200).json({
    message: "Password reset email sent successfully to registered email",
  });
};
const changeEmail = async (req, res) => {
  const { password, newEmail } = req.body;
  const user = req.user;
  const { emailToken } = generateToken(user._id);
  if (!password || !newEmail) {
    throw new ApiError(401, "please provide credentials");
  }
  const passVerify = user.validatePassword(password);
  if (!passVerify) {
    throw new ApiError(402, "incorrect password");
  }
  const emailUsed = await User.findOne({ email: newEmail });
  if (emailUsed) {
    throw new ApiError(400, "email is already asociated to another profile");
  }
  user.isVerified = false;
  user.email = newEmail;
  user.save({ validateBeforeSave: false });
  sendVerificationEmail(
    newEmail,
    emailToken,
    "verify your email",
    "verify your email",
    "verify"
  );
  res.status(200)
  .json({
    message: "verification email sent to new email",
  });
};
export {
  signup,
  login,
  logout,
  generateToken,
  changeProfilepic,
  deleteProfilePic,
  updateUsername,
  changeFullName,
  changePasswordIn,
  forgetPassword,
  changeEmail,
};
