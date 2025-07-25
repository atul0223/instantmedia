import User from "../modles/user.model.js";
import UserProfile from "../modles/UserProfile.model.js";
import ApiError from "../utils/ApiError.js";
import isFollowed from "../utils/isFollowed.js";
const toggleFollow = async (req, res) => {
  const { username } = req.params;
  const { follow } = req.body;
  const userX = req.user; //user that is logged in
  if (!username) {
    throw new ApiError(401, "Empty username");
  }
  
  const user = await User.findOne({ username }); //user that we want to follow or unfollow
  if (!user ||(user.blockedUsers?.includes(userX._id))) {
    throw new ApiError(404, "user not exists");
  }
  if (userX.username === user.username) {
    throw new ApiError(401, "You cannot follow or unfollow yourself");
  }
  const alreadyFollowing = await UserProfile.findOne({
    follower: userX._id,
    profile: user._id,
    requestStatus:"accepted"
  });
  
  if (follow) {
    if (alreadyFollowing) {
      throw new ApiError(400, "You are already following this user");
    }
    if(!user.profilePrivate){
    await UserProfile.create({
      follower: userX._id,
      profile: user._id,
      requestStatus:"accepted"
    })
      .then(() => {
        res.status(200).json({
          message: "Followed successfully",
          success: true,
        });
      })
      .catch((err) => {
      console.log(err);
      
      });}
      else if (user.profilePrivate) {
         await UserProfile.create({
      follower: userX._id,
      profile: user._id,
      requestStatus:"pending"
    })
      .then(() => {
        res.status(200).json({
          message: "request sent successfully",
          success: true,
        });
      })
      .catch((err) => {
        console.log(err);
        
        throw new ApiError(500, "Error following user");
      });
      }
  } else if (!follow) {
try {
   await UserProfile.findOneAndDelete({
      follower: userX._id,
      profile: user._id,
      
    });
} catch (error) {
  console.log(error);
}
   
    res.status(200).json({
      message: "Unfollowed successfully",
      success: true,
    });
  } else {
    throw new ApiError(400, "Invalid follow action");
  }
};
const getFollowerFollowingList = async (req, res) => {
 
    const { username } = req.params;
    const userX=req.user;
     const targetUser =await User.findOne({username}).select( "-password -refreshToken -verificationEmailToken -isVerified -trustedDevices ")
        if (targetUser?.blockedUsers?.includes(userX._id)) {
           throw new ApiError(400, "user not found");
        }
      if (isFollowed(targetUser._id,userX._id)) {
        const FolloweList = await User.aggregate(
     [  {
                $match: {
                    username:username
                }
            },
            {
                $lookup: {
                    from: "userprofiles",
                    localField: "_id",
                    foreignField: "profile",
                    as: "followerList"
                }
            },
            {
              $unwind :{path:"$followerList",preserveNullAndEmptyArrays:true}
            },
            {
              $lookup:{
                from:"users",
                let:{followerId:"$followerList.follower"},
               pipeline:[
                {$match: { $expr: { $eq: ["$_id", "$$followerId"] } } },
                {
                  $project:{
                    username:1,
                    profilePic:1,
                    _id:1
                  }
                }
               ],
               as: "followerUser"

              }
            },
            {
              $unwind:{
                path:"$followerUser",
                preserveNullAndEmptyArrays:true
              }
            },
         {
        $group: {
          _id: "$_id",
         
          followerList: { $push: "$followerUser" }
        }
      },
{
        $lookup:{
          from:"userprofiles",
          localField:"_id",
          foreignField: "follower",
          as: "followingList"
        }
      },{
        $unwind:{
          path:"$followingList",
          preserveNullAndEmptyArrays:true
        }
      },

       {
              $lookup:{
                from:"users",
                let:{followingId:"$followingList.profile"},
               pipeline:[
                {$match: { $expr: { $eq: ["$_id", "$$followingId"] } } },
                {
                  $project:{
                    username:1,
                    profilePic:1,
                    _id:1
                  }
                }
               ],
               as: "followingUser"

              }
            },
            {
              $unwind:{
                path:"$followingUser",
                preserveNullAndEmptyArrays:true
              }
            },
            {
        $group: {
          _id: "$_id",
          followerList: { $first: "$followerList" },
          followingList: { $push: "$followingUser" }
        }
      },
      {
        $project: {
          _id: 0,
          followerList: 1,
          followingList: 1
        }
      }

           ]
    );
     if (!FolloweList.length) {
      throw new ApiError(404, "User not found");
    }


    
    return res
          .status(200)
          .json(
          FolloweList[0]
                  )
             
          
  } 
  
    
};
export { toggleFollow, getFollowerFollowingList };
