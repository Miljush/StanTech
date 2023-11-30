const OglasMajstor = require("../models/OglasMajstor");
const Stanodavac = require("../models/Stanodavac");
const Stanar = require("../models/Stanar");

const kreirajOglasMajstor = async (req, res) => {
  const {
    ime,
    opis,
    putanja_slike,
    usernameStanodavca,
    adresa,
    usernameStanara,
  } = req.body;
  if (
    !ime ||
    !opis ||
    !putanja_slike ||
    !usernameStanodavca ||
    !adresa ||
    !usernameStanara
  )
    return res
      .status(400)
      .json({ message: "You need to fill out the required fields." });

  try {
    const stanodavac = await Stanodavac.findOne({
      username: usernameStanodavca,
    }).exec();
    if (!stanodavac) {
      return res.status(400).json({
        message: `Ne postoji stanodavac sa username-om: ${usernameStanodavca}`,
      });
    }
    const stanar = await Stanar.findOne({
      username: usernameStanara,
    }).exec();
    if (!stanar) {
      return res.status(400).json({
        message: `Ne postoji stanar sa username-om: ${usernameStanara}`,
      });
    }
    const oglas = await OglasMajstor.create({
      ime: ime,
      opis: opis,
      putanja_slike: putanja_slike,
      stanodavac: stanodavac,
      stanar: stanar,
      adresa: adresa,
    });

    res.status(201).json({ success: `Novi oglas ${oglas} kreiran!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const vratiMajstorOglaseZaStanodavca = async (req, res) => {
  const { usernameStanodavca } = req.query;
  if (!usernameStanodavca) {
    return res
      .status(400)
      .json({ message: "You need to fill out the required fields." });
  }
  try {
    const stanodavac = await Stanodavac.findOne({
      username: usernameStanodavca,
    }).exec();
    if (!stanodavac) {
      return res.status(400).json({
        message: `Ne postoji stanodavac sa username-om: ${usernameStanodavca}`,
      });
    }
   
    const Oglasi=await OglasMajstor.find().where("stanodavac").equals(stanodavac._id);
    return res.status(200).json(Oglasi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const vratiOglasMajstor = async (req, res) => {
  try {
    const { id } = req.query;
    const oglas = await OglasMajstor.findById(id);
    if (!oglas) {
      return res.sendStatus(400);
    } else {
      res.json(oglas);
    }
  } catch (err) {
    console.error(err);
  }
};

const vratiOglaseMajstori = async (req, res) => {
  try {
    const oglasi = await OglasMajstor.find();
    if (!oglasi) {
      return res.sendStatus(400);
    } else {
      res.json(oglasi);
    }
  } catch (err) {
    console.error(err);
  }
};

const azurirajOglasMajstor = async (req, res) => {
  const id = req.body.id;
  if (!id) return res.sendStatus(400);
  try {
    const oglasMajstor = await OglasMajstor.findOne({ _id: `${id}` }).exec();
    if (!oglasMajstor) {
      return res.sendStatus(400);
    } else {
      if (req.body?.ime) oglasMajstor.ime = req.body.ime;
      if (req.body?.opis) oglasMajstor.opis = req.body.opis;
      if (req.body?.adresa) oglasMajstor.adresa = req.body.adresa;
      if (req.body?.putanja_slike)
        oglasMajstor.putanja_slike=req.body.putanja_slike;

      const result = await oglasMajstor.save();
      res.status(200).json({ success: `Uspesno azuriran ${result}` });
    }
  } catch (err) {
    console.error(err);
  }
};

const izbrisiOglasMajstor = async (req, res) => {
  const { idOglasa } = req.query;
  if (!idOglasa) {
    return res
      .status(400)
      .json({ message: "You need to fill out the required fields." });
  }
  try {
    const oglas=await OglasMajstor.findById({ _id: idOglasa });
    await OglasMajstor.deleteOne({ _id: idOglasa });
    return res.status(200).json({oglas});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  kreirajOglasMajstor,
  izbrisiOglasMajstor,
  azurirajOglasMajstor,
  vratiOglaseMajstori,
  vratiMajstorOglaseZaStanodavca,
  vratiOglasMajstor
};
