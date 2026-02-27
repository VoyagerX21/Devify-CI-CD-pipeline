const mongoose = require("mongoose");

const pipelineRunSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    repositoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },

    status: {
      type: String,
      enum: ["running", "success", "failed"],
      default: "running",
    },

    logs: String,

    startedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

pipelineRunSchema.index({ repositoryId: 1 });
pipelineRunSchema.index({ status: 1 });

module.exports = mongoose.model("PipelineRun", pipelineRunSchema);