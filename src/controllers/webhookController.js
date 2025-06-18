// Import required dependencies
const pipelineService = require('../services/pipelineService');
const Event = require('../models/Event');
const verifySignature = require('../utils/verifySignature');

// Handles incoming GitHub webhook events
const handleGitHubWebhook = async (req, res) => {
    const secret = process.env.WEBHOOK_SECRET; // Webhook secret from environment variables
    const event = req.headers['x-github-event']; // GitHub event type from headers

    // Parse incoming request body as JSON
    let json;
    try {
        json = JSON.parse(req.body.toString());
    } catch (err) {
        return res.status(400).json({ message: 'Invalid JSON' });
    }

    // Step 1: Verify webhook signature for security
    if (!verifySignature.verifySignature(req, secret)) {
        console.log("Signature verification failed!");
        return res.status(401).json({ message: "Invalid signature" });
    }

    // Step 2: Filter for supported GitHub events
    if (!['push', 'pull_request', 'merge'].includes(event)) {
        return res.status(200).json({ message: `Event ${event} ignored` });
    }

    // Step 3: Trigger CI/CD pipeline and log event
    try {
        await pipelineService.triggerPipeline(event, json);
        await Event.create({
            eventType: event,
            repository: json.repository?.full_name,
            pusher: json.pusher?.name,
            message: json.head_commit?.message,
            status: 'triggered'
        });
        return res.status(200).json({ message: `Pipeline triggered for ${event}` });
    }
    catch (err) {
        // Log failed pipeline trigger
        await Event.create({
            eventType: event,
            repository: json.repository?.full_name,
            pusher: json.pusher?.name,
            message: json.head_commit?.message,
            status: 'failed'
        });
        return res.status(500).json({ message: 'Pipeline trigger failed' });
    }
};

// Retrieves pipeline event history
const getPipelineStatus = async (req, res) => {
    try {
        // Fetch all events, sorted by most recent
        const events = await Event.find().sort({ received: -1 });
        return res.status(200).json({
            count: events.length,
            events: events.map(e => ({
                type: e.eventType,
                repository: e.repository,
                pusher: e.pusher,
                message: e.message,
                status: e.status,
                receivedAt: e.receivedAt
            }))
        });
    }
    catch (err) {
        console.error("Failed to fetch status: ", err);
        return res.status(500).json({ message: "Server error" });
    }
}

// Export controller functions
module.exports = { handleGitHubWebhook, getPipelineStatus };