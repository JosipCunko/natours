const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const Booking = require("../models/bookingModel");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    //NEXTJS ROUTE HANDLER
    success_url: `https://natours-zeta-six.vercel.app/api/bookings/?tour=${req.params.tourId}&price=${tour.price}`,
    cancel_url: `https://natours-zeta-six.vercel.app/tour/${tour.id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: tour.price * 100, //cents
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://natours.dev/img/tours/${tour.imageCover}`], //CHANGE
          },
        },

        quantity: 1,
      },
    ],
    mode: "payment",
  });

  // 3) Send to client
  res.status(200).json({
    status: "success",
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, price } = req.body;
  const user = req.user.id; // Get user ID from authenticated user

  if (!tour || !price) {
    return next(new AppError("Please provide tour and price", 400));
  }

  await Booking.create({
    tour,
    user,
    price: Number(price), // Ensure price is a number
  });

  res.status(201).json({
    status: "success",
    data: {
      booking: { tour, user, price },
    },
  });
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
