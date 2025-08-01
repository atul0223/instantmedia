
import mongoose from "mongoose";
import UserProfile from "../modles/UserProfile.model.js";

const getNotifications = async (req, res) => {

  const user =req.user
    const data =await UserProfile.aggregate([{
  $match:{
    profile:new mongoose.Types.ObjectId(user._id),
   
  }
},{
  $sort: {
    createdAt:-1
  }
},{
  $lookup: {
    from: "users",
    localField: "follower",
    foreignField: "_id",
    as:"requester"
  }
},{
  $unwind: {
    path:"$requester",
 
    preserveNullAndEmptyArrays:true
  }
},{
  $project: {
    requestStatus:1,
    "requester.username":1,
    "requester.profilePic":1,
    createdAt:1
  }
}]
)
return res.status(200).json({message:"fetched successfully",notifications:data})
};
const markAsRead = async (req, res) => {
  try {
   
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ success: true, message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to mark notifications as read" });
  }
};
export {getNotifications,markAsRead}
