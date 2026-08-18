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

  res.status(statusCode).json({
    error: {
      message,
    },
  });
};

export default errorHandler;
