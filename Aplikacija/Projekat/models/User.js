const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  brtelefona: {
    type: String,
    required: false,
  },
  slika: {
    type: String,
    required: false,
  },
  ime: {
    type: String,
    required: true,
  },
  prezime: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "User",
  },
  ocene: [
    {
      ocene: { type: mongoose.Schema.Types.ObjectId, ref: "Ocena" },
    },
  ],
});
module.exports = mongoose.model("User", userSchema);
