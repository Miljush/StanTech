const express = require("express");
const router = express.Router();
const oglasMajstorController = require("../controllers/oglasMajstorController");
const ROLES_LIST=require("../config/role_list");
const verifyRoles=require("../middleware/verifyRoles");
const logovan=require("../middleware/verifyJWT");

router.use(logovan);
router.delete("/izbrisiOglasMajstor",verifyRoles(["Stanodavac"]), oglasMajstorController.izbrisiOglasMajstor);
router.put("/azurirajOglasMajstor",verifyRoles(["Stanodavac"]), oglasMajstorController.azurirajOglasMajstor);
router.get("/vratiOglaseMajstor",verifyRoles(["Majstor"]), oglasMajstorController.vratiOglaseMajstori);
router.get("/vratiMajstorOglaseZaStanodavca",verifyRoles(["Stanodavac"]),oglasMajstorController.vratiMajstorOglaseZaStanodavca);
router.get("/vratiOglasMajstor",verifyRoles(["Majstor","Stanodavac"]),oglasMajstorController.vratiOglasMajstor);
router.post("/kreirajOglasMajstor",verifyRoles(["Stanodavac"]), oglasMajstorController.kreirajOglasMajstor);

module.exports = router;












