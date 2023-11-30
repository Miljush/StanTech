const express = require("express");
const router = express.Router();
const stanarController = require("../controllers/stanarController");
const ROLES_LIST=require("../config/role_list");
const verifyRoles=require("../middleware/verifyRoles");
const logovan=require("../middleware/verifyJWT");


router.use(logovan);
router.get("/vratiStanara",verifyRoles(["Majstor","Stanar","Stanodavac"]),stanarController.vratiStanara);
router.get("/vratiStanare",verifyRoles(["Stanar"]),stanarController.vratiStanare);
router.put("/azurirajStanara",verifyRoles(["Stanar"]),stanarController.azurirajStanara);
router.delete("/obrisiStanara",verifyRoles(["Stanar"]),stanarController.obrisiStanara);
router.get("/vratiStanodavcaZaStanara",verifyRoles(["Stanar"]),stanarController.vratiStanodavcaZaStanara);
router.get("/vratiStanaraUsername",verifyRoles(["Stanar"]), stanarController.vratiStanaraUsername);

module.exports = router;
