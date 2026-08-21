// codeProjects/gudeats/backend/src/services/userService.js

import User from "../models/User.js";
import Post from "../models/Post.js";
import AppError from "../utils/AppError.js";

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

const getUserProfile = async ({ username }) => {
  const user = await User.findOne({ username }).select("username createdAt");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

const getUserPosts = async ({ username, limit, skip }) => {
  const user = await User.findOne({ username }).select("_id");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const parsedLimit = Math.min(Number(limit) || DEFAULT_LIMIT, MAX_LIMIT);
  const parsedSkip = Math.max(Number(skip) || 0, 0);

  const posts = await Post.find({ authorId: user._id })
    .sort({ createdAt: -1 })
    .skip(parsedSkip)
    .limit(parsedLimit)
    .populate("authorId", "username");

  return posts;
};

export { getUserProfile, getUserPosts };
