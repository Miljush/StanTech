const Stanodavac = require("../models/Stanodavac");
const Stanar = require("../models/Stanar");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const vratiStanodavca = async (req, res) => {
  const {id} = req.query;
  if (!id)
    return res
      .status(400);
  try {
    const stanodavac = await Stanodavac.findById(id);
    if (!stanodavac) {
      return res
        .status(400);
    } else {
      res.json(stanodavac);
    }
  } catch (err) {
    res.status(500);
  }
};
const vratiStanodavce = async (req, res) => {
  try {
    const stanodavci = await Stanodavac.find();
    if (!stanodavci) {
      return res
        .sendStatus(400)
        .json({ message: "You need to fill out the required fields." });
    } else {
      res.json(stanodavci);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const vratiListuStanara = async (req, res) => {
  const {idstanodavca} = req.query;
  if (!idstanodavca)
    return res
      .status(400)
      .json({ message: "You need to fill out the required fields." });
  try {
    const stanodavac = await Stanodavac.findOne({ _id: `${idstanodavca}` })
      .populate("lista_stanara")
      .exec();
    if (!stanodavac)
      return res
        .status(400)
        .json({ message: "You need to fill out the required fields." });
    const lista_stanara = stanodavac.lista_stanara;
    res.json(lista_stanara);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const azurirajStanodavca = async (req, res) => {
  const id = req.body.id;
  if (!id) {
    return res
      .sendStatus(400)
      .json({ message: "You need to fill out the required fields." });
  }
  try {
    const stanodavac = await Stanodavac.findOne({ _id: `${id}` }).exec();
    if (!stanodavac) {
      return res
        .sendStatus(400)
        .json({ message: "You need to fill out the required fields." });
    } else {
      if (req.body?.username) stanodavac.username = req.body.username;
      if (req.body?.password) stanodavac.password = req.body.password;
      if (req.body?.email) stanodavac.email = req.body.email;
      if (req.body?.brtelefona) stanodavac.brtelefona = req.body.brtelefona;
      if (req.body?.slika) stanodavac.slika = req.body.slika;
      if (req.body?.ime) stanodavac.ime = req.body.ime;
      if (req.body?.prezime) stanodavac.prezime = req.body.prezime;
      if (req.body?.lista_stanara)
        stanodavac.lista_stanara.push(req.body.lista_stanara);
      if (req.body?.lista_oglasa)
        stanodavac.lista_oglasa.push(req.body.lista_oglasa);
      const result = await stanodavac.save();
      res.json(result);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const dodajStanaraKodStanodavca = async (req, res) => {
  const { stanodavac_id, stanar_id } = req.body;

  try {
    const stanar = await Stanar.findOne({ _id: `${stanar_id}` }).exec();
    if (!stanar) {
      return res
        .sendStatus(400)
        .json({ message: "You need to fill out the required fields." });
    }
    const stanodavac = await Stanodavac.findOne({
      _id: `${stanodavac_id}`,
    }).exec();
    if (!stanodavac) {
      return res
        .sendStatus(400)
        .json({ message: "You need to fill out the required fields." });
    }
    if (stanodavac.lista_stanara.includes(stanar._id)) {
      return res
        .sendStatus(400)
        .json({ message: "That Stanar is already there" });
    }
    stanodavac.lista_stanara.push(stanar._id);
    await stanodavac.save();

    stanar.stanuje_kod = stanodavac._id;
    await stanar.save();

    res.json(stanodavac);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const obrisiStanodavca = async (req, res) => {
  try {
    const { id } = req.body;
    const stanodavac = await Stanodavac.findByIdAndDelete(id);
    if (!stanodavac) {
      return res
        .sendStatus(400)
        .json({ message: "That Stanodavac doesnt exist" });
    }
    await Stanar.updateMany(
      { stanuje_kod: id },
      { $set: { stanuje_kod: null } }
    );
    res.json({ message: "Obrisan je stanodavac" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  vratiStanodavca,
  vratiStanodavce,
  azurirajStanodavca,
  vratiListuStanara,
  dodajStanaraKodStanodavca,
  obrisiStanodavca,
};
