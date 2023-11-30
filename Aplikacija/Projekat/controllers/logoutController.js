const handleLogout = (req, res) => {
  res.cookie("token", "").json(true);
};

module.exports = { handleLogout };
