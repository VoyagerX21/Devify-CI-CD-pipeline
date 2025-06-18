// Import the Express application from the src/app module
const app = require('./src/app');
// Import dotenv to load environment variables from a .env file
const dotenv = require('dotenv');
// Load environment variables into process.env
dotenv.config();

// Import and execute the MongoDB connection function
const connectDB = require('./src/config/db');
connectDB();

// Set the port from environment variables, default to 3000 if not defined
const PORT = process.env.PORT || 3000;

// Start the Express server and log the port it's running on
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});