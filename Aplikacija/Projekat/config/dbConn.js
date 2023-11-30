const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://ukila2001:8gBlqnaHfiQZRWcr@cluster0.uf9g2cu.mongodb.net/StanTech?retryWrites=true&w=majority`
    );
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
