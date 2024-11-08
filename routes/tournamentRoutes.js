const express = require("express");
const router = express.Router();
const tournamentController = require("../controllers/tournamentController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeAdminOrOrganizer = require("../middlewares/authorizeAdminOrOrganizer");

router.get("/", tournamentController.getAllTournaments);

router.post(
  "/",
  authMiddleware,
  authorizeAdminOrOrganizer,
  tournamentController.createTournament
);

router.get("/:tournamentId", tournamentController.getTournamentById);

router.put(
  "/:tournamentId",
  authMiddleware,
  authorizeAdminOrOrganizer,
  tournamentController.updateTournament
);

router.delete(
  "/:tournamentId",
  authMiddleware,
  authorizeAdminOrOrganizer,
  tournamentController.deleteTournament
);

module.exports = router;
