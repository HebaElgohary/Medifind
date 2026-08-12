const express = require("express");
const cors = require("cors");

const connectDB = require("./lib/db");

const userRouter = require("./Router/UserRouter.service.js");
const medicineRouter = require("./Router/medicineRouter.service.js");
const requestRouter = require("./Router/requestRouter.service.js");
const reviewRouter = require("./Router/reviewRouter.service.js");

const server = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://medifindui.netlify.app",
  'https://medifind-front.vercel.app'
];

server.use(
  cors({
    origin: allowedOrigins,
    exposedHeaders: ["x-auth-token"],
  })
);

server.use(express.json());

server.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("❌ Database connection failed:", error);

    res.status(500).json({
      error: "Database connection failed",
    });
  }
});

server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

server.use(userRouter);
server.use(medicineRouter);
server.use(requestRouter);
server.use(reviewRouter);

server.use((req, res) => {
  res.status(404).send("Not Found");
});

server.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    error: err.message || "Server Error",
  });
});

module.exports = server;