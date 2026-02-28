const axios = require("axios");
const WebhookDelivery = require("../models/WebhookDelivery");
const Webhook = require("../models/Webhook");

const MAX_RETRIES = 3;

async function retryFailedDeliveries() {
  try {
    console.log("🔄 Running webhook retry job...");

    const failedDeliveries = await WebhookDelivery.find({
      status: "failed",
      retries: { $lt: MAX_RETRIES }
    });

    for (const delivery of failedDeliveries) {
      try {
        const webhook = await Webhook.findById(delivery.webhookId);

        if (!webhook || !webhook.isEnabled) continue;

        const startTime = Date.now();

        const response = await axios.post(webhook.targetUrl, {
          text: `🔁 Retrying webhook for event ${delivery.eventId}`
        });

        delivery.status = "success";
        delivery.responseCode = response.status;
        delivery.responseTimeMs = Date.now() - startTime;
        await delivery.save();

        console.log(`✅ Retried delivery ${delivery._id} successfully`);

      } catch (err) {
        delivery.retries += 1;

        if (delivery.retries >= MAX_RETRIES) {
          console.log(`❌ Delivery ${delivery._id} permanently failed`);
        } else {
          console.log(`🔁 Retrying delivery ${delivery._id} — attempt ${delivery.retries}`);
        }

        await delivery.save();
      }
    }

  } catch (err) {
    console.error("🔴 Retry job error:", err.message);
  }
}

module.exports = retryFailedDeliveries;