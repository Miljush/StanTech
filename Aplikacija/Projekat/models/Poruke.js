const mongoose = require("mongoose");
const PorukaSchema = new mongoose.Schema(
  {
    chatID: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Poruke", PorukaSchema);
