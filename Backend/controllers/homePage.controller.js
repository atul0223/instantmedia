import User from "../modles/user.model.js";
import Post from "../modles/posts.model.js";
import UserProfile from "../modles/UserProfile.model.js";
const homePage = async (req, res) => {
  const user = req.user;
  const nillFollowing = await UserProfile.findOne({
    follower: user._id,
    requestStatus: "accepted",
  });

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
        $addFields: {
          following: {
            $filter: {
              input: "$following",
              as: "following",
              cond: { $eq: ["$$following.requestStatus", "accepted"] },
            },
          },
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following.profile",
          foreignField: "publisher",
          as: "postList",
        },
      },
      {
        $set: {
          postList: {
            $sortArray: {
              input: "$postList",
              sortBy: { createdAt: -1 },
            },
          },
        },
      },
      {
        $addFields: {
          "postList.postDetails": {
            _id: "$postList._id",
            post: "$postList.post",
            title: "$postList.title",
          },
        },
      },
      {
        $unwind: {
          path: "$postList",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "postList.publisher",
          foreignField: "_id",
          as: "publisherDetails",
        },
      },
      { $unwind: "$publisherDetails" },
      {
        $lookup: {
          from: "likes",
          localField: "postList._id",
          foreignField: "post",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { postId: "$postList._id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$post", "$$postId"] },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "commenter",
                foreignField: "_id",
                as: "commenterDetails",
              },
            },
            { $unwind: "$commenterDetails" },
            {
              $project: {
                _id: 1,
                comment: 1,
                commenterDetails: {
                  username: "$commenterDetails.username",
                  profilePic: "$commenterDetails.profilePic",
                },
              },
            },
          ],
          as: "comments",
        },
      },
      {
        $group: {
          _id: "$_id",
          username: { $first: "$username" },
          profilePic: { $first: "$profilePic" },
          postList: {
            $push: {
              postDetails: {
                _id: "$postList._id",
                post: "$postList.post",
                title: "$postList.title",
              },

              likesCount: { $size: "$likes" },
              commentsCount: { $size: "$comments" },
              publisherDetails: {
                username: "$publisherDetails.username",
                profilePic: "$publisherDetails.profilePic",
              },
              comments: "$comments",
            },
          },
        },
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
                    $concat: ["P", { $toString: "$$index" }],
                  },
                  v: { $arrayElemAt: ["$postList", "$$index"] },
                },
              },
            },
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      feedPosts: feedPosts[0].postList,
    });
  } else if (!nillFollowing) {
    const feedPosts = await Post.aggregate([
      { $sample: { size: 50 } },
      { $sort: { createdAt: -1 } },

      {
        $lookup: {
          from: "users",
          localField: "publisher",
          foreignField: "_id",
          as: "publisherDetails",
        },
      },
      { $unwind: "$publisherDetails" },

      // Get likes count
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "post",
          as: "likes",
        },
      },

      // Get comments with user details
      {
        $lookup: {
          from: "comments",
          let: { postId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$post", "$$postId"] } } },
            {
              $lookup: {
                from: "users",
                localField: "commenter",
                foreignField: "_id",
                as: "commenterDetails",
              },
            },
            {
              $unwind: {
                path: "$publisherDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                comment: 1,
                commenterDetails: {
                  username: "$commenterDetails.username",
                  profilePic: "$commenterDetails.profilePic",
                },
              },
            },
          ],
          as: "comments",
        },
      },

      // Final reshaping
      {
        $project: {
          _id: 0,
          postDetails: {
            _id: "$_id",
            post: "$post",
            title: "$title",
          },
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
          comments: "$comments",
          publisherDetails: {
            username: "$publisherDetails.username",
            profilePic: "$publisherDetails.profilePic",
          },
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      feedPosts: feedPosts,
      message: "No following found, showing random posts",
    });
  }
};
export { homePage };
