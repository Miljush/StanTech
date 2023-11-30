const mongoose = require("mongoose");
const oglasSchema = new mongoose.Schema({
  ime: {
    type: String,
    required: true,
  },
  opis: {
    type: String,
    required: true,
  },
  putanja_slike: [
    {
      type: String,
      required: true,
    },
  ],
  stanodavac: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stanodavac",
    required: true,
  },
});

module.exports = mongoose.model("Oglas", oglasSchema);
