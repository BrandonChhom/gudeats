// codeProjects/gudeats/backend/src/controllers/likeController.js

import { likePost, unlikePost, getLikeStatus } from "../services/likeService.js";

const like = async (req, res, next) => {
  try {
    const result = await likePost({
      postId: req.params.postId,
      userId: req.user.id,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const unlike = async (req, res, next) => {
  try {
    const result = await unlikePost({
      postId: req.params.postId,
      userId: req.user.id,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const status = async (req, res, next) => {
  try {
    const result = await getLikeStatus({
      postId: req.params.postId,
      userId: req.user?.id,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export { like, unlike, status };
