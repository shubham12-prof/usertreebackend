const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { getUserTree } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add-user", authMiddleware, async (req, res) => {
  const {
    name,
    fatherName,
    dob,
    gender,
    maritalStatus,
    phone,
    email,
    nomineeName,
    nomineeRelation,
    nomineePhone,
    address,
    pinCode,
    bankName,
    branchAddress,
    accountNo,
    accountType,
    ifscCode,
    micrNo,
    panNo,
    aadhaarNo,
    sponsorName,
    sponsorId,
    password,
  } = req.body;

  if (!password)
    return res.status(400).json({ message: "Password is required" });

  const parent = req.user.id;
  const parentUser = await User.findById(parent).populate("children");

  if (parentUser.children.length >= 2) {
    return res.status(400).json({ message: "You can only add 2 users." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    fatherName,
    dob,
    gender,
    maritalStatus,
    phone,
    email,
    nomineeName,
    nomineeRelation,
    nomineePhone,
    address,
    pinCode,
    bankName,
    branchAddress,
    accountNo,
    accountType,
    ifscCode,
    micrNo,
    panNo,
    aadhaarNo,
    sponsorName,
    sponsorId,
    password: hashedPassword,
    parent,
  });

  parentUser.children.push(newUser._id);
  await parentUser.save();

  res.status(201).json({ message: "User added successfully", newUser });
});
// Get users added by the current user
// backend/routes/userRoutes.js
router.get("/my-users", authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).populate("children");
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ users: currentUser.children });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add this route
router.get("/my-children", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const children = await User.find({ parentId: userId });
    res.json(children);
  } catch (error) {
    console.error("Error fetching children:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/tree", authMiddleware, getUserTree);
module.exports = router;
