// codeProjects/gudeats/backend/src/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";

  // Mongo duplicate key error (race between findOne check and create)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    message = `${field} already in use`;
  }

  // Multer upload errors (file too large, unexpected field, etc.)
  if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Image must be smaller than 5MB";
    }
  }

  // Malformed MongoDB ObjectId in a route param (e.g. :postId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  res.status(statusCode).json({
    error: {
      message,
    },
  });
};

export default errorHandler;
