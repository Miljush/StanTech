const Majstor = require("../models/Majstor");
const Stanar = require("../models/Stanar");

const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const Kalendar = require("../models/Kalendar");

const vratiMajstora = async (req, res) => {
  const id = req.body.id;
  if (!id) return res.sendStatus(400);
  try {
    const majstor = await Majstor.findOne({ _id: `${id}` }).exec();
    if (!majstor) {
      return res.sendStatus(400);
    } else {
      res.json(majstor);
    }
  } catch (err) {
    console.error(err);
  }
};

const vratiMajstore = async (req, res) => {
  try {
    const majstori = await Majstor.find();
    if (!majstori) {
      return res.sendStatus(400);
    } else {
      res.json(majstori);
    }
  } catch (err) {
    console.error(err);
  }
};

const vratiUsluge = async (req, res) => {
  const id = req.body.id;
  if (!id) return res.sendStatus(400);
  try {
    const majstor = await Majstor.findOne({ _id: `${id}` }).exec();
    if (!majstor) {
      return res.sendStatus(400);
    } else {
      return res.json(majstor.usluge);
    }
  } catch (err) {
    console.error(err);
  }
};

const vratiKalendar = async (req, res) => {
  const id = req.body.id;
  if (!id) return res.sendStatus(400);
  try {
    const majstor = await Majstor.findOne({ _id: `${id}` }).exec();
    if (!majstor) {
      return res.sendStatus(400);
    } else {
      return res.json(majstor.kalendar);
    }
  } catch (err) {
    console.error(err);
  }
};

/*const vratiListu = async (req, res) => {
  const id = req.body.id;
  if (!id)
    return res
      .sendStatus(400)
      .json({ message: "You need to fill out the required fields." });
  try {
    const majstor = await Majstor.findOne({ _id: `${id}` })
      .populate("kalendar")
      .exec();
    if (!majstor)
      return res
        .sendStatus(400)
        .json({ message: "You need to fill out the required fields." });
    const kalendar = majstor.kalendar;
    res.json(kalendar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};*/
const vratiListu = async (idMajstora) => {
  const id = idMajstora;
  if (!id) {
    throw new Error("You need to fill out the required fields.");
  }
  const majstor = await Majstor.findOne({ _id: `${id}` })
    .populate("kalendar")
    .exec();
  if (!majstor) {
    throw new Error("You need to fill out the required fields.");
  }
  const kalendar = majstor.kalendar;
  return kalendar;
};
const vratiPopravke = async (req, res) => {
  const id = req.body.id;
  if (!id) return res.sendStatus(400);
  try {
    const majstor = await Majstor.findOne({ _id: `${id}` }).exec();
    if (!majstor) {
      return res.sendStatus(400);
    } else {
      return res.json(majstor.kalendar);
    }
  } catch (err) {
    console.error(err);
  }
};

