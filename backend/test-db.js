require("dotenv").config();
const mongoose = require("mongoose");

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Connection failed:", error.message);
  }
};

testConnection();
