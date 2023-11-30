const mongoose = require("mongoose");

const ocenaSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },

  stars: {
    type: Number,
    required: true,
  },
  postedby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postedfor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Ocena", ocenaSchema);
