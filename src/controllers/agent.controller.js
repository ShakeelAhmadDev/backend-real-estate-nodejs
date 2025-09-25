const Agent = require('../db/agent.model');

// Helper function for consistent error response
const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: true, message });
};

// Create a new agent
exports.createAgent = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return errorResponse(res, 400, 'Name and email are required.');
    }
    const newAgent = await Agent.create({ name, email });
    res.status(201).json({ error: false, data: newAgent });
  } catch (error) {
    console.error('Error creating agent:', error);
    errorResponse(res, 500, 'Something went wrong while creating the agent.');
  }
};

// Get all agents
exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.findAll();
    res.status(200).json({ error: false, data: agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    errorResponse(res, 500, 'Something went wrong while fetching agents.');
  }
};

// Get a single agent by ID
exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.params.id);
    if (!agent) {
      return errorResponse(res, 404, 'Agent not found.');
    }
    res.status(200).json({ error: false, data: agent });
  } catch (error) {
    console.error('Error fetching agent by ID:', error);
    errorResponse(res, 500, 'Something went wrong while fetching the agent.');
  }
};

// Update an agent by ID
exports.updateAgent = async (req, res) => {
  try {
    const [updatedRows] = await Agent.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedRows === 0) {
      return errorResponse(res, 404, 'Agent not found.');
    }

    const updatedAgent = await Agent.findByPk(req.params.id);
    res.status(200).json({ error: false, data: updatedAgent });
  } catch (error) {
    console.error('Error updating agent:', error);
    errorResponse(res, 500, 'Something went wrong while updating the agent.');
  }
};

// Delete an agent by ID
exports.deleteAgent = async (req, res) => {
  try {
    const deletedRows = await Agent.destroy({
      where: { id: req.params.id },
    });

    if (deletedRows === 0) {
      return errorResponse(res, 404, 'Agent not found.');
    }

    res.status(200).json({ error: false, message: 'Agent deleted successfully.' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    errorResponse(res, 500, 'Something went wrong while deleting the agent.');
  }
};
