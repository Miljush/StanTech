const express = require("express");
const router = express.Router();
const registerControllerStanodavac = require("../controllers/registerControllerStanodavac");

router.post("/", registerControllerStanodavac.handleNewUser);

module.exports = router;
