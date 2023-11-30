const express = require("express");
const router = express.Router();
const oglasStanController = require("../controllers/oglasStanController");
const ROLES_LIST=require("../config/role_list");
const verifyRoles=require("../middleware/verifyRoles");
const logovan=require("../middleware/verifyJWT");
router.get("/vratiNaslovneOglase", oglasStanController.vratiNaslovneOglase);
router.get("/vratiStanodavcaZaOGlas", oglasStanController.vratiStanodavcaZaOglas);
router.get("/vratiOglas", oglasStanController.vratiOglas);
router.get("/vratiDostupneOglase", oglasStanController.vratiDostupneOglase);
router.use(logovan);
router.post("/kreirajOglasStan",verifyRoles(["Stanodavac"]),oglasStanController.kreirajOglasStan);
router.get("/vratiOglaseZaStanodavca",verifyRoles(["Stanodavac"]),oglasStanController.vratiOglaseZaStanodavca);
router.get("/vratiOglaseStan",verifyRoles(["Stanar"]),oglasStanController.vratiOglase);
router.put("/azurirajOglasStan",verifyRoles(["Stanodavac"]), oglasStanController.azurirajOglasStan);
router.delete("/izbrisiOglas",verifyRoles(["Stanodavac"]), oglasStanController.izbrisiOglas);
router.put("/sakrijotrkijOglas",verifyRoles(["Stanodavac"]),oglasStanController.sakrijotrkijOglas);

module.exports = router;
