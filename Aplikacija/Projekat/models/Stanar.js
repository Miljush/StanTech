const mongoose = require("mongoose");
const User = require("./User");

const stanarSchema = new mongoose.Schema({
  stanuje_kod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stanodavac",
  },
  role: {
    type: String,
    default: "Stanar",
  },
});

module.exports = User.discriminator("Stanar", stanarSchema);
