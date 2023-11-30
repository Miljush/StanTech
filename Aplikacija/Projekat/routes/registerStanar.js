const express = require("express");
const router = express.Router();
const registerControllerStanar = require("../controllers/registerControllerStanar");

router.post("/", registerControllerStanar.handleNewUser);

module.exports = router;
