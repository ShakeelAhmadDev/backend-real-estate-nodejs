const express = require('express');
const { getActiveAgentsStats } = require('../controllers/stats.controller');
const router = express.Router();

router.get('/stats/active-agents', getActiveAgentsStats);

module.exports = router;
