const Stanodavac = require("../models/Stanodavac");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, password, email, brtelefona, slika, ime, prezime } = req.body;
  if (!user || !password || !email || !ime || !prezime)
    return res
      .status(400)
      .json({ message: "You need to fill out the required fields." });
  // check for duplicate usernames in the db
  const duplicate = await Stanodavac.findOne({ username: user }).exec();

  if (duplicate) return res.sendStatus(409); //Conflict
  slikaBezUploads = slika.replace("uploads\\","");
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    //create and store the new user
    const result = await Stanodavac.create({
      username: user,
      password: hashedPwd,
      email: email,
      brtelefona: brtelefona,
      slika: slikaBezUploads,
      ime: ime,
      prezime: prezime,
    });

    console.log(result);

    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
