import User from "../modles/user.model.js"
import ApiError from "../utils/ApiError.js"
import { generateAccessRefreshToken } from "./user.controller.js"
import jwt from "jsonwebtoken"
const verifyOtp =async(req,res)=>{
    const {otp}=req.body
    const tokenz =req.cookies?.email
    if (!tokenz) {
    return res.status(400).json({"message":"please generate otp first"})
   }
       const decoded =jwt.verify(tokenz,process.env.JWT_SECRET)
  
   
    
    const user = await User.findOne(decoded._id).select("-password,-refreshtoken")
    if(!otp){
        throw new ApiError(401,"please enter otp");
    }
    if(user.otp!==otp){
        throw new ApiError(401,"wrong otp");
        
    }
    const { accessToken, refreshToken,TrustToken } = generateAccessRefreshToken(
    user._id
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  if(user.trustDevice===true){
    user.refreshToken = refreshToken;
  user.accessToken = accessToken;
  user.trustedDevices = TrustToken;
  user.otp=null
    await user.save({ validateBeforeSave: false });
  res.clearCookie("email", options);
  
  return res
    .status(200)
    .cookie("AccessToken", accessToken, options)
    .cookie("RefreshToken", refreshToken, options)
    .cookie("TrustedDevice",TrustToken,options)
    .json({
      message: "Successfully logged in",
    });
  }
  else if (user.trustDevice===false) {
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    user.otp=null
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

}
export default verifyOtp