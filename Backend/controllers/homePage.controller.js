
import User from "../modles/user.model.js";
import Post from "../modles/posts.model.js";
import UserProfile from "../modles/UserProfile.model.js";
const homePage = async (req, res) => {
  const user = req.user;
  const nillFollowing =await UserProfile.exists({ follower: user._id });

  
  if (nillFollowing) {
    const feedPosts = await User.aggregate([
      {
        $match: {
          username: user.username,
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
        $lookup: {
          from: "posts",
          localField: "following.profile",
          foreignField: "publisher",
          as: "posts",
        },
      },
      {
        $project: {
          posts: 1,
        },
      },
    ]);
    console.log(feedPosts);
    
    return res.status(200).json({
      success: true,
      feedPosts: feedPosts[0].posts,
    });
  } else if (!nillFollowing) {
    const feedPosts = await Post.aggregate([
      { $sample: { size: 10 } },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    return res.status(200).json({
      success: true,
      feedPosts: feedPosts[0],
      error: "No following found, showing random posts",
    });
  }
};
export { homePage };
