const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); //401 je unauthorized request
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    jwt.sign(
      { username: foundUser.username, id: foundUser._id ,role:foundUser.role},
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) {
          throw err;
        }
        res.cookie("token", token).json(foundUser);
      }
    );
  } else {
    res.sendStatus(400);
  }
};

module.exports = { handleLogin };
