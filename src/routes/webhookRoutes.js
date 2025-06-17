const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Route to handle GitHub webhook
router.post('/github', webhookController.handleGitHubWebhook);
router.get('/status', webhookController.getPipelineStatus);

module.exports = router;