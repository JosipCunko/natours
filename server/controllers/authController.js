const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  //Cookie - text that server sends to the client, receive => store => send back in all future requests to that server

  const cookieOptions = {
    //Browser deletes cookie after it expires
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, //not accessible  or modified by the browser
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };

  //secure:true => on https, encrypted connection

  res.cookie("jwt", token, cookieOptions);

  //Remove password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  //Make sure there is no admin role
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const url = `https://natours-zeta-six.vercel.app/me`;
  await new Email(newUser, url).sendWelcome();

  createAndSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide meail and password!", 400));
  }

  // Check if user exists && password is correct
  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401)); //Unauthorized
  }

  //Send token to the client
  createAndSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  // Change the text of the jwt cookie, affectively as logging users out
  res.cookie("jwt", "Logged out", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get the token, check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );

  // 2) Validate the token / Verification (Data has changed or the token has expired)
  const decodedPayload = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  // 3) Check if user still exists
  const freshUser = await User.findById(decodedPayload.id);
  if (!freshUser)
    return next(
      new AppError("The user belonging to this token does not longer exists.")
    );

  // 4) Check if user has changed password after the token wass issued
  if (freshUser.changedPasswordAfter(decodedPayload.iat))
    return next(
      new AppError(
        "User recently has changed password! Please log in again.",
        401
      )
    );

  req.user = freshUser;
  //Grant access to protected route
  next();
});

//Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decodedPayload = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUser = await User.findById(decodedPayload.id);
      if (!currentUser) return next();

      if (currentUser.changedPasswordAfter(decodedPayload.iat)) return next();

      //If all of this happens, there is a logged in user
      //Only for pug templates
      res.locals.user = currentUser;
      return next();
    } catch {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user base on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError("There is no user with email address.", 404));

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  //Save, deactive all the validators
  await user.save({ validateBeforeSave: false });

  // 3) Sent it to user's email
  const resetPassURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetPassURL}\n If you didn't forget your password, please ignore this email.`;

  try {
    await new Email(user, resetPassURL).sendPasswordReset(message);

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError(error.message, 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  //Query the db based on this token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user. set the new passowrd
  if (!user) return next(new AppError("Token is invalid or has expired!", 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user

  // 4) Log the user in, send JWT
  createAndSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get the user
  //Logged in user is in req
  const user = await User.findById(req.user.id).select("+password");
  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password)))
    return next(new AppError("Your current password is incorrect.", 401));

  // 3) Update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //User.findByIdAndUpdate will NOT work

  // 4) Log user in, send JWT
  createAndSendToken(user, 200, req, res);
});
