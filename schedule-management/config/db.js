const mongoose = require("mongoose");

mongoose.set("strictQuery", true); // Optional: Suppress deprecation warnings

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI; // Fetch MongoDB URI from .env file
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Call the connection function to establish the connection
connectDB();

// Export mongoose for use in models
module.exports = mongoose;
