// codeProjects/gudeats/backend/src/utils/uploadImageToCloudinary.js

import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import AppError from "./AppError.js";

const uploadImageToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "gudeats/posts", resource_type: "image" },
      (error, result) => {
        if (error) {
          reject(new AppError("Image upload failed", 502));
          return;
        }
        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const deleteImageFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    // best-effort cleanup; a failed delete here shouldn't mask the original error
  }
};

export default uploadImageToCloudinary;
export { deleteImageFromCloudinary };
