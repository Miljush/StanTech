const Kalendar = require("../models/Kalendar");
const Majstor = require("../models/Majstor");
const Stanar = require("../models/Stanar");

const vratiKalendare = async (req, res) => {
  try {
    const kalendar = await Kalendar.find();
    if (!kalendar) {
      return res.sendStatus(400);
    } else {
      res.json(kalendar);
    }
  } catch (err) {
    console.error(err);
  }
};

const dodajKalendar = async (req, res) => {
  if (!req?.body?.datum || !req?.body?.stanar) {
    return res.sendStatus(400);
  }
  try {
    const stanar = await Stanar.findOne({
      _id: `${req.body.stanar}`,
    }).exec();
    if (!stanar) {
      return res
        .sendStatus(400)
        .json({ message: `User with ID ${req.body.postedfor} not found!` });
    }
    const kalendar = await Kalendar.create({
      datum: req.body.datum,
      stanar: req.body.stanar,
    });
    const resultStanar = await stanar.save();
    res.json({ datum: kalendar, stanar: resultStanar });
  } catch (err) {
    console.error(err);
  }
};

const izmeniKalendar = async (req, res) => {
  const id = req.body.id;
  if (!id) return res.sendStatus(400);
  try {
    const kalendar = await Kalendar.findOne({ _id: `${id}` }).exec();
    if (!kalendar) {
      return res.sendStatus(400);
    } else {
      if (req.body?.kalendar) kalendar.kalendar = req.body.kalendar;
      if (req.body?.stanar) kalendar.stanar = req.body.stanar;
      const result = await kalendar.save();
      res.json(result);
    }
  } catch (err) {
    console.error(err);
  }
};
const obrisiKalendar = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Potreban je ID za brisanje" });
  }
  try {
    const kalendar = await Kalendar.findById(id);
    const stanar = await Stanar.findById(kalendar.stanar);
    if (!kalendar || !stanar) {
      return res.status(400).json({ message: `Nema kalendara sa ID ${id}` });
    }
    let index = -1;
    for (let i = 0; i < stanar.kalendari.length; i++) {
      if (stanar.kalendari[i]._id.toString() == kalendar._id.toString()) {
        index = i;
      }
    }
    if (index != -1) {
      const x = stanar.kalendari.splice(index, 1);
    } else {
      console.log("Kalendar nije pronadjen kod stanara!");
    }
    await stanar.save();
    await Kalendar.deleteOne({ _id: id });
    return res.status(200).json({ message: "Kalendar obrisan" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  izmeniKalendar,
  dodajKalendar,
  obrisiKalendar,
  vratiKalendare,
};
