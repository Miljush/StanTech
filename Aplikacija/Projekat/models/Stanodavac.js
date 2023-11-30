const mongoose = require("mongoose");
const User = require("./User");

const stanodavacSchema = new mongoose.Schema({
  lista_stanara: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stanar",
    },
  ],
  lista_oglasa: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Oglas",
    },
  ],
  role: {
    type: String,
    default: "Stanodavac",
  },
});

module.exports = User.discriminator("Stanodavac", stanodavacSchema);
