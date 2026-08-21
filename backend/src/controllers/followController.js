// codeProjects/gudeats/backend/src/controllers/followController.js

import { followUser, unfollowUser, getFollowStatus } from "../services/followService.js";

const follow = async (req, res, next) => {
  try {
    const result = await followUser({
      followerId: req.user.id,
      username: req.params.username,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const unfollow = async (req, res, next) => {
  try {
    const result = await unfollowUser({
      followerId: req.user.id,
      username: req.params.username,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const status = async (req, res, next) => {
  try {
    const result = await getFollowStatus({
      followerId: req.user.id,
      username: req.params.username,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export { follow, unfollow, status };
