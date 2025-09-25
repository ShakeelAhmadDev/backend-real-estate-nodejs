const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database');
const Agent = require('./agent.model'); // Import the Agent model

const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('city', value.toLowerCase());
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  agentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'agent_id', // Explicitly map to 'agent_id' in the database
    references: {
      model: Agent,
      key: 'id',
    },
  },
}, { timestamps: false });

// Define the association
Listing.belongsTo(Agent, { foreignKey: 'agent_id' }); // Use 'agent_id' as the foreign key

// Sync the model with the database (creates the table if it doesn't exist)
// Note: In a real application, you might use migrations for this.
// Listing.sync(); 

module.exports = Listing;
