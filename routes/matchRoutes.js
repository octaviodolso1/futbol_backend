const express = require('express');
const router = express.Router({ mergeParams: true });
const matchController = require('../controllers/matchController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeAdminOrOrganizer = require('../middlewares/authorizeAdminOrOrganizer');

router.post('/', authMiddleware, authorizeAdminOrOrganizer, matchController.createMatch);
router.get('/date', matchController.getMatchesByDate);
router.get('/', matchController.getMatchesByTournament);
router.get('/:id', matchController.getMatchById);
router.put('/:id', authMiddleware, authorizeAdminOrOrganizer, matchController.updateMatch);
router.delete('/:id', authMiddleware, authorizeAdminOrOrganizer, matchController.deleteMatch);
const resultRoutes = require('./resultRoutes');
router.use('/:matchId/result', resultRoutes);

module.exports = router;
