import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    profilePic: {
      type: String,
      default: process.env.DEFAULTPIC,
    },
    isVerified: { type: Boolean, default: false },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    refreshToken: {
      type: String,
    },
    trustedDevices: {
      type: String,
    },
    trustDevice: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
      default: 0,
    },
    verificationEmailToken: {
      token: {
        type: String,

        default: "", // Initially empty, will be set when generating a token
      },
      used: {
        type: Boolean,
        default: false, // Usually starts as false
      },
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 11);
  return next();
});
userSchema.methods.validatePassword = async function (password) {
  if (!password || !this.password) {
    throw new Error("Missing password or hash for comparison");
  }
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
