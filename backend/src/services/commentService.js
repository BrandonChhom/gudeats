// codeProjects/gudeats/backend/src/services/commentService.js

import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import AppError from "../utils/AppError.js";

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

const addComment = async ({ postId, authorId, content }) => {
  if (!content || !content.trim()) {
    throw new AppError("Comment content is required", 400);
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const comment = await Comment.create({
    postId,
    authorId,
    content: content.trim(),
  });

  await comment.populate("authorId", "username");

  return comment;
};

const getComments = async ({ postId, limit, skip }) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const parsedLimit = Math.min(Number(limit) || DEFAULT_LIMIT, MAX_LIMIT);
  const parsedSkip = Math.max(Number(skip) || 0, 0);

  const comments = await Comment.find({ postId })
    .sort({ createdAt: 1 })
    .skip(parsedSkip)
    .limit(parsedLimit)
    .populate("authorId", "username");

  return comments;
};

export { addComment, getComments };
