const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const compression = require("compression");

const app = express();
//1) GLOBAL MIDDLEWARES - fns that modifes incoming request data
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Rate limiter
const limiter = rateLimit({
  //100 req pre hour from the same IP
  max: 100,
  windowMs: 60 * 60 * 100,
  message: "Too many requests from this IP, please try again in an hour!",
});
//if app crashes, the limit WILL be reset
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:8000", credentials: true }));

// Data sanitization against NoSQL query injection
//Basically filters out all of the $, dots... ($gt)
app.use(mongoSanitize());

// Data sanitization against XSS
// Prevent inserting html code maybe with some js
app.use(xss());

// Prevent parameter pollution
// Removes duplicate fields in the query
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

//Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//   console.log("Hello from the middleware");
//   next();
// });

//Compress all the text sent to client
app.use(compression());

//Set request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

//2) ROUTES == midleware fns - order matters
// Mounting the router
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

//If none of the routes matched, use this:
//All http verbs
app.all("*", (req, res, next) => {
  //If next receives arg, mongoose will assume it is an error
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Error handling middleware
app.use(globalErrorHandler);
module.exports = app;
