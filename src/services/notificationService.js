const axios = require('axios');
const webhookUrl = process.env.SLACK_WEBHOOK_URL; // getting the URL from the .env

exports.sendNotification = async (message) => {
    if (!webhookUrl) return; // Double check for the URL to be present in the variable

    try {
        // post the message onto the Channel
        await axios.post(webhookUrl, {
            text: message
        });
    } catch (err) {
        console.error("❌ Failed to send Slack notification:", err.message);
    }
};