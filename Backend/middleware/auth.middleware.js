import ApiError from "../utils/ApiError.js";
import User from "../modles/user.model.js";
import jwt from "jsonwebtoken";
const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies?.AccessToken;
    if (!token) {
      return next(new ApiError(401, "Unauthorized request — please login first"));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return next(new ApiError(401, "Invalid Access Token"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(500, error.message || "Internal Server Error"));
  }
};
export default verifyUser;
