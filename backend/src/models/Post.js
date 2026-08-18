// codeProjects/gudeats/backend/src/models/Post.js

import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    caption: {
      type: String,
      trim: true,
    },
    recipe: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", postSchema);

export default Post;
