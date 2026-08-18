// codeProjects/gudeats/backend/src/controllers/postController.js

import { createPost, getPosts } from "../services/postService.js";
import uploadImageToCloudinary from "../utils/uploadImageToCloudinary.js";
import AppError from "../utils/AppError.js";

const create = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError("Post must include an image", 400);
    }

    const { caption, recipe, location } = req.body;

    const uploadResult = await uploadImageToCloudinary(req.file.buffer);

    const post = await createPost({
      authorId: req.user.id,
      imageUrl: uploadResult.secure_url,
      caption,
      recipe,
      location,
    });

    res.status(201).json({ post });
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
