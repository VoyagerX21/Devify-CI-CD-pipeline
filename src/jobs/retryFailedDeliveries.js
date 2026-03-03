const axios = require("axios");
const WebhookDelivery = require("../models/WebhookDelivery");
const Webhook = require("../models/Webhook");
const { sendSlackMessage } = require("../utils/slackLogger");

const MAX_RETRIES = 3;

async function retryFailedDeliveries() {
  try {
    console.log("🔄 Running webhook retry job...");

    const failedDeliveries = await WebhookDelivery.find({
      status: "failed",
      $or: [
        { retries: { $exists: false } },
        { retries: { $lt: MAX_RETRIES } }
      ]
    });

    console.log("Failed deliveries found:", failedDeliveries.length);

    if (failedDeliveries.length > 0) {
      await sendSlackMessage(
        `🔄 Retry job started. Found *${failedDeliveries.length}* failed webhook deliveries.`
      );
    }

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
        delivery.retries = delivery.retries || 0;
        await delivery.save();

        console.log(`✅ Retried delivery ${delivery._id} successfully`);

        await sendSlackMessage(
          `✅ Webhook delivery *${delivery._id}* retried successfully after *${delivery.retries}* attempt(s).`
        );

      } catch (err) {
        delivery.retries = (delivery.retries || 0) + 1;

        if (delivery.retries >= MAX_RETRIES) {
          delivery.status = "permanently_failed";
          await delivery.save();

          console.log(`❌ Delivery ${delivery._id} permanently failed`);

          await sendSlackMessage(
            `❌ Webhook delivery *${delivery._id}* permanently failed after *${MAX_RETRIES}* attempts.`
          );

        } else {
          await delivery.save();

          console.log(
            `🔁 Retrying delivery ${delivery._id} — attempt ${delivery.retries}`
          );

          await sendSlackMessage(
            `🔁 Retry attempt *${delivery.retries}/${MAX_RETRIES}* for webhook delivery *${delivery._id}*.`
          );
        }
      }
    }

  } catch (err) {
    console.error("🔴 Retry job error:", err.message);

    await sendSlackMessage(
      `🔴 Retry job encountered an unexpected error: ${err.message}`
    );
  }
}

module.exports = retryFailedDeliveries;