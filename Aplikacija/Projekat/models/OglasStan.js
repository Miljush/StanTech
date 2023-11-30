const mongoose = require("mongoose");
const Oglas = require("./Oglas");

const oglasStanSchema = new mongoose.Schema({
  adresa: {
    type: String,
    required: true,
  },
  brojSoba: {
    type: String,
    required: true,
  },
  dostupnost: {
    type: Boolean,
    default: true,
  },
  tipGrejanja: {
    type: String,
    required: true,
  },
  dodaci: [
    {
      type: String,
      required: true,
    },
  ],
  cena:{
    type: Number,
    required: true,
  },
  povrsina:{
    type: Number,
    required:true
  }
});

module.exports = Oglas.discriminator("OglasStan", oglasStanSchema);
