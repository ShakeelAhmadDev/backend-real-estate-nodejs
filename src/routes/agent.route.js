const express = require('express');
const { createAgent, getAgents, getAgentById, updateAgent, deleteAgent } = require('../controllers/agent.controller');
const router = express.Router();

router.post('/agents', createAgent);
router.get('/agents', getAgents);
router.get('/agents/:id', getAgentById);
router.put('/agents/:id', updateAgent);
router.delete('/agents/:id', deleteAgent);

module.exports = router;
