// Import the Express framework for building the web server
const express = require('express');
// Import webhook routes from a separate module
const webhookRoutes = require('./routes/webhookRoutes');

// Initialize the Express application
const app = express();

// Initialization for the API documentation at route /api-docs using swagger.yaml
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// Apply raw body parser middleware specifically for GitHub webhook endpoint
// to handle raw JSON payloads
app.use('/webhook/github', express.raw({ type: 'application/json' }));
app.use('/webhook/gitlab', express.raw({ type: 'application/json' }));
app.use('/webhook/bitbucket', express.raw({ type: 'application/json' }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Apply JSON body parser middleware for all other routes
app.use(express.json());

// Mount webhook routes under the '/webhook' path
app.use('/webhook', webhookRoutes);

// Define a root route to confirm the webhook listener is running
app.get('/', (req, res) => res.send('Webhook listener running events!!'));

// Export the Express app for use in other modules (e.g., server startup)
module.exports = app;