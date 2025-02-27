const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

//Factory function => returns a handler fn for every resource (get, create, update, delete), generalization of handlers

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new AppError("No document found with that ID", 404));
    }

    //204 - No content
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //returns the updated document,
      runValidators: true, //runs the validators in the schema
    });

    if (!document) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // const newTour = new Tour(req.body);
    // newTour.save();
    const document = await Model.create(req.body); //req.body => data that comes with the post request

    res.status(201).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const document = await query;

    if (!document) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    //To allow for nested GET reviews on tour, only for that
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    //EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const document = await features.query.explain();
    const document = await features.query;

    //Send json - sets content-type to app/json
    res.status(200).json({
      //JSend
      status: "success",
      results: document.length,
      // requestTime: req.requestTime,
      data: {
        data: document,
      },
    });
  });
