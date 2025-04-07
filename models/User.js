// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
