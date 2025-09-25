# Backend Developer Test Task - Real Estate API

This project implements a Real Estate Listings API using Node.js, MySQL, and MongoDB, fulfilling the requirements of the Backend Developer Test Task.

## Table of Contents
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
  - [Listings (MySQL CRUD)](#listings-mysql-crud)
  - [Active Agents Statistics (MongoDB Aggregation)](#active-agents-statistics-mongodb-aggregation)
- [Project Structure](#project-structure)
- [Choices and Decisions Made](#choices-and-decisions-made)
- [Future Improvements](#future-improvements)
- [Laravel Mini-Task (Not Implemented in Node.js)](#laravel-mini-task-not-implemented-in-node.js)

## Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ShakeelAhmadDev/backend-real-estate-nodejs
    cd real-estate-api
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    In the root directory of the project, create a file named `.env` and add your database connection strings and other environment variables. Replace the placeholders with your actual credentials:
    ```
    MONGODB_URI=mongodb://localhost:27017/realestate
    MYSQL_DATABASE=your_mysql_database_name
    MYSQL_USER=your_mysql_username
    MYSQL_PASSWORD=your_mysql_password
    MYSQL_HOST=localhost
    PORT=3000
    ```
    (You can copy the content from `sample.env` and fill in your details.)

4.  **Database Schema and Seed Data:**
    *   **MySQL:** You will need to import the provided SQL dump file (`mashvisor_dump_db.sql`) into your MySQL database to create the `listings` and `agents` tables and populate them with seed data.
        ```bash
        mysql -u your_mysql_username -p your_mysql_database_name < mashvisor_dump_db.sql
        ```
    *   **MongoDB:** You will need to import the provided JSON files (`views.json`, `listings.json`, `agents.json`) into your MongoDB instance. These files will be used for aggregation.
        ```bash
        mongoimport --db realestate --collection views --file views.json --jsonArray
        mongoimport --db realestate --collection listings --file listings.json --jsonArray # Note: This is for MongoDB specific listings, not the MySQL ones.
        mongoimport --db realestate --collection agents --file agents.json --jsonArray
        ```
        *Self-correction*: The task mentions importing `listings.json` and `agents.json` for NoSQL. I will assume these refer to separate MongoDB collections, not directly syncing with MySQL. For the purpose of the aggregation task, `agents` collection in MongoDB will be assumed to contain agent names linked by ID.

5.  **Start the server:**
    ```bash
    npm start
    ```
    The Node.js server will start and listen on the configured port.

## API Endpoints

All API endpoints are prefixed with `/api`.

### Listings (MySQL CRUD)

These endpoints interact with the MySQL database.

*   **Create a new listing:**
    `POST /api/listings`
    Request Body (JSON):
    ```json
    {
      "title": "Beautiful Family Home",
      "city": "new york",
      "price": 350000.00,
      "bedrooms": 4,
      "agentId": 1
    }
    ```
    *   `city` field will be stored lowercase in DB, but returned capitalized.
    *   `price` will be returned formatted to 2 decimal places.

*   **Get all listings:**
    `GET /api/listings`

*   **Get a single listing by ID:**
    `GET /api/listings/:id`

*   **Update a listing by ID:**
    `PUT /api/listings/:id`
    Request Body (JSON - partial updates allowed):
    ```json
    {
      "price": 360000.50,
      "city": "los angeles"
    }
    ```

*   **Delete a listing by ID:**
    `DELETE /api/listings/:id`

### Active Agents Statistics (MongoDB Aggregation)

This endpoint uses MongoDB for aggregation.

*   **Get active agents report:**
    `GET /api/stats/active-agents`
    Returns a report of active agents with their total listings (priced > 300,000) and total views across their listings. Includes agents with 0 listings/views and sorts by `totalViews` descending.
    Expected Response Example:
    ```json
    [
      { "agent": "Carol Lee", "listings": 1, "totalViews": 200 },
      { "agent": "Alice Smith", "listings": 0, "totalViews": 0 }
    ]
    ```

## Project Structure

*   `server.js`: Main application entry point, sets up Express and connects to both MySQL and MongoDB.
*   `src/config/database.js`: Handles database connections for MySQL (Sequelize) and MongoDB (Mongoose).
*   `src/controllers/`: Contains controller logic for API endpoints.
    *   `listing.controller.js`: Handles CRUD operations for MySQL listings.
    *   `stats.controller.js`: Handles MongoDB aggregation for active agent statistics.
*   `src/db/`: Contains database models.
    *   `mysql.listing.model.js`: Sequelize model for MySQL listings.
    *   `mongo.listing.model.js`: Mongoose model for MongoDB listings (used for views/aggregation).
*   `src/routes/`: Defines API routes and links them to controllers.
    *   `listing.route.js`: Routes for MySQL listing CRUD operations.
    *   `stats.route.js`: Route for MongoDB active agents statistics.
*   `src/utils/`: Utility functions (currently empty, but reserved for future use).

## Choices and Decisions Made

*   **Dual Database Approach:** The task explicitly requires both MySQL for relational storage (listings) and MongoDB for aggregation/statistics. This led to maintaining separate models (`mysql.listing.model.js` and `mongo.listing.model.js`) and connecting to both databases in `src/config/database.js`.
*   **Sequelize for MySQL:** Chosen for its ORM capabilities with MySQL, making CRUD operations more structured and easier to manage.
*   **Mongoose for MongoDB:** Selected for its ODM features with MongoDB, simplifying schema definition and data interaction for aggregation.
*   **Consistent Error Handling:** Implemented a helper function `errorResponse` in controllers to ensure all API errors adhere to the `{ "error": true, "message": "Something went wrong" }` format.
*   **Data Transformation in Controller:** Price formatting (to 2 decimal places) and city capitalization (stored lowercase, returned capitalized) are handled within the `listing.controller.js` to ensure data consistency and meet the API response requirements.
*   **MongoDB Aggregation Strategy:** The aggregation pipeline in `stats.controller.js` uses `$lookup` to join `mongoListings` with an assumed `listings` collection (for price filtering) and `agents` collection (for agent names) within MongoDB. This assumes that a subset of MySQL listing data (at least price and agentId) and agent names are also available in MongoDB for efficient aggregation. A more robust solution for disparate data sources might involve a data synchronization process or a dedicated data warehousing solution.

## Future Improvements

If I had more than 4 hours, I would improve the following aspects:

*   **Comprehensive Error Handling:** Implement more granular error handling with custom error classes and a global error middleware to centralize and standardize error responses.
*   **Authentication and Authorization:** Add user authentication (e.g., JWT) and role-based authorization to secure API endpoints, especially for `POST`, `PUT`, `DELETE` operations on listings.
*   **Input Validation:** Implement robust input validation for all API requests (e.g., using Joi or Express-validator) to ensure data integrity and improve API reliability.
*   **Pagination, Filtering, and Sorting:** Enhance the `GET /api/listings` endpoint to support pagination, filtering (e.g., by city, price range, bedrooms), and sorting to provide more flexible data retrieval.
*   **Caching:** Introduce caching (e.g., Redis) for frequently accessed data or aggregation results to improve API performance.
*   **Dockerization:** Containerize the application using Docker to ensure consistent development, testing, and deployment environments.
*   **Automated Testing:** Implement unit and integration tests for models, controllers, and routes to ensure correctness and prevent regressions.
*   **Environment-Specific Configurations:** Create more sophisticated environment-specific configurations (development, staging, production) to manage different database credentials, API keys, and other settings.
*   **Agent Management API:** Create a dedicated CRUD API for agents, possibly leveraging MySQL, to manage agent information. This would make the `agentInfo` lookup in the MongoDB aggregation more robust.
*   **Data Synchronization between MySQL and MongoDB:** For the MongoDB aggregation to be truly accurate and comprehensive, a mechanism to synchronize relevant `listings` data (like `price`, `agentId`) and `agents` data (like `name`) from MySQL to MongoDB would be crucial. This could be achieved using change data capture (CDC) or scheduled data exports.

## Laravel Mini-Task (Not Implemented in Node.js)

This part of the task requires Laravel (PHP) and is not implemented within this Node.js project. If this were a full task, I would set up a separate Laravel project for this.

*   **Route:** `GET /laravel/listings`
*   **Functionality:** Fetch all listings from MySQL and return as JSON, including an extra field: `{ "source": "laravel" }`.
