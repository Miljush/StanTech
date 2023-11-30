const mongoose = require("mongoose");

const prijateljstvoSchema = new mongoose.Schema({
  salje: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  prima: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Prijateljstvo", prijateljstvoSchema);
