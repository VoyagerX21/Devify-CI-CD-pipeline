const axios = require('axios');
const webhookUrl = process.env.SLACK_WEBHOOK_URL;

exports.sendNotification = async (message) => {
    if (!webhookUrl) return;

    try {
        await axios.post(webhookUrl, {
            text: message
        });
    } catch (err) {
        console.error("❌ Failed to send Slack notification:", err.message);
    }
};