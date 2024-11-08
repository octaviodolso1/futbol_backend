const express = require('express');
const router = express.Router({ mergeParams: true });
const teamController = require('../controllers/teamController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeAdminOrOrganizer = require('../middlewares/authorizeAdminOrOrganizer');

router.get('/', teamController.getTeamsByTournament);

router.post('/', authMiddleware, authorizeAdminOrOrganizer, teamController.addTeamToTournament);

router.put('/:id', authMiddleware, authorizeAdminOrOrganizer, teamController.updateTeam);

router.delete('/:id', authMiddleware, authorizeAdminOrOrganizer, teamController.deleteTeam);

module.exports = router;
