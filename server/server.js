const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNHANDLED EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

//read the config file, save them as environment variables
dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<DB_PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB connection successful");
  });

const server = app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err);
  //Wait for requests before crashing
  server.close(() => {
    process.exit(1);
  });
});
