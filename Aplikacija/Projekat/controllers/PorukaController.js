const Poruke = require("../models/Poruke");

const dodajPoruku = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new Poruke({
    chatId,
    senderId,
    text,
  });
  message.chatID = chatId;
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const izbrisiPoruke = async(req,res)=>{
  try {
    const poruke = await Poruke.find();
    if (!poruke) {
      return res.sendStatus(400);
    } else {
      await Poruke.deleteMany({});
      res.json(poruke);
    }
  } catch (err) {
    console.error(err);
  }
}

const preuzmiPoruke = async (req, res) => {
  const { chatId } = req.body;
  try {
    const result = await Poruke.find({ chatID: chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports = {
  dodajPoruku,
  preuzmiPoruke,
  izbrisiPoruke
};
