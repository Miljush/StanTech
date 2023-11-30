const OglasStan = require("../models/OglasStan");
const Stanodavac = require("../models/Stanodavac");

const kreirajOglasStan = async (req, res) => {
  const {
    ime,
    opis,
    putanja_slike,
    usernameStanodavca,
    adresa,
    brojSoba,
    tipGrejanja,
    dodaci,
    cena,
    povrsina,
  } = req.body;
  if (
    !ime ||
    !opis ||
    !putanja_slike ||
    !usernameStanodavca ||
    !adresa ||
    !brojSoba ||
    !tipGrejanja ||
    !dodaci ||
    !cena ||
    !povrsina
  )
    return res
      .status(400)
      .json({ message: "You need to fill out the required fields." });

  for (let i = 0; i < putanja_slike.length; i++) {
    putanja_slike[i] = putanja_slike[i].replace("uploads\\", "");
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
    const oglas = await OglasStan.create({
      ime: ime,
      opis: opis,
      putanja_slike: putanja_slike,
      stanodavac: stanodavac,
      adresa: adresa,
      brojSoba: brojSoba,
      tipGrejanja: tipGrejanja,
      dodaci: dodaci,
      povrsina: povrsina,
      cena: cena,
    });
    stanodavac.lista_oglasa.push(oglas._id);
    const stanodavacSave = await stanodavac.save();

    res.status(201).json({ success: `Novi oglas ${oglas} kreiran!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const vratiNaslovneOglase = async (req, res) => {
  try {
    const oglas1 = await OglasStan.findOne({
      _id: "646ffb1df48dab8bba7ce3b0",
    }).exec();
    const oglas2 = await OglasStan.findOne({
      _id: "646ff9c5f48dab8bba7cc877",
    }).exec();
    const oglas3 = await OglasStan.findOne({
      _id: "646ff8b9f48dab8bba7cb50a",
    }).exec();
    let Oglasi = new Array();
    Oglasi.push(oglas1);
    Oglasi.push(oglas2);
    Oglasi.push(oglas3);
    return res.status(200).json(Oglasi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const vratiOglaseZaStanodavca = async (req, res) => {
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
    let Oglasi = new Array();
    for (let i = 0; i < stanodavac.lista_oglasa.length; i++) {
      const noviOglas = await OglasStan.findById(
        stanodavac.lista_oglasa[i]
      ).exec();
      Oglasi.push(noviOglas);
    }
    //  stanodavac.lista_oglasa.forEach(async oglasid=>{
    //      const noviOglas=await OglasStan.findById(oglasid).exec();
    //      Oglasi.push(noviOglas);
    //  })
    return res.status(200).json(Oglasi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const vratiStanodavcaZaOglas = async (req, res) => {
  try {
    const { id } = req.query;
    const stanodavac = await Stanodavac.findById(id);
    if (!stanodavac) {
      return res.sendStatus(400);
    } else {
      res.json(stanodavac);
    }
  } catch (err) {
    console.error(err);
  }
};
const vratiOglase = async (req, res) => {
  try {
    const oglasi = await OglasStan.find();
    if (!oglasi) {
      return res.sendStatus(400);
    } else {
      res.json(oglasi);
    }
  } catch (err) {
    console.error(err);
  }
};
const vratiOglas = async (req, res) => {
  try {
    const { id } = req.query;
    const oglas = await OglasStan.findById(id);
    if (!oglas) {
      return res.sendStatus(400);
    } else {
      res.json(oglas);
    }
  } catch (err) {
    console.error(err);
  }
};
const vratiDostupneOglase = async (req, res) => {
  try {
    const oglasi = await OglasStan.find().where("dostupnost").equals("true");
    if (!oglasi) {
      return res.sendStatus(400);
    } else {
      res.json(oglasi);
    }
  } catch (err) {
    console.error(err);
  }
};
const sakrijotrkijOglas = async (req, res) => {
  const id = req.body.id;
  if (!id) return res.sendStatus(400);
  try {
    const oglasStan = await OglasStan.findOne({ _id: `${id}` }).exec();
    oglasStan.dostupnost = !oglasStan.dostupnost;
    await oglasStan.save();
    res.status(200).json({ success: `Uspesno azuriran ` });
  } catch (err) {
    console.error(err);
  }
};

const azurirajOglasStan = async (req, res) => {
  const id = req.body.id;
  if (!id) return res.sendStatus(400);
  try {
    const oglasStan = await OglasStan.findOne({ _id: `${id}` }).exec();
    if (!oglasStan) {
      return res.sendStatus(400);
    } else {
      for (let i = 0; i < req.body.putanja_slike.length; i++) {
        req.body.putanja_slike[i] = req.body.putanja_slike[i].replace(
          "uploads\\",
          ""
        );
      }
      if (req.body?.ime) oglasStan.ime = req.body.ime;
      if (req.body?.opis) oglasStan.opis = req.body.opis;
      if (req.body?.adresa) oglasStan.adresa = req.body.adresa;
      if (req.body?.putanja_slike)
        oglasStan.putanja_slike = req.body.putanja_slike;
      if (req.body?.brojSoba) oglasStan.brojSoba = req.body.brojSoba;
      if (req.body?.tipGrejanja) oglasStan.tipGrejanja = req.body.tipGrejanja;
      if (req.body?.dodaci) oglasStan.dodaci = req.body.dodaci;
      if (req.body?.povrsina) oglasStan.povrsina = req.body.povrsina;
      if (req.body?.cena) oglasStan.cena = req.body.cena;

      const result = await oglasStan.save();
      res.status(200).json({ success: `Uspesno azuriran ${result}` });
    }
  } catch (err) {
    console.error(err);
  }
};

const izbrisiOglas = async (req, res) => {
  const { idOglasa } = req.query;
  if (!idOglasa) {
    return res
      .status(400)
      .json({ message: "You need to fill out the required fields." });
  }
  try {
    const oglas = await OglasStan.findById(idOglasa);
    const stanodavac = await Stanodavac.findOne({
      _id: `${oglas.stanodavac}`,
    }).exec();
    if (!stanodavac) {
      return res.status(400).json({
        message: `Nijedan stanodavac ne sadrzi oglas sa id-jem: ${idOglasa}`,
      });
    }
    const index = stanodavac.lista_oglasa.indexOf(idOglasa);
    stanodavac.lista_oglasa.splice(index, 1);
    await stanodavac.save();
    await OglasStan.deleteOne({ _id: idOglasa });
    return res.status(200).json({oglas});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  kreirajOglasStan,
  vratiOglaseZaStanodavca,
  izbrisiOglas,
  vratiOglase,
  azurirajOglasStan,
  vratiDostupneOglase,
  vratiOglas,
  vratiStanodavcaZaOglas,
  vratiNaslovneOglase,
  sakrijotrkijOglas,
};
