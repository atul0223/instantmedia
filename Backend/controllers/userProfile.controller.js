import User from "../modles/user.model.js";
import ApiError from "../utils/ApiError.js";
const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user =req.user
    const isBlocked =await User.findOne({username}).select( "-password -refreshToken -verificationEmailToken -isVerified -trustedDevices -username")
    if (isBlocked?.blockedUsers?.includes(user._id)) {
       throw new ApiError(400, "user not found");
    }
    if (!username?.trim()) {
      throw new ApiError(400, "username is missing");
    }

    const userProfile = await User.aggregate([
      {
        $match: {
          username: username.trim(),
        },
      },
      {
        $lookup: {
          from: "userprofiles",
          localField: "_id",
          foreignField: "profile",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "userprofiles",
          localField: "_id",
          foreignField: "follower",
          as: "following",
        },
      },
      {
        $addFields: {
          followersCount: {
            $size: "$followers",
          },
          followingCount: {
            $size: "$following",
          },
          isFollowing: {
            $cond: {
              if: { $in: [req.user?._id, "$followers.follower"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          fullName: 1,
          username: 1,
          followersCount: 1,
          followingCount: 1,
          isFollowing: 1,
          profilePic: 1,
        },
      },
    ]);
    const userPosts = await User.aggregate([
      {
        $match: {
          username: "Kartik",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "publisher",
          as: "postList",
        },
      },

      {
        $project: {
          postList: 1,
        },
      },
    ]);
   const postsList = userPosts[0].postList

    if (!userProfile?.length) {
      throw new ApiError(404, "User profile does not exist");
    }

    return res.status(200).json({
      success: true,
      profileDetails: userProfile[0],
      posts:postsList,
      message: "User profile fetched successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
export { getUserProfile };
