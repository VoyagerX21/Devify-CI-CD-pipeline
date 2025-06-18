// Import the Express framework for building the web server
const express = require('express');
// Import webhook routes from a separate module
const webhookRoutes = require('./routes/webhookRoutes');

// Initialize the Express application
const app = express();

// Apply raw body parser middleware specifically for GitHub webhook endpoint
// to handle raw JSON payloads
app.use('/webhook/github', express.raw({ type: 'application/json' }));

// Apply JSON body parser middleware for all other routes
app.use(express.json());

// Mount webhook routes under the '/webhook' path
app.use('/webhook', webhookRoutes);

// Define a root route to confirm the webhook listener is running
app.get('/', (req, res) => res.send('Webhook listener running!!'));

// Export the Express app for use in other modules (e.g., server startup)
module.exports = app;