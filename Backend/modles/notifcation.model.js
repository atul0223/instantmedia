import mongoose,{Schema} from 'mongoose'
const notificationSchema = new Schema({
     recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["follow", "comment", "like", "system"], required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }

})
export const Notification =mongoose.model("Notification",notificationSchema)