const pipelineService = require('../services/pipelineService');
const Event = require('../models/Event');
const verifySignature = require('../utils/verifySignature');

const handleGitHubWebhook = async (req, res) => {
    const secret = process.env.WEBHOOK_SECRET;
    const event = req.headers['x-github-event'];

    let json;
    try {
        json = JSON.parse(req.body.toString());
    } catch (err) {
        return res.status(400).json({ message: 'Invalid JSON' });
    }

    // Step 1: Verify signature
    if (!verifySignature.verifySignature(req, secret)) {
        console.log("Signature verification failed!");
        return res.status(401).json({ message: "Invalid signature" });
    }

    // Step 2: Filter supported events
    if (!['push', 'pull_request', 'merge'].includes(event)) {
        return res.status(200).json({ message: `Event ${event} ignored` });
    }

    // Step 3: Trigger mock CI/CD pipeline
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

const getPipelineStatus = async (req, res) => {
    try{
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
    catch (err){
        console.error("Failed to fetch status: ", err);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = { handleGitHubWebhook, getPipelineStatus };