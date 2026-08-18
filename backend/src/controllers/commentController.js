// codeProjects/gudeats/backend/src/controllers/commentController.js

import { addComment, getComments } from "../services/commentService.js";

const create = async (req, res, next) => {
  try {
    const { content } = req.body;

    const comment = await addComment({
      postId: req.params.postId,
      authorId: req.user.id,
      content,
    });

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const { limit, skip } = req.query;

    const comments = await getComments({
      postId: req.params.postId,
      limit,
      skip,
    });

    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
};

export { create, list };
