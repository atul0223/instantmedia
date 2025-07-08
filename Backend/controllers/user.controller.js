import User from "../modles/user.model.js";
import ApiError from "../utils/ApiError.js";
import cloudinayUpload from "../utils/cloudinary.js";
import generateJWT from "../utils/jwtokengenerator.js";
import sendVerificationEmail from "../utils/sendEmail.js";
import sendOtp from "../utils/sendOtp.js";
import jwt from "jsonwebtoken";
const generateAccessRefreshToken = (userId) => {
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
    const profilePic = await cloudinayUpload(localFilePath);

    const createdUser = await User.create({
      username,
      password,
      email,
      fullName,
      profilePic: profilePic?.secure_url || process.env.DEFAULTPIC,
    });

    if (!createdUser) {
      throw new ApiError(502, "Error while saving data");
    }
    const token = generateJWT(createdUser._id, process.env.EMAILTIME);
    console.log(token);
    await sendVerificationEmail(email, token);

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

  const validateUser = await user.validatePassword(password);

  if (!validateUser) throw new ApiError(401, "incorrect password");

  if (!user.isVerified) {
    const token = generateJWT(user._id, process.env.EMAILTIME);
    await sendVerificationEmail(user.email, token);
    throw new ApiError(300, "please verify email");
  }
  user.trustDevice = trustDevice;
  await user.save();
  const { emailToken } = generateAccessRefreshToken(user._id);
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
  if (!userT) {
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

  const { accessToken, refreshToken } = generateAccessRefreshToken(user._id);
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
}

export { signup, login, logout, generateAccessRefreshToken, changeProfilepic };