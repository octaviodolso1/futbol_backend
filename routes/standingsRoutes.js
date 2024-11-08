const express = require("express");
const router = express.Router();
const standingsController = require("../controllers/standingsController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeAdminOrOrganizer = require("../middlewares/authorizeAdminOrOrganizer");

router.get(
  "/tournaments/:tournamentId/standings",
  authMiddleware,
  authorizeAdminOrOrganizer,
  standingsController.getStandings
);

module.exports = router;
