// codeProjects/gudeats/backend/src/services/likeService.js

import Like from "../models/Like.js";
import Post from "../models/Post.js";
import AppError from "../utils/AppError.js";

const likePost = async ({ postId, userId }) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  try {
    await Like.create({ postId, userId });
  } catch (error) {
    // duplicate like: already liked, treat as a no-op so the endpoint is idempotent
    if (error.code !== 11000) {
      throw error;
    }
  }

  const likeCount = await Like.countDocuments({ postId });

  return { liked: true, likeCount };
};

const unlikePost = async ({ postId, userId }) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  await Like.deleteOne({ postId, userId });

  const likeCount = await Like.countDocuments({ postId });

  return { liked: false, likeCount };
};

const getLikeStatus = async ({ postId, userId }) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const [likeCount, userLike] = await Promise.all([
    Like.countDocuments({ postId }),
    userId ? Like.exists({ postId, userId }) : null,
  ]);

  return { liked: Boolean(userLike), likeCount };
};

export { likePost, unlikePost, getLikeStatus };
