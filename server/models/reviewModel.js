const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty!"],
    },
    rating: {
      type: Number,
      required: [true, "A review needs to have a rating!"],
      min: [1, "A rating must be above 1.0 "],
      max: [5, "A rating must be below 5.0 "],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "A review must belong to a tour."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A review must belong to a user."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//User can write only one review on each tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: "tour",
  //   select: "name",
  // }).populate({
  //   path: "user",
  //   select: "name photo",
  // });

  //No need to populate a tour in review, now the tour will only be the tourId
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

// tourId => calc rating avg and num
// will update the corresponding document with stats
// middleware => called when there is a create, update or delete review
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  //Points to the current model
  const stats = await this.aggregate([
    {
      //Only the selected tour that we want to update
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats.at(0).nRating,
      ratingsAverage: stats.at(0).avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

//Post middleware doesn't have access to next
//After the document is saved, then calcAvRat
reviewSchema.post("save", function() {
  //this points to current review that is saved
  //Points to the model
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndDelete
// findByIdAndUpdate
//We cannot changed it to post, because we dont have access to the query, query is executed, then we cannot save the doc and run calcAverageRatings
reviewSchema.pre(/^findOneAnd/, async function(next) {
  //Execute query
  //Pass data from the pre mdw to the post
  this.r = await this.findOne(); //review
  next();
});
reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne() WON'T WORK, query has already been executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
