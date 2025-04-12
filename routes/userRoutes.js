const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure this is correctly imported
const {
  addUser,
  getMyChildren,
  getUserById,
  getUserTree,
} = require("../controllers/userController");

const router = express.Router();

// Routes
router.post("/add-user", authMiddleware, addUser); // Add authMiddleware here
router.get("/my-children", authMiddleware, getMyChildren); // Add authMiddleware here
router.get("/:id", authMiddleware, getUserById); // Add authMiddleware here
router.get("/tree", authMiddleware, getUserTree); // Add authMiddleware here

module.exports = router;
