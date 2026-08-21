// codeProjects/gudeats/backend/src/app.js

/* 
description: connects routes and middleware
*/

// imports
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import feedRoutes from "./routes/feedRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// json parsing middleware
app.use(express.json());

// cookie parsing middleware
app.use(cookieParser());

// defining routes
app.get("/api/health", (req, res) => {
  // parsed data accessible via req.body now
  res.json({
    status: "OK",
    message: "GudEats API is running!",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/users", userRoutes);

// error handling middleware (must be last)
app.use(errorHandler);

export default app;
