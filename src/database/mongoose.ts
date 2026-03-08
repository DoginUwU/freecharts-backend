import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_URI!, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
