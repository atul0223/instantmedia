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
    passwordSchema: {
      password: {
        type: String,
        required: true,
       
      },
      attempts: {
        type: Number,
        default: 0, // Number of failed login attempts
    }},
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
  if (!this.isModified("passwordSchema.password")) {
    return next();
  }
  this.passwordSchema.password = await bcrypt.hash(this.passwordSchema.password, 11);
  next();
});

userSchema.methods.validatePassword = async function (password) {
  const hashed = this.passwordSchema?.password;
  
  if (!password || !hashed) {
    throw new Error("Missing password or hash for comparison");
  }
  return await bcrypt.compare(password, hashed);
};


const User = mongoose.model("User", userSchema);
export default User;
