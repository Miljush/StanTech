const jwt = require("jsonwebtoken");
const User = require("../models/User");
const handleUserInfo = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userInfo) => {
      if (err) {
        throw err;
      }
      const { username, ime, prezime, brtelefona, slika, _id, role, email } =
        await User.findById(userInfo.id);
      res.json({ username, ime, prezime, brtelefona, slika, _id, role, email });
    });
  } else {
    res.json(null);
  }
};
module.exports = { handleUserInfo };
