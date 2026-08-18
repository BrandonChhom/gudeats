// codeProjects/gudeats/backend/src/services/authService.js

import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import AppError from "../utils/AppError.js";

const registerUser = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw new AppError("All fields are required", 400);
  }

  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }

  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedUsername || !normalizedEmail) {
    throw new AppError("Username and email are required", 400);
  }

  const existingUser = await User.findOne({
    $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
  });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username: normalizedUsername,
    email: normalizedEmail,
    passwordHash,
  });

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    token,
  };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    token,
  };
};

export { registerUser, loginUser };
