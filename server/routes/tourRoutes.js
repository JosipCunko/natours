const express = require("express");

const router = express.Router(); //middleware, mini app
const {
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
} = require("../controllers/tourController");
const { protect, restrictTo } = require("../controllers/authController");
const reviewRouter = require("../routes/reviewRoutes");

//For some reason it needs to be first to be called
router.route("/top-5").get(aliasTopTours, getAllTours); //Manipulates the query object
router.route("/tour-stats").get(getTourStats);
router
  .route("/monthly-plan/:year", protect, restrictTo("admin", "lead-guide"))
  .get(getMonthlyPlan);

// router.param("id", checkId);

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(getToursWithin);
//tours-within?distance=300&center=40,40&unit=km

router.route("/distances/:latlng/unit/:unit").get(getDistances);

router
  .route("/")
  .get(getAllTours)
  .post(protect, restrictTo("admin", "lead-guide"), createTour);
// .post(checkBody, createTour); runs middleware before createTour

router
  .route("/:id")
  .get(getTourById)
  .patch(
    protect,
    restrictTo("admin", "lead-guide"),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

// router
//   .route("/:tourId/reviews")
//   .post(protect, restrictTo("user"), createReview);
//router is actually a middleware, mounting a router
router.use("/:tourId/reviews", reviewRouter);

module.exports = router;
