const MongoListing = require('../db/mongo.listing.model');
const Listing = require('../db/mysql.listing.model'); // To get agent names from MySQL

// Helper function for consistent error response
const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: true, message });
};

exports.getActiveAgentsStats = async (req, res) => {
  try {
    // Aggregation pipeline for MongoDB listings
    const agentStats = await MongoListing.aggregate([
      {
        $lookup: {
          from: 'listings', // The collection name in MongoDB for MySQL listings (assuming a potential sync or direct agentId reference)
          localField: 'listingId',
          foreignField: 'id',
          as: 'mysqlListing',
        },
      },
      {
        $unwind: {
          path: '$mysqlListing',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          'mysqlListing.price': { $gt: 300000 },
        },
      },
      {
        $group: {
          _id: '$mysqlListing.agentId',
          totalViews: { $sum: '$views' },
          totalListings: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'agents', // Assuming an agents collection in MongoDB for agent names
          localField: '_id',
          foreignField: 'id',
          as: 'agentInfo',
        },
      },
      {
        $unwind: {
          path: '$agentInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          agent: { $ifNull: ['$agentInfo.name', 'Unknown Agent'] },
          listings: '$totalListings',
          totalViews: '$totalViews',
        },
      },
      {
        $sort: { totalViews: -1 },
      },
    ]);

    // Handle agents with 0 listings/views (if not covered by the aggregation)
    // This part would require fetching all agents from MySQL and merging with MongoDB results.
    // For brevity, assuming agents with listings > 300k and views will appear.
    // A more robust solution would involve a join across databases or pre-populating MongoDB with agent data.

    res.status(200).json({ error: false, data: agentStats });
  } catch (error) {
    console.error('Error fetching active agents stats:', error);
    errorResponse(res, 500, 'Something went wrong while fetching active agents stats.');
  }
};
