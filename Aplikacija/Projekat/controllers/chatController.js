const Chat = require("../models/Chat");
const User = require("../models/User");

const createChat = async (req, res) => {
  const newChat = new Chat({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
const createChat1 = async (req, res) => {
  const id = req.body.id;
  const username = req.body.username;
  const user = await User.findOne({ username }).exec();
  if (user == null) {
    return res.status(100).json({ messageP: "Nije moguce kreirati chat." });
  }
  if (id == null) {
    return res.status(100).json({ messageP: "Nije moguce kreirati chat." });
  }
  if (id.toString() == user._id.toString()) {
    return res.status(100).json({ messageP: "Nije moguce kreirati chat." });
  }
  const existingChat = await Chat.findOne({
    members: { $all: [id.toString(), user._id.toString()] },
  });
  if (existingChat) {
    return res.status(300).json({ messageP: "Razgovor vec postoji" });
  }
  const newChat = new Chat({
    members: [id.toString(), user._id.toString()],
  });
  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
const userChats = async (req, res) => {
  try {
    const chat = await Chat.find({
      members: { $elemMatch: { $eq: req.body.userId } },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

const findChat = async (req, res) => {
  try {
    const chat = await Chat.find({
      members: { $all: [req.body.firstId, req.body.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports = { userChats, findChat, createChat, createChat1 };
