const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      //This only works on SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function(next) {
  //Only run this fn if password was actually modified
  //Current doc
  if (!this.isModified("password")) return next();

  // Enycrpt/Hash the password cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete field
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function(
  canditatePassword,
  userPassword
) {
  return await bcrypt.compare(canditatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  //Not changed
  return false;
};

//No complex encrypt
userSchema.methods.createPasswordResetToken = function() {
  //Not in the DB
  const resetToken = crypto.randomBytes(32).toString("hex");

  //Encrypt in the DB
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre("save", function(next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangeAt = Date.now() - 1000;
  next();
});

//query mdw, before getAllUsers, runs with find, findByIdAndUpdate...
userSchema.pre(/^find/, function(next) {
  //this points to the current query
  this.find({
    active: {
      $ne: false,
    },
  });
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
