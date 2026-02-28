const axios = require("axios");
const Webhook = require("../models/Webhook");
const WebhookDelivery = require("../models/WebhookDelivery");

const dispatchWebhooks = async (eventDoc) => {
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
      const response = await axios.post(hook.targetUrl, {
        event: eventDoc.type,
        provider: eventDoc.provider,
        repositoryId: eventDoc.repositoryId,
        eventId: eventDoc._id
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