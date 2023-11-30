const mongoose = require("mongoose");
const Oglas = require("./Oglas");

const oglasMajstorSchema = new mongoose.Schema({
  adresa: {
    type: String,
    required: true,
  },
  stanar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stanar",
    required: true,
  },
});

module.exports = Oglas.discriminator("OglasMajstor", oglasMajstorSchema);
