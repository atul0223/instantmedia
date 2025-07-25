import User from "../modles/user.model.js";
import UserProfile from "../modles/UserProfile.model.js";
import ApiError from "../utils/ApiError.js";
const toggleBlock = async (req, res) => {
  const { username } = req.params;
  const { block } = req.body;
  const user = req.user;

  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  const userExists = await User.findOne({ username }).select(
    "-password -refreshToken -verificationEmailToken -isVerified -trustedDevices"
  );

  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  const isBlocked = user.blockedUsers.includes(userExists._id);

  if (block === true) {
    if (isBlocked) {
      throw new ApiError(400, "User is already blocked");
    }
 await UserProfile.deleteMany({
      follower: user._id,
      profile: userExists._id
    });
    
    
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { blockedUsers: userExists._id }
    });
   
    return res.status(200).json({ message: "Successfully blocked" });
  }

  if (block === false) {
    if (!isBlocked) {
      throw new ApiError(400, "User is not in block list");
    }

    await User.findByIdAndUpdate(user._id, {
      $pull: { blockedUsers: userExists._id }
    });

    return res.status(200).json({ message: "Successfully unblocked" });
  }

  return res.status(400).json({ message: "Invalid block flag provided" });
};
export { toggleBlock };
