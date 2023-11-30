const User = require("../models/User");
const Ocena = require("../models/Ocena");

const vratiUsera = async (req, res) => {
  const username = req.params.username;
  try {
    const userInfo = await User.findOne({ username: `${username}` }).exec();
    if (!userInfo) {
      return res.sendStatus(400);
    } else {
      return res.json(userInfo);
    }
  } catch (err) {
    console.error(err);
  }
};

const vratiOceneZaUsera = async (req, res) => {
  const username = req.body.username;
  let ocenaInfoArray = [];
  let ocenaInfo;
  try {
    const userInfo = await User.findOne({ username: `${username}` }).exec();
    if (!userInfo) {
      return res.sendStatus(400);
    } else {
      for (let i=0;i<userInfo.ocene.length;i++) {
        ocenaInfo = await Ocena.findOne({ _id: `${userInfo.ocene[i]._id}` }).exec();
        postedByInfo = await User.findOne({_id:`${ocenaInfo.postedby}`}).exec();
        if (ocenaInfo) {
          ocenaInfoArray.push({
            _id: ocenaInfo._id,
            description: ocenaInfo.description,
            stars: ocenaInfo.stars,
            postedby: postedByInfo.username,
            postedfor: ocenaInfo.postedfor,
          });
        }
      }
      return res.json(ocenaInfoArray);
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = { vratiUsera, vratiOceneZaUsera };
