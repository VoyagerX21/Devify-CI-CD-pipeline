const axios = require("axios");
const Webhook = require("../models/Webhook");
const WebhookDelivery = require("../models/WebhookDelivery");
const { sendSlackMessage } = require("../utils/slackLogger");

const dispatchWebhooks = async (eventDoc, user, repo) => {
  console.log(`[DISPATCHER] Dispatching webhooks for ${eventDoc.type}`);

  const webhooks = await Webhook.find({
    isEnabled: true,
    subscribedEvents: eventDoc.type
  });

  console.log("Event Type:", eventDoc.type);
  console.log("Webhooks Found:", webhooks.length);

  for (const hook of webhooks) {
    const startTime = Date.now();

    try {
      const branch = eventDoc.branch || payload.push?.changes[0]?.new?.name || "N/A";
      const message = `
        🚀 *PipelineHub Notification*

        📌 *Event:* ${eventDoc.type.toUpperCase()}
        👤 *Triggered by:* ${user.username || "Unknown"}
        📂 *Repository:* ${repo.name || "Unknown"}
        🌿 *Branch:* ${branch}
        🔗 *Platform:* ${eventDoc.provider.toUpperCase()}

        ⚙️ Processed via *PipelineHub CI Orchestration Engine*
      `;
      // await sendSlackMessage(message);
      const response = await axios.post(hook.targetUrl, {
        text: message
      });

      await WebhookDelivery.create({
        webhookId: hook._id,
        eventId: eventDoc._id,
        status: "success",
        responseCode: response.status,
        responseTimeMs: Date.now() - startTime
      });

      console.log(`[DISPATCHER] Webhook success → ${hook.name}`);

    } catch (err) {
      await WebhookDelivery.create({
        webhookId: hook._id,
        eventId: eventDoc._id,
        status: "failed",
        responseCode: err.response?.status || 500,
        responseTimeMs: Date.now() - startTime
      });

      console.error(`[DISPATCHER] Webhook failed → ${hook.name}`);
    }
  }
};

module.exports = { dispatchWebhooks };