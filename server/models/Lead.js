const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    config_version: {
      type: Number,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    answers: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    estimate_low: {
      type: Number,
      required: true,
    },

    estimate_high: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Lead", leadSchema);
