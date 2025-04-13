const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const getUserTree = async (req, res) => {
  try {
    const buildTree = async (userId) => {
      const user = await User.findById(userId).populate("children");
      if (!user) return null;

      const children = await Promise.all(
        user.children.map((child) => buildTree(child._id))
      );

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        children: children.filter(Boolean),
      };
    };

    const tree = await buildTree(req.user.id);
    if (!tree) return res.status(404).json({ message: "User not found" });
    res.json(tree);
  } catch (err) {
    console.error("Tree error:", err); // 👈 helpful for debugging
    res
      .status(500)
      .json({ message: "Error building user tree", error: err.message });
  }
};

const addUser = async (req, res) => {
  try {
    const parent = req.user;
    const parentId = parent._id;

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
      password,
    } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // ✅ Step 1: Check if this parent already has 2 children
    const childCount = await User.countDocuments({ parent: parentId });
    if (childCount >= 2) {
      return res.status(400).json({ message: "You can only add 2 users." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Step 2: Create new user with parentId as both sponsor and parent
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
      sponsorId: parentId, // ✅ Always use parent's ObjectId
      parent: parentId,
      addedBy: parentId,
      password: hashedPassword,
    });

    // ✅ Step 3: Update parent's children array
    const parentUser = await User.findById(parentId);
    if (!parentUser.children) {
      parentUser.children = [];
    }
    parentUser.children.push(newUser._id);
    await parentUser.save();

    res.status(201).json({ message: "User added successfully", newUser });
  } catch (err) {
    console.error("❌ Error adding user:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Updated getMyChildren to check both parent and addedBy
// Backend: controller for /api/users/my-children
const getMyChildren = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("children");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ children: user.children });
    console.log("Fetched user's children:", user.children);
  } catch (err) {
    console.error("❌ Error fetching children:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching user by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addUser, getMyChildren, getUserById, getUserTree };
