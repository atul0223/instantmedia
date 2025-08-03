import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    likedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const Like = mongoose.model("Like", likeSchema);
export default Like;
