const Review = require("../models/reviewModel");
const factory = require("./handlerFactory");

exports.getAllReviews = factory.getAll(Review);

exports.setTourUserIds = (req, res, next) => {
  // ALlow nested routes if not specified in the req body
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review);
