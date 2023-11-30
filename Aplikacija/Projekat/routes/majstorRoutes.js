const express = require("express");
const router = express.Router();
const majstorController = require("../controllers/majstorController");
const ROLES_LIST=require("../config/role_list");
const verifyRoles=require("../middleware/verifyRoles");
const logovan=require("../middleware/verifyJWT");


router.use(logovan);
router.get('/vratiUsluge',verifyRoles(["Majstor"]),majstorController.vratiUsluge);
router.get('/vratiKalendar',verifyRoles(["Majstor"]),majstorController.vratiKalendar);
router.get("/vratiPopravke",verifyRoles(["Majstor"]),majstorController.vratiPopravke);
router.get("/vratiMajstore",verifyRoles(["Majstor"]),majstorController.vratiMajstore);
router.get("/vratiMajstora",verifyRoles(["Majstor"]),majstorController.vratiMajstora);
router.delete("/obrisiMajstora",verifyRoles(["Majstor"]),majstorController.obrisiMajstora);
router.put("/dodajUKalendar",verifyRoles(["Majstor"]),majstorController.dodajUKalendar);
router.get("/vratiListu",verifyRoles(["Majstor"]),majstorController.vratiKalendar);
router.get("/vratiBrojTelefona",verifyRoles(["Majstor"]),majstorController.vratiBrojTelefona);
router.post("/kreirajKalendar",verifyRoles(["Majstor"]),majstorController.kreirajKalendar);
router.put("/azurirajMajstora",verifyRoles(["Majstor"]),majstorController.azurirajMajstora);

module.exports = router;
