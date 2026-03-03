const axios = require("axios");

const slackUrl = process.env.SLACK_WEBHOOK_URL;

async function sendSlackMessage(message) {
  if (!slackUrl) return;

  try {
    await axios.post(slackUrl, { text: message });
  } catch (err) {
    console.error("Slack logging failed:", err.message);
  }
}

module.exports = { sendSlackMessage };