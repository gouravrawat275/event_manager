import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal Server Error";

    if (error.name === "CastError") {
      statusCode = 404;
      message = `Resource not found with id: ${error.value}`;
    }

    if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue)[0];
      message = `Duplicate value for field '${field}'. Please use another value.`;
    }

    if (error.name === "ValidationError") {
      statusCode = 400;
      message = Object.values(error.errors)
        .map((val) => val.message)
        .join(", ");
    }

    if (error.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid token. Please log in again.";
    }
    if (error.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Your session has expired. Please log in again.";
    }

    error = new ApiError(statusCode, message);
  }

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
