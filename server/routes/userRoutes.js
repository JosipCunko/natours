const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
  getMyTours,
} = require("../controllers/userController");

const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
  logout,
} = require("../controllers/authController");

//They are all middlewares
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);

//Protect all of the routes which are below this, because middleware runs in sequence
router.use(protect);

router.get("/my-tours", getMyTours);

router.patch("/updatemypassword", updatePassword);
router.get("/me", getMe, getUserById);
router.patch("/updateme", uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete("/deleteme", deleteMe);

router.use(restrictTo("admin"));
router
  .route("/")
  .get(getAllUsers)
  .post(createUser);

router
  .route("/:id")
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
