const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); // ✅ use only this

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // ✅ do not duplicate

// Optional test route
app.get("/api/users/test", (req, res) => {
  res.json({ message: "✅ Test route working!" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(5000, () => console.log("🚀 Server started on port 5000"))
  )
  .catch((err) => console.error("MongoDB Error:", err));
