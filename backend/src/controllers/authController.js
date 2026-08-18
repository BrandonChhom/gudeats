// codeProjects/gudeats/backend/src/controllers/authController.js

import { registerUser, loginUser } from "../services/authService.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const { user, token } = await registerUser({ username, email, password });

    res.cookie("token", token, cookieOptions);

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser({ email, password });

    res.cookie("token", token, cookieOptions);

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
    });

    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
};

export { register, login, me, logout };
