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

export default uploadImageToCloudinary;
