const Stanar = require("../models/Stanar");
const Stanodavac = require("../models/Stanodavac");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const vratiStanara = async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400);
  try {
    const stanar = await Stanar.findById(id);
    if (!stanar) {
      return res.status(400);
    } else {
      res.status(200).json(stanar);
    }
  } catch (err) {
    res.status(500);
  }
};
const vratiStanare = async (req, res) => {
  try {
    const stanari = await Stanar.find();
    if (!stanari) {
      return res
        .sendStatus(400)
        .json({ message: "You need to fill out the required fields." });
    } else {
      res.json(stanari);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const azurirajStanara = async (req, res) => {
  const id = req.body.id;
  if (!id) {
    return res
      .sendStatus(400)
      .json({ message: "You need to fill out the required fields." });
  }
  try {
    const stanar = await Stanar.findOne({ _id: `${id}` }).exec();
    if (!stanar) {
      return res
        .sendStatus(400)
        .json({ message: "You need to fill out the required fields." });
    } else {
      if (req.body?.username) stanar.username = req.body.username;
      if (req.body?.password) stanar.password = req.body.password;
      if (req.body?.email) stanar.email = req.body.email;
      if (req.body?.brtelefona) stanar.brtelefona = req.body.brtelefona;
      if (req.body?.slika) stanar.slika = req.body.slika;
      if (req.body?.ime) stanar.ime = req.body.ime;
      if (req.body?.prezime) stanar.prezime = req.body.prezime;
      if (req.body?.stanuje_kod) stanar.stanuje_kod.push(req.body.stanuje_kod);
      const result = await stanar.save();
      res.json(result);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const obrisiStanara = async (req, res) => {
  const { idStanara } = req.body;
  if (!idStanara) {
    return res
      .status(400)
      .json({ message: "You need to fill out the required fields." });
  }
  try {
    const stanar = await Stanar.findById(idStanara);
    console.log(stanar);
    if (!stanar) {
      return res
        .status(400)
        .json({ message: `There is not Stanar with id ${idStanara}` });
    }
    const stanodavac = await Stanodavac.findById(stanar.stanuje_kod);
    if (!stanodavac) {
      return res.status(400).json({
        message: `There is not Stanodavac with id ${stanar.stanuje_kod}`,
      });
    }
    const index = stanodavac.lista_stanara.indexOf(idStanara);
    stanodavac.lista_stanara.splice(index, 1);
    await stanodavac.save();
    await Stanar.deleteOne({ _id: idStanara });
    return res.status(200).json({ message: "Stanar deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const vratiStanodavcaZaStanara = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400);
  }
  try {
    const stanar = await Stanar.findById(id);
    if (!stanar) {
      res.status(400);
    }
    const stanodavac = await Stanodavac.findById(stanar.stanuje_kod);
    if (!stanodavac) {
      res.json("");
    } else {
      res.json(stanodavac);
    }
  } catch (err) {
    console.error(err);
  }
};

const vratiStanaraUsername = async(req,res)=>{
  const {username} = req.body;
  if(!username){
    return res.status(400);
  }
  try{
    const stanar = await Stanar.findOne({username:username}).exec();
    if(!stanar){
      return res.status(400);
    }
    else{
      res.json(stanar);
    }
  }catch(err){
    console.error(err)
  }
}
module.exports = {
  vratiStanara,
  vratiStanare,
  azurirajStanara,
  obrisiStanara,
  vratiStanodavcaZaStanara,
  vratiStanaraUsername
};
