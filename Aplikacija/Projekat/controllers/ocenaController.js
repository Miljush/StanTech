const Ocena = require("../models/Ocena");
const User = require("../models/User");

const vratiOcene = async (req, res) => {
  try {
    const ocene = await Ocena.find();
    if (!ocene) {
      return res.sendStatus(400);
    } else {
      res.json(ocene);
    }
  } catch (err) {
    console.error(err);
  }
};

const vratiOcenu = async (req, res) => {
  const id = req.body.id;
  if (!id) return res.sendStatus(400);
  try {
    const ocena = await Ocena.findOne({ _id: `${id}` }).exec();

    if (!ocena) {
      return res.sendStatus(400);
    } else {
      res.json(ocena);
    }
  } catch (err) {
    console.error(err);
  }
};

const dodajOcenu = async (req, res) => {
  if (
    !req?.body?.description ||
    !req?.body?.stars ||
    !req?.body?.postedby ||
    !req?.body?.postedfor
  ) {
    return res.sendStatus(400);
  }
  try {
    const user = await User.findOne({ _id: `${req.body.postedfor}` }).exec();
    if (!user) {
      return res
        .sendStatus(400)
        .json({ message: `User with ID ${req.body.postedfor} not found!` });
    }
    const ocena = await Ocena.create({
      description: req.body.description,
      stars: req.body.stars,
      postedby: req.body.postedby,
      postedfor: req.body.postedfor,
    });
    user.ocene.push(ocena._id);
    const resultUser = await user.save();
    res.json({ ocena: ocena, user: resultUser });
  } catch (err) {
    console.error(err);
  }
};

const izmeniOcenu = async (req, res) => {
  const id = req.body.id;
  if (!id) return res.sendStatus(400);
  try {
    const ocena = await Ocena.findOne({ _id: `${id}` }).exec();
    if (!ocena) {
      return res.sendStatus(400);
    } else {
      if (req.body?.description) ocena.description = req.body.description;
      if (req.body?.stars) ocena.stars = req.body.stars;
      const result = await ocena.save();
      res.json(result);
    }
  } catch (err) {
    console.error(err);
  }
};

const obrisiOcenu = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Potreban je ID za brisanje" });
  }
  try {
    const ocena = await Ocena.findById(id);
    const user = await User.findById(ocena.postedfor);
    if (!ocena || !user) {
      return res
        .status(400)
        .json({ message: `There is no ocena with id ${id}` });
    }
    let index = -1;
    for (let i = 0; i < user.ocene.length; i++) {
      if (user.ocene[i]._id.toString() == ocena._id.toString()) {
        index = i;
      }
    }
    if (index != -1) {
      const x = user.ocene.splice(index, 1);
    } else {
      console.log("Ocena nije pronadjena kod korisnika!");
    }
    await user.save();
    await Ocena.deleteOne({ _id: id });
    return res.status(200).json({ message: "Ocena deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  dodajOcenu,
  izmeniOcenu,
  vratiOcene,
  vratiOcenu,
  obrisiOcenu,
};
