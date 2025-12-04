// main.js
require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routers
const userRouter = require("./Router/UserRouter.service.js");
const medicineRouter = require("./Router/medicineRouter.service.js");
const requestRouter = require("./Router/requestRouter.service.js");
const reviewRouter = require("./Router/reviewRouter.service.js");

const server = express();

// ---------- Middleware ----------

// CORS setup
server.use(
  cors({
    origin: "*", // بعد ما ترفع الفرونت للـ Netlify ممكن تحطي URL الفرانت هنا بدل "*"
    exposedHeaders: ["x-auth-token"],
  })
);

// Body parser
server.use(express.json());

// Logging middleware (اختياري)
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ---------- Routes ----------
server.use(userRouter);
server.use(medicineRouter);
server.use(requestRouter);
server.use(reviewRouter);

// ---------- 404 handler ----------
server.use((req, res, next) => {
  res.status(404).send("Not Found");
});

// ---------- Error handler ----------
server.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server Error" });
});

// ---------- DB connection and server start ----------
const PORT = process.env.PORT || 7777;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async (data) => {
    console.log("✅ Database connected");
    const collections = await data.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
  });
