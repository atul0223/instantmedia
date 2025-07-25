import User from "../modles/user.model.js";
import ApiError from "../utils/ApiError.js";
import isFollowed from "../utils/isFollowed.js";
import UserProfile from "../modles/UserProfile.model.js"; 
const getUserProfile = async (req, res) => {
  try { let sameUser =false;
    const { username } = req.params;
    const user = req.user;
    const targetUser = await User.findOne({ username }).select(
      "-password -refreshToken -verificationEmailToken -isVerified -trustedDevices -username"
    );
   
    if(targetUser._id.toString() === user._id.toString()) {
      sameUser =true;
    
    }
    const isBlocked = user.blockedUsers.includes(targetUser._id);
    const followRelation = await UserProfile.findOne({
      profile: targetUser._id,
      follower: user._id,
    });

    let requestStatus = "follow"; // default state

    if (followRelation) {
      if (followRelation.requestStatus === "accepted") {
        requestStatus = "unfollow";
      } else if (followRelation.requestStatus === "pending") {
        requestStatus = "requested";
      }
    }

    if (targetUser?.blockedUsers?.includes(user._id)) {
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
          followers: {
            $filter: {
              input: "$followers",
              as: "follower",
              cond: { $eq: ["$$follower.requestStatus", "accepted"] },
            },
          },
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
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "publisher",
          as: "postList",
        },
      },
      {
        $addFields: {
          postsCount: {
            $size: "$postList",
          },
        },
      },
      {
        $project: {
         
          username: 1,
          followersCount: 1,
          followingCount: 1,
          isFollowing: 1,
          profilePic: 1,
          profilePrivate: 1,
          postsCount: 1,
         
        },
      },
    ]);
    if (
      targetUser.profilePrivate === true &&
      !(await isFollowed(targetUser._id, user._id) && !sameUser)
    ) {
      return res.json({
        profileDetails: userProfile[0],
        requestStatus: requestStatus,
        sameUser: sameUser,
        isBlocked: isBlocked,
        isPrivate:true,
        posts:[]
      });
    }
    const userPosts = await User.aggregate( [
  {
    $match: { username:username } // Replace with actual query param
  },
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "publisher",
      as: "postList"
    }
  },
   {
  $addFields: {
    "postList.postDetails": {
      post: "$postList.post",
      title: "$postList.title"
    }
  }
}

   ,
  {
    $unwind: {
      path: "$postList",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: "likes",
      localField: "postList._id",
      foreignField: "post",
      as: "likes"
    }
  },
  {
    $lookup: {
      from: "comments",
      let: { postId: "$postList._id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$post", "$$postId"] }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "commenter",
            foreignField: "_id",
            as: "commenterDetails"
          }
        },
        { $unwind: "$commenterDetails" },
        {
          $project: {
            _id: 0,
            comment: 1,
            commenterDetails: {
              username: "$commenterDetails.username",
              profilePic: "$commenterDetails.profilePic"
            }
          }
        }
      ],
      as: "comments"
    }
  },
  {
    $group: {
      _id: "$_id",
      username: { $first: "$username" },
      profilePic: { $first: "$profilePic" },
      postList: {
        $push: {
           postDetails: {
      post: "$postList.post",
      title: "$postList.title"
    },

          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
          publisherDetails: {
            username: "$username",
            profilePic: "$profilePic"
          },
          comments: "$comments"
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      postList: {
        $arrayToObject: {
          $map: {
            input: { $range: [0, { $size: "$postList" }] },
            as: "index",
            in: {
              k: {
                $concat: ["P", { $toString: "$$index" }]
              },
              v: { $arrayElemAt: ["$postList", "$$index"] }
            }
          }
        }
      }
    }
  }
]);
  const postsList = userPosts[0].postList


    if (!userProfile?.length) {
      throw new ApiError(404, "User profile does not exist");
    }

    return res.status(200).json({
      success: true,
      profileDetails: userProfile[0],
      posts: postsList,
         requestStatus: requestStatus, 
      isBlocked: isBlocked,
      sameUser: sameUser, 
      isPrivate:false
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
export { getUserProfile };
