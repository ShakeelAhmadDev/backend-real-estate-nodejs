const mongoose = require('mongoose');

const mongoListingSchema = new mongoose.Schema({
  listingId: {
    type: Number,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  // Additional fields for agent information can be added here if needed for aggregation
}, { timestamps: true });

const MongoListing = mongoose.model('MongoListing', mongoListingSchema);

module.exports = MongoListing;
