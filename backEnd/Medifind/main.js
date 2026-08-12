require("dotenv").config();

const express = require("express");
const cors = require("cors");

const userRouter = require("./Router/UserRouter.service.js");
const medicineRouter = require("./Router/medicineRouter.service.js");
const requestRouter = require("./Router/requestRouter.service.js");
const reviewRouter = require("./Router/reviewRouter.service.js");

const server = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://medifindui.netlify.app",
  // هنضيف Vercel frontend هنا بعد ما نعرف الـ URL
];

server.use(
  cors({
    origin: allowedOrigins,
    exposedHeaders: ["x-auth-token"],
  })
);

server.use(express.json());

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