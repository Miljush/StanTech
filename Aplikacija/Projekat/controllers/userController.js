const User = require("../models/User");
const getUser = async (req, res) => {
  const id = req.body.id;
  try {
    const user = await User.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such User");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports = { getUser };
