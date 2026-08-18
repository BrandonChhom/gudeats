// codeProjects/gudeats/backend/src/models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
