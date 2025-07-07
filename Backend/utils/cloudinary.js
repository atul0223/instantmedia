import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import ApiError from '../utils/ApiError.js';
import dotenv from 'dotenv'
dotenv.config({
  path:"./.env"
})
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const cloudinayUpload = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const uploadInstance = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });
    console.log("Image uploaded Successfully", uploadInstance.url);
    fs.unlinkSync(localFilePath);
    return uploadInstance;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    throw new ApiError(503, "Error at cloudinary upload", error);
  }
};
export default cloudinayUpload;