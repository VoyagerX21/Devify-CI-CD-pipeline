const crypto = require('crypto');
const pipelineService = require('../services/pipelineService');
const Event = require('../models/Event');

const GITHUB_SECRET = process.env.GITHUB_SECRET;

function verifySignature(payload, signature) {
    const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
    const digest = `sha256=${hmac.update(JSON.stringify(payload)).digest('hex')}`;
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

const handleGitHubWebhook = async (req, res) => {
    const event = req.headers['x-github-event'];
    const signature = req.headers['x-hub-signature-256'];
    const payload = req.body;

    // Step 1: Verify signature
    //   if (!signature || !verifySignature(payload, signature)) {
    //     return res.status(401).json({ message: 'Invalid signature' });
    //   }

    // Step 2: Filter supported events
    if (!['push', 'pull_request', 'merge'].includes(event)) {
        return res.status(200).json({ message: `Event ${event} ignored` });
    }

    // Step 3: Trigger mock CI/CD pipeline
    try {
        await pipelineService.triggerPipeline(event, payload);
        await Event.create({
            eventType: event,
            repository: payload.repository?.full_name,
            pusher: payload.pusher?.name,
            message: payload.head_commit?.message,
            status: 'triggered'
        });
        return res.status(200).json({ message: `Pipeline triggered for ${event}` });
    }
    catch (err) {
        await Event.create({
            eventType: event,
            repository: payload.repository?.full_name,
            pusher: payload.pusher?.name,
            message: payload.head_commit?.message,
            status: 'failed'
        });
        return res.status(500).json({ message: 'Pipeline trigger failed' });
    }
};

module.exports = { handleGitHubWebhook };