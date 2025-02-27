const AppError = require("../utils/appError");

//Transform weird Mongoose error to a operational error with a readable msg
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use another name!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("❌", err);

    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleExpiredTokenError = () => {
  new AppError("Your token has expired. Please log in again!", 401);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production ") {
    let error = { ...err };
    error.message = err.message;
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error._message === "Validation failed") {
      error = handleValidationErrorDB(error);
    }
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if ((error.name = "TokenExpiredError")) error = handleExpiredTokenError();
    sendErrorProd({ ...error, message: err.message }, res);
  }
};
