// codeProjects/gudeats/backend/src/middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new AppError("Not authenticated", 401);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new AppError("Not authenticated", 401);
    }

    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user) {
      throw new AppError("Not authenticated", 401);
    }

    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default protect;
