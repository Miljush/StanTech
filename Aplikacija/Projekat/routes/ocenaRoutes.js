const express = require("express");
const router = express.Router();
const ocenaController = require("../controllers/ocenaController");
const publicProfileController=require("../controllers/publicProfileController");
const ROLES_LIST=require("../config/role_list");
const verifyRoles=require("../middleware/verifyRoles");
const logovan=require("../middleware/verifyJWT");

router.use("/vratiOceneZaUsera", publicProfileController.vratiOceneZaUsera);
router.use(logovan);
router.post("/dodajOcenu",verifyRoles(["Stanodavac","Stanar","Majstor"]),ocenaController.dodajOcenu);
router.put("/izmeniOcenu",verifyRoles(["Stanodavac","Stanar","Majstor"]),ocenaController.izmeniOcenu);
router.use("/vratiOcene",verifyRoles(["Stanodavac","Stanar","Majstor"]), ocenaController.vratiOcene);
router.use("/vratiOcenu",verifyRoles(["Stanodavac","Stanar","Majstor"]), ocenaController.vratiOcenu);
router.use("/obrisiOcenu",verifyRoles(["Stanodavac","Stanar","Majstor"]), ocenaController.obrisiOcenu);


module.exports = router;