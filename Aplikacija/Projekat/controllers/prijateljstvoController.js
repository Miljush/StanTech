const Prijateljstvo = require("../models/Prijateljstvo");
const Stanar = require("../models/Stanar");
const Stanodavac = require("../models/Stanodavac");
const User = require("../models/User");

const posaljiZahtev = async (req, res) => {
  const { prima, salje } = req.body;
  if (!prima || !salje) {
    res.status(400);
  }
  const stanodavac = await Stanodavac.findOne({ username: `${prima}` }).exec();
  const stanar = await Stanar.findOne({ username: `${salje}` }).exec();
  const check = await Prijateljstvo.findOne({
    prima: stanodavac._id,
    salje: stanar._id,
  }).exec();
  if (!stanodavac || !stanar) {
    res.sendStatus(400);
  }
  let zahtev;
  if (!check) {
    const status = "Pending";
    zahtev = await Prijateljstvo.create({
      prima: stanodavac._id,
      salje: stanar._id,
      status,
    });
  }
  return res.status(200).json(zahtev);
};

const primiZahtev = async (req, res) => {
  const { prima, salje } = req.body;
  const status = "Accepted";
  if (!prima || !salje) {
    res.status(400);
  }
  const primaObj = await Stanodavac.findOne({ username: `${prima}` }).exec();
  const saljeObj = await Stanar.findOne({ username: `${salje}` }).exec();
  const zahtev = await Prijateljstvo.findOne({
    prima: primaObj._id,
    salje: saljeObj._id,
  }).exec();
  if (!primaObj || !saljeObj || !zahtev) {
    res.sendStatus(400);
  }
  zahtev.status = status;
  primaObj.lista_stanara.push(zahtev.salje);
  saljeObj.stanuje_kod = zahtev.prima;
  await primaObj.save();
  await saljeObj.save();
  const result = await zahtev.save();
  res.status(200).json(result);
};

const odbijZahtev = async (req, res) => {
  const { prima, salje } = req.body;
  if (!prima || !salje) {
    res.sendStatus(400);
  }
  const stanar = await Stanar.findOne({ username: `${salje}` }).exec();
  const stanodavac = await Stanodavac.findOne({ username: `${prima}` }).exec();
  const zahtev = await Prijateljstvo.findOne({
    prima: stanodavac._id,
    salje: stanar._id,
  });
  await Prijateljstvo.deleteOne({ _id: zahtev._id });
  res.sendStatus(200);
};

const ukloniPrijatelja = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(400);
  }
  const zahtev = await Prijateljstvo.findById(id);
  if (!zahtev) {
    res.status(400);
  }
  const stanodavac = await Stanodavac.findById(zahtev.prima);
  const stanar = await Stanar.findById(zahtev.salje);
  if (!stanodavac || !stanar) {
    res.status(400);
  }
  const index = stanodavac.lista_stanara.indexOf(stanar._id);
  stanodavac.lista_stanara.splice(index, 1);
  stanar.stanuje_kod = undefined;
  await stanodavac.save();
  await stanar.save();
  await Prijateljstvo.deleteOne({ _id: id });
  res.sendStatus(200);
};

const vratiZahteve = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(400);
  }
  const zahtevi = await Prijateljstvo.find();
  if (!zahtevi) {
    res.status(400);
  }
  let zahteviOdUsera = [];
  zahtevi.map((zahtev) => {
    if (zahtev.prima == id && zahtev.status == "Pending") {
      zahteviOdUsera.push(zahtev);
    }
  });
  res.status(200).json(zahteviOdUsera);
};

module.exports = {
  posaljiZahtev,
  primiZahtev,
  odbijZahtev,
  ukloniPrijatelja,
  vratiZahteve,
};
