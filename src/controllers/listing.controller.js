const Listing = require('../db/mysql.listing.model');
const Agent = require('../db/agent.model'); // Import Agent model

// Helper function for consistent error response
const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: true, message });
};

// Helper function to format price
const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

// Helper function to capitalize city
const capitalizeCity = (city) => {
  if (!city) return '';
  return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
};

// Format a single listing for consistent API response
const formatListingResponse = (listing) => {
  return {
    id: listing.id,
    title: listing.title,
    city: capitalizeCity(listing.city),
    price: formatPrice(listing.price),
    bedrooms: listing.bedrooms,
    agentId: listing.agentId,
    agentName: listing.Agent ? listing.Agent.name : null, // Include agent name
    createdAt: listing.createdAt, // Will be null if timestamps are false
    updatedAt: listing.updatedAt, // Will be null if timestamps are false
  };
};

// Create a new listing (MySQL)
exports.createListing = async (req, res) => {
  try {
    const { title, city, price, bedrooms, agentId } = req.body;
    if (!title || !city || !price || !bedrooms || !agentId) {
      return errorResponse(res, 400, 'All fields (title, city, price, bedrooms, agentId) are required.');
    }

    // Sequelize will handle the mapping from agentId (model) to agent_id (db column)
    const newListing = await Listing.create({ title, city, price, bedrooms, agentId });
    res.status(201).json({ error: false, data: formatListingResponse(newListing) });
  } catch (error) {
    console.error('Error creating listing:', error);
    errorResponse(res, 500, 'Something went wrong while creating the listing.');
  }
};

// Get all listings (MySQL)
exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({ include: Agent }); // Include Agent data
    const formattedListings = listings.map(listing => formatListingResponse(listing));
    res.status(200).json({ error: false, data: formattedListings });
  } catch (error) {
    console.error('Error fetching listings:', error);
    errorResponse(res, 500, 'Something went wrong while fetching listings.');
  }
};

// Get a single listing by ID (MySQL)
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, { include: Agent }); // Include Agent data
    if (!listing) {
      return errorResponse(res, 404, 'Listing not found.');
    }
    res.status(200).json({ error: false, data: formatListingResponse(listing) });
  } catch (error) {
    console.error('Error fetching listing by ID:', error);
    errorResponse(res, 500, 'Something went wrong while fetching the listing.');
  }
};

// Update a listing by ID (MySQL)
exports.updateListing = async (req, res) => {
  try {
    // Sequelize will handle the mapping from agentId (model) to agent_id (db column) in req.body
    const [updatedRows] = await Listing.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedRows === 0) {
      return errorResponse(res, 404, 'Listing not found.');
    }

    const updatedListing = await Listing.findByPk(req.params.id, { include: Agent });
    res.status(200).json({ error: false, data: formatListingResponse(updatedListing) });
  } catch (error) {
    console.error('Error updating listing:', error);
    errorResponse(res, 500, 'Something went wrong while updating the listing.');
  }
};

// Delete a listing by ID (MySQL)
exports.deleteListing = async (req, res) => {
  try {
    const deletedRows = await Listing.destroy({
      where: { id: req.params.id },
    });

    if (deletedRows === 0) {
      return errorResponse(res, 404, 'Listing not found.');
    }

    res.status(200).json({ error: false, message: 'Listing deleted successfully.' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    errorResponse(res, 500, 'Something went wrong while deleting the listing.');
  }
};
