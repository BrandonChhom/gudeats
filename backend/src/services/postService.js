// codeProjects/gudeats/backend/src/services/postService.js

import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import AppError from "../utils/AppError.js";
import { deleteImageFromCloudinary } from "../utils/uploadImageToCloudinary.js";

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

const createPost = async ({
  authorId,
  imageUrl,
  imagePublicId,
  foodLabel,
  foodConfidence,
  caption,
  recipe,
  location,
}) => {
  if (!imageUrl) {
    throw new AppError("Post must include an image", 400);
  }

  const post = await Post.create({
    authorId,
    imageUrl,
    imagePublicId,
    foodLabel,
    foodConfidence,
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

const deletePost = async ({ postId, userId }) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (!post.authorId.equals(userId)) {
    throw new AppError("You can only delete your own posts", 403);
  }

  await Promise.all([
    Like.deleteMany({ postId }),
    Comment.deleteMany({ postId }),
  ]);

  await post.deleteOne();

  // best-effort: deleteImageFromCloudinary already swallows its own errors
  if (post.imagePublicId) {
    await deleteImageFromCloudinary(post.imagePublicId);
  }

  return { deleted: true };
};

export { createPost, getPosts, deletePost };
