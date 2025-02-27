const express = require("express");
const router = express.Router({
  // access tourId from the tourRouter
  mergeParams: true,
});

const { protect, restrictTo } = require("../controllers/authController");

const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
} = require("../controllers/reviewController");

router.use(protect);

// POST /tour/1313se/reviews
// GET /tour/1313se/reviews
// GET /tour/1313se/reviews/318938s
// POST /reviews
router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user"), setTourUserIds, createReview);

router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("user", "admin"), updateReview)
  .delete(restrictTo("user", "admin"), deleteReview);

module.exports = router;
