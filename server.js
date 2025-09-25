require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const listingRoutes = require('./src/routes/listing.route');
const statsRoutes = require('./src/routes/stats.route');
const agentRoutes = require('./src/routes/agent.route'); // Import agent routes

// Database connection setup (MySQL and MongoDB)
require('./src/config/database');

// Middleware to parse JSON bodies
app.use(express.json());

// API Routes
app.use('/api', listingRoutes);
app.use('/api', statsRoutes);
app.use('/api', agentRoutes); // Use agent routes

// Basic route
app.get('/', (req, res) => {
  res.send('Real Estate API is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
