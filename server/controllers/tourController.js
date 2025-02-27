const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const sharp = require("sharp");
const multer = require("multer");

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
exports.uploadTourImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);
//upload.single("image") req.file
//upload.array("images", 5) req.files

exports.resizeTourImages = async (req, res, next) => {
  // console.log(req.files);
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  //Put that filename on req.body for updateOne
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333) // 3:2 ratio
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`../client/public/img/tours/${req.body.imageCover}`);

  // 2) Images
  //Put that filename to req.body.images ([])
  req.body.images = [];

  //If not like this, next() will be called because the async is happening in the forEach, WOULD NOT WORK AT ALL
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`../client/public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );
  // console.log(req.body);

  next();
};

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//Practice for Middleware
// exports.checkId = (req, res, next, val) => {
//   if (req.params.id * 1 > tours.length - 1) {
//     //Needs to return
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }
//   next();
// };

//ROUTE HANDLERS
exports.getAllTours = factory.getAll(Tour);

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = "5"; //There are strings
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getTourById = factory.getOne(Tour, { path: "reviews" });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

//.find => returns a query
//.aggregate => returns an aggregate object

exports.getTourStats = catchAsync(async (req, res, next) => {
  //Manipulate the data in steps
  //Regular query
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: "$difficulty" }, //GROUPING
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    // { $match: { _id: { $ne: "EASY" } } }, //Excluding "EASY"
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    { $unwind: "$startDates" },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: "$startDates",
        },
        numTourStarts: { $sum: 1 },
        tours: {
          $push: "$name",
        },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    {
      $project: {
        _id: 0, //Hidden
      },
    },
    {
      $sort: {
        numToursStarts: -1,
      },
    },
    { $limit: 12 },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  //MongoDB needs radians
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError("Please provide your position in the format lat,lng", 400)
    );
  }
  //Finds documents within a certain geometry (lat,lng) + distance radius
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError("Please provide your position in the format lat,lng", 400)
    );
  }

  const distances = await Tour.aggregate([
    {
      //Only one geospatial stage
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      data: distances,
    },
  });
});
