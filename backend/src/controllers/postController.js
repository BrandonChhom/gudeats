// codeProjects/gudeats/backend/src/controllers/postController.js

import { createPost, getPosts } from "../services/postService.js";

const create = async (req, res, next) => {
  try {
    const { caption, recipe, location } = req.body;

    const post = await createPost({
      authorId: req.user.id,
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
