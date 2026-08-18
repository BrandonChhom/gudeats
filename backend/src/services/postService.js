// codeProjects/gudeats/backend/src/services/postService.js

import Post from "../models/Post.js";
import AppError from "../utils/AppError.js";

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

const createPost = async ({ authorId, imageUrl, caption, recipe, location }) => {
  if (!imageUrl) {
    throw new AppError("Post must include an image", 400);
  }

  const post = await Post.create({
    authorId,
    imageUrl,
    caption,
    recipe,
    location,
  });

  return post;
};

const getPosts = async ({ limit, skip }) => {
  const parsedLimit = Math.min(Number(limit) || DEFAULT_LIMIT, MAX_LIMIT);
  const parsedSkip = Math.max(Number(skip) || 0, 0);

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(parsedSkip)
    .limit(parsedLimit)
    .populate("authorId", "username");

  return posts;
};

export { createPost, getPosts };
