// codeProjects/gudeats/backend/src/controllers/feedController.js

import { getWeeklyFeed } from "../services/feedService.js";

const list = async (req, res, next) => {
  try {
    const { limit, skip } = req.query;

    const { posts, weekStart, weekEnd } = await getWeeklyFeed({ limit, skip });

    res.status(200).json({ posts, weekStart, weekEnd });
  } catch (error) {
    next(error);
  }
};

export { list };
