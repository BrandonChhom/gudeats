// codeProjects/gudeats/backend/src/services/feedService.js

import Post from "../models/Post.js";
import getCurrentWeekRange from "../utils/weekRange.js";

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

const getWeeklyFeed = async ({ limit, skip }) => {
  const { start, end } = getCurrentWeekRange();

  const parsedLimit = Math.min(Number(limit) || DEFAULT_LIMIT, MAX_LIMIT);
  const parsedSkip = Math.max(Number(skip) || 0, 0);

  const posts = await Post.find({ createdAt: { $gte: start, $lt: end } })
    .sort({ createdAt: -1 })
    .skip(parsedSkip)
    .limit(parsedLimit)
    .populate("authorId", "username");

  return { posts, weekStart: start, weekEnd: end };
};

export { getWeeklyFeed };
