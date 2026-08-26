// codeProjects/gudeats/backend/src/controllers/postController.js

import { createPost, getPosts } from "../services/postService.js";
import uploadImageToCloudinary, { deleteImageFromCloudinary } from "../utils/uploadImageToCloudinary.js";
import checkFoodImage from "../utils/checkFoodImage.js";
import AppError from "../utils/AppError.js";

const create = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError("Post must include an image", 400);
    }

    const { caption, recipe, location } = req.body;

    const uploadResult = await uploadImageToCloudinary(req.file.buffer);

    try {
      const foodCheck = await checkFoodImage(uploadResult.secure_url);

      // only a real verdict rejects; an unavailable validator lets the post through
      if (foodCheck.checked && !foodCheck.isFood) {
        throw new AppError("This image does not appear to contain food", 422);
      }

      const post = await createPost({
        authorId: req.user.id,
        imageUrl: uploadResult.secure_url,
        foodLabel: foodCheck.checked ? foodCheck.label : undefined,
        foodConfidence: foodCheck.checked ? foodCheck.confidence : undefined,
        caption,
        recipe,
        location,
      });

      res.status(201).json({ post });
    } catch (error) {
      // the image is orphaned unless the post row was actually written
      await deleteImageFromCloudinary(uploadResult.public_id);
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const { limit, skip } = req.query;

    const posts = await getPosts({ limit, skip });

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

export { create, list };
