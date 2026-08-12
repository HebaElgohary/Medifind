const mongoose = require("mongoose");
const server = require("../main");

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(process.env.MONGO_URI);

  isConnected = true;

  console.log("✅ MongoDB connected");
}

module.exports = async (req, res) => {
  try {
    await connectDB();

    return server(req, res);
  } catch (error) {
    console.error("❌ Database connection failed:", error);

    return res.status(500).json({
      error: "Database connection failed",
    });
  }
};