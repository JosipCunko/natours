const mongoose = require("mongoose");
const slugify = require("slugify");
// const validator = require("validator");
// const User = require("./userModel");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxLength: [40, "A tour name must have less or equal the 40 chars"],
      minLength: [10, "A tour name must have more or equal the 10 chars"],
      // validate: [validator.isAlpha, "Your name must only contain characters"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      //Doesnt work with Numbers
      enum: {
        values: ["difficult", "easy", "medium"],
        message: "Difficulty is either: easy, medium or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: 1,
      //Works with dates
      min: [1, "A rating must be above 1.0 "],
      max: [5, "A rating must be below 5.0 "],
      //Setter fn
      set: (val) => Math.round(val * 10) / 10, // 4.6667, 46.667, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(value) {
          // this only points to current doc on NEW document creation
          return value < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(), //In Mongo, immediately converted to a real date
      select: false, //Permanently hidden
    },
    startDates: [Date], //Mongo parses many formats to a real date
    secretTour: {
      type: Boolean,
      default: false,
    },
    //Geospatial data => locations with lat and lng
    startLocation: {
      //GeoJSON - geospatial data
      //Embedded object, subfields
      type: {
        type: String,
        default: "Point", //Polygons, lines...
        enum: ["Point"], // Only allow point
      },
      coordinates: [Number], // array of nums
      address: String,
      description: String,
    },
    //Embedded documents - create brand new documents inside this locations arr
    //These are really documents, and not just objects, they will get the _id
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: Array, - embedding
    // Child referencing
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  {
    //Options
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Makes much faster for MongoDB engine to find the queried docs
// tourSchema.index({ price: 1 });
//Set the indexes on fields which will be queried the most
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

//Geospatial
tourSchema.index({ startLocation: "2dsphere" });

//Virtual property - cant be used in a query, not part of the DB
tourSchema.virtual("durationWeeks").get(function() {
  return this.duration / 7; //Points to the current document
});

// Virtual populate - keep a reference from a child to a parent without persisting that data in the DB
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour", //In reviewModel, we have tour and user
  localField: "_id", // That tour line above is called _id in tourModel
});

//Document middleware: Runs before an event (.save() or .create())
tourSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Embedding
//Need to do that also for updating guides => child referencing
// tourSchema.pre("save", async function(next) {
//   const guidesPromises = this.guides.map(
//     async (userId) => await User.findById(userId)
//   );
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

//Query middleware
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.startTime = Date.now();
  next();
});
tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${new Date() - this.startTime} milliseconds.`);
  // console.log(docs); //All documents that matched the query

  next();
});

//Populating with the query (tour guides) = replace the fields with the actual data => it is like it has been embedded
//Also remove __v and passwordChangeAt
// Populate will create a new query in order to create this connection
tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangeAt",
  });
  next();
});

//Exclude secret tours in aggregation also
//Aggregation middleware
tourSchema.pre("aggregate", function(next) {
  //Add matched stage to the coming aggregate

  if (!Object.keys(this.pipeline()[0])[0] === "$geoNear")
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  // console.log(this.pipeline());

  next();
});

//Model is like a class
const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
