const mongoose = require("mongoose");

const kalendarSchema = new mongoose.Schema({
  datum: {
    type: Date,
    required: true,
  },
  stanar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stanar",
    required: true,
  },
});

module.exports = mongoose.model("Kalendar", kalendarSchema);
