const express = require('express');
const webhookRoutes = require('./routes/webhookRoutes');

const app = express();

// Raw parser for GitHub webhook only
app.use('/webhook/github', express.raw({ type: 'application/json' }));

// Fallback: Use regular JSON parser for everything else
app.use(express.json());

app.use('/webhook', webhookRoutes);

app.get('/', (req, res) => res.send('Webhook listener running!!'));

module.exports = app;