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
    res.json(tree);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error building user tree", error: err.message });
  }
};

const getMyChildren = async (req, res) => {
  try {
    const userId = req.user.id;
    const children = await User.find({ sponsorId: userId }); // or whatever field you're using to link parent-child
    res.json(children);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch child users", error: err.message });
  }
};

module.exports = { getUserTree, getMyChildren };
