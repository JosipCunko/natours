const Booking = require("../models/bookingModel");
const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "../client/public/img/users");
//   },
//   filename: (req, file, callback) => {
//     // user-userId-timestamp.ext
//     const extension = file.mimetype.split("/")[1];
//     callback(null, `user-${req.user.id}-${Date.now()}.${extension}`);
//   },
// });
//Image will be stored as a buffer, filename wont get set, we need in updateMe
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) callback(null, true);
  else
    callback(
      new AppError("Not an image! Please upload only images", 400),
      false
    );
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadUserPhoto = upload.single("photo");

//ROUTE HANDLERS
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`../client/public/img/users/${req.file.filename}`);

  //updateMe
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        "This route is not for password updates. Please use /updatemypassword",
        400
      )
    );

  // body.role = "admin", passwordTokenExpires, reset token => big mistake
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  // 2) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, //returns the updatedObject instead of an old one
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

//Marking the user to inactive, rather than deleting it from DB
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getMe = (req, res, next) => {
  //For getOne
  req.params.id = req.user.id;
  next();
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

exports.getAllUsers = factory.getAll(User);
exports.getUserById = factory.getOne(User);
//For admin, Do nOt update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

//Would also work with virtual populate
exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  //Find tours with the returned IDs
  const tourIds = bookings.map((el) => el.tour);
  const tour = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).json({ status: "success", data: tour });
});