const azurirajMajstora = async (req, res) => {
  const id = req.body.id;
  if (!id) return res.sendStatus(400);
  try {
    const majstor = await Majstor.findOne({ _id: `${id}` }).exec();
    if (!majstor) {
      return res.sendStatus(400);
    } else {
      if (req.body?.username) majstor.username = req.body.username;
      if (req.body?.password) majstor.password = req.body.password;
      if (req.body?.email) majstor.email = req.body.email;
      if (req.body?.brtelefona) majstor.brtelefona = req.body.brtelefona;
      if (req.body?.slika) majstor.slika = req.body.slika;
      if (req.body?.ime) majstor.ime = req.body.ime;
      if (req.body?.prezime) majstor.prezime = req.body.prezime;
      if (req.body?.usluge) majstor.usluge = req.body.usluge;
      if (req.body?.kalendar) {
        const kalendarIds = req.body.kalendar.map((k) => k.id);
        const kalendari = await Kalendar.find({
          _id: { $in: kalendarIds },
        }).exec();
        majstor.kalendar = kalendari;
      }

      const result = await majstor.save();
      res.json(result);
    }
  } catch (err) {
    console.error(err);
  }
};
const obrisiMajstora = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Potreban je ID za brisanje" });
  }
  try {
    const majstor = await Majstor.findById(id);
    if (!majstor) {
      return res
        .status(400)
        .json({ message: `There is no majstor with id ${id}` });
    }
    await Majstor.deleteOne({ _id: id });
    return res.status(200).json({ message: "Majstor deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const dodajUKalendar = async (req, res) => {
  const { majstor_id, kalendar_id } = req.body;
  try {
    const kalendar = await Kalendar.findOne({ _id: `${kalendar_id}` }).exec();
    if (!kalendar) {
      return res
        .sendStatus(400)
        .json({ message: "You need to fill out the required fields." });
    }
    const majstor = await Majstor.findOne({
      _id: `${majstor_id}`,
    }).exec();
    if (!majstor) {
      return res
        .sendStatus(400)
        .json({ message: "You need to fill out the required fields." });
    }
    if (majstor.kalendar.includes(kalendar._id)) {
      return res
        .sendStatus(400)
        .json({ message: "That Stanar is already there" });
    }
    console.log("Greska");
    majstor.kalendar.push(kalendar._id);
    await majstor.save();

    res.json(majstor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const dohvatiPotrebneInformacije = async (req, res) => {
  const idMajstora = req.body.id;
  if (!idMajstora) {
    return res
      .status(400)
      .json({ message: "You need to fill out the required fields." });
  }
  try {
    const listaZaPopravak = await vratiListu(idMajstora);
    const informacijePoStavkama = await Promise.all(
      listaZaPopravak.map(async (stavka) => {
        const idKalendar = stavka._id;
        const informacijeOKalendaru = await vratiKalendar1({
          body: { id: idKalendar },
        });
        const idStanara = informacijeOKalendaru.stanar;
        const informacijeOStanaru = await vratiStanara({
          body: { id: idStanara },
        });
        const anonimniObjekat = {
          datumIKalendar: informacijeOKalendaru.datum,
          brojTelefonaStanara: informacijeOStanaru.brtelefona,
          username:informacijeOStanaru.username,
          ime:informacijeOStanaru.ime,
          prezime:informacijeOStanaru.prezime,
          slika:informacijeOStanaru.slika
        };
        return { anonimniObjekat };
      })
    );
    res.json(informacijePoStavkama);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
const vratiKalendar1 = async (req) => {
  const id = req.body.id;
  if (!id) {
    throw new Error("You need to fill out the required fields.");
  }
  const kalendar = await Kalendar.findOne({ _id: `${id}` }).exec();
  if (!kalendar) {
    throw new Error("Invalid ID.");
  }
  return kalendar;
};
const vratiStanara = async (req) => {
  const id = req.body.id;
  if (!id) throw new Error("Invalid ID1.");
  try {
    const stanar = await Stanar.findOne({ _id: `${id}` }).exec();
    if (!stanar) {
      throw new Error("Invalid ID2.");
    } else {
      return stanar;
    }
  } catch (err) {
    console.error(err);
    throw new Error("Invalid ID3.");
  }
};

const vratiBrojTelefona = async (req, res) => {
  const {idMajstora,datum} = req.query;

  if (!idMajstora || !datum) {
    return res
      .status(400)
      .json({ message: "You need to fill out the required fields." });
  }

  try {
    const listaZaPopravak = await vratiListu(idMajstora);
    const informacijePoStavkama = await Promise.all(
      listaZaPopravak.map(async (stavka) => {
        const idKalendar = stavka._id;
        const informacijeOKalendaru = await vratiKalendar2({
          body: { id: idKalendar, datum: datum },
        });
        if (!informacijeOKalendaru.length || !informacijeOKalendaru[0].stanar) {
          return null;
        }

        const idStanara = informacijeOKalendaru[0].stanar;
        const informacijeOStanaru = await vratiStanara({
          body: { id: idStanara },
        });

        const anonimniObjekat = {
          brojTelefonaStanara: informacijeOStanaru.brtelefona,
          datum: datum,
          username:informacijeOStanaru.username,
          ime:informacijeOStanaru.ime,
          prezime:informacijeOStanaru.prezime,
          slika:informacijeOStanaru.slika
        };

        return anonimniObjekat;
      })
    );

    const filtriranoPoDatumu = informacijePoStavkama.filter(
      (value) => value && value.datum === datum
    );
    const bezDuplikata = Array.from(
      new Set(filtriranoPoDatumu.map((value) => value.brojTelefonaStanara))
    ).map((brojTelefona) => ({
      brojTelefonaStanara: brojTelefona,
    }));
    res.json(filtriranoPoDatumu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const vratiKalendar2 = async (req) => {
  const idKalendar = req.body.id;
  const datum = req.body.datum;
  if (!idKalendar || !datum) {
    throw new Error("You need to fill out the required fields.");
  }
  const kalendar = await Kalendar.find({
    _id: idKalendar,
    datum: `${datum}`,
  }).exec();
  if (!kalendar) {
    throw new Error("Invalid ID.");
  }
  return kalendar;
};
const kreirajKalendar = async (req, res) => {
  const datum = req.body.datum;
  const username = req.body.username;
  const majstorId = req.body.majstorId;
  try {
    const stanar = await Stanar.findOne({ username });
    if (!stanar) {
      throw new Error("Korisnik s tim username-om ne postoji.");
    }
    const noviKalendar = new Kalendar({
      datum: datum,
      stanar: stanar._id,
    });
    await noviKalendar.save();

    const majstor = await Majstor.findById(majstorId);

    if (!majstor) {
      throw new Error("Majstor s danim ID-em ne postoji.");
    }

    majstor.kalendar.push(noviKalendar._id);
    await majstor.save();

    res.json(majstor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.stack });
  }
};
module.exports = {
  vratiUsluge,
  vratiKalendar,
  vratiPopravke,
  azurirajMajstora,
  vratiMajstora,
  vratiMajstore,
  obrisiMajstora,
  dodajUKalendar,
  vratiListu,
  dohvatiPotrebneInformacije,
  vratiKalendar1,
  vratiBrojTelefona,
  vratiKalendar2,
  kreirajKalendar,
};
