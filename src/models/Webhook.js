const mongoose = require("mongoose");

const webhookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    targetUrl: {
      type: String,
      required: true,
    },

    subscribedEvents: [String],

    providers: [
      {
        type: String,
        enum: ["github", "gitlab", "bitbucket"],
      },
    ],

    isEnabled: {
      type: Boolean,
      default: true,
    },

    deliveryCount: {
      type: Number,
      default: 0,
    },

    lastTriggeredAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Webhook", webhookSchema);