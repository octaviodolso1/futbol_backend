const express = require("express");
const router = express.Router({ mergeParams: true });
const resultController = require("../controllers/resultController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeAdminOrOrganizer = require("../middlewares/authorizeAdminOrOrganizer");

router.post(
  "/",
  authMiddleware,
  authorizeAdminOrOrganizer,
  resultController.addOrUpdateResult
);

router.get("/", resultController.getResult);

router.delete(
  "/",
  authMiddleware,
  authorizeAdminOrOrganizer,
  resultController.deleteResult
);

module.exports = router;
