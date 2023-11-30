const express = require("express");
const router = express.Router();
const registerControllerMajstor = require("../controllers/registerControllerMajstor");

router.post("/", registerControllerMajstor.handleNewUser);

module.exports = router;
