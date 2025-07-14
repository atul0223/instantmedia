import { Notification } from "../modles/notifcation.model";
const getNotifications = async (req, res) => {
  try {
    
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "username profilePic")
      .populate("post", "caption") // optional
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
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
