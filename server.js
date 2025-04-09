const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes); // ✅ This mounts /api/auth/login

// Test route
app.get("/api/users/test", (req, res) => {
  res.json({ message: "✅ Backend working" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(5000, () => console.log("🚀 Server started on port 5000"))
  )
  .catch((err) => console.error("MongoDB connection error:", err));
