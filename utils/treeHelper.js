// utils/treeHelper.js
const buildTree = async (userId) => {
  const user = await User.findById(userId).populate("children"); // Populate children
  if (!user) return null; // If user not found, return null

  const children = await Promise.all(
    user.children.map((child) => buildTree(child._id)) // Recursively build tree for each child
  );

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    children: children.filter(Boolean), // Filter out any null children
  };
};

const getUserTree = async (req, res) => {
  try {
    const tree = await buildTree(req.user.id); // Ensure user is authenticated
    if (!tree) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(tree); // Send the built tree back to the client
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error building user tree", error: err.message });
  }
};

module.exports = { getUserTree };
