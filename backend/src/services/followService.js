// codeProjects/gudeats/backend/src/services/followService.js

import Follow from "../models/Follow.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

const findTargetUser = async (username) => {
  const targetUser = await User.findOne({ username }).select("_id");
  if (!targetUser) {
    throw new AppError("User not found", 404);
  }
  return targetUser;
};

const followUser = async ({ followerId, username }) => {
  const targetUser = await findTargetUser(username);

  if (targetUser._id.equals(followerId)) {
    throw new AppError("You cannot follow yourself", 400);
  }

  try {
    await Follow.create({ followerId, followingId: targetUser._id });
  } catch (error) {
    // duplicate follow: already following, treat as a no-op so the endpoint is idempotent
    if (error.code !== 11000) {
      throw error;
    }
  }

  return { following: true };
};

const unfollowUser = async ({ followerId, username }) => {
  const targetUser = await findTargetUser(username);

  await Follow.deleteOne({ followerId, followingId: targetUser._id });

  return { following: false };
};

const getFollowStatus = async ({ followerId, username }) => {
  const targetUser = await findTargetUser(username);

  const existingFollow = await Follow.exists({
    followerId,
    followingId: targetUser._id,
  });

  return { following: Boolean(existingFollow) };
};

export { followUser, unfollowUser, getFollowStatus };
