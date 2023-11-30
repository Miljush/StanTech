const express = require("express");
const router = express.Router();
const stanodavacController = require("../controllers/stanodavacController");
const verifyRoles=require("../middleware/verifyRoles");
const logovan=require("../middleware/verifyJWT");


router.use(logovan);
router.get("/vratiStanodavca",verifyRoles(["Stanar"]),stanodavacController.vratiStanodavca);
router.get("/vratiStanodavce",verifyRoles(["Stanodavac"]), stanodavacController.vratiStanodavce);
router.put("/azurirajStanodavca",verifyRoles(["Stanodavac"]), stanodavacController.azurirajStanodavca);
router.get("/vratiListuStanara",verifyRoles(["Stanodavac"]), stanodavacController.vratiListuStanara);
router.put(
  "/dodajStanaraKodStanodavca",verifyRoles(["Stanodavac"]),
  stanodavacController.dodajStanaraKodStanodavca
);
router.delete("/obrisiStanodavca",verifyRoles(["Stanodavac"]),stanodavacController.obrisiStanodavca);

module.exports = router;
