// codeProjects/gudeats/backend/src/models/Follow.js

import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true },
);

// prevents the same user from following the same target twice at the database level
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const Follow = mongoose.model("Follow", followSchema);

export default Follow;
