const mongoose = require("mongoose");
const User = require("./User");

const majstorSchema = new mongoose.Schema({
  kalendar: [
    {
      kalendar: { type: mongoose.Schema.Types.ObjectId, ref: "Kalendar" },
    },
  ],
  usluge: [
    {
      type: String,
      required: true,
    },
  ],
  role: {
    type: String,
    default: "Majstor",
  },
});

module.exports = User.discriminator("Majstor", majstorSchema);
