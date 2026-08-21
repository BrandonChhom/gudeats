// codeProjects/gudeats/backend/src/controllers/userController.js

import { getUserProfile, getUserPosts } from "../services/userService.js";

const profile = async (req, res, next) => {
  try {
    const user = await getUserProfile({ username: req.params.username });

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const posts = async (req, res, next) => {
  try {
    const { limit, skip } = req.query;

    const posts = await getUserPosts({
      username: req.params.username,
      limit,
      skip,
    });

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

export { profile, posts };
