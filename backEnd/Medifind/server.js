require("dotenv").config();

const mongoose = require("mongoose");
const server = require("./main");

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Database connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error);

    process.exit(1);
  }
};

startServer();