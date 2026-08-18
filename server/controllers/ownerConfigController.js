const Config = require("../models/Configuration");

const getConfig = async (req, res) => {
  try {
    const config = await Config.findOne();

    if (!config) {
      return res.status(404).json({
        message: "Configuration not found",
      });
    }

    res.json({
      config,
    });
  } catch (error) {
    console.error("Get config error:", error);

    res.status(500).json({
      message: "Unable to load configuration",
    });
  }
};

const updateConfig = async (req, res) => {
  try {
    const updates = req.body;

    const config = await Config.findOne();

    if (!config) {
      return res.status(404).json({
        message: "Configuration not found",
      });
    }

    if (updates.business) {
      config.business = {
        ...config.business,
        ...updates.business,
      };
    }

    if (updates.questions) {
      config.questions = updates.questions;
    }

    if (updates.pricing) {
      config.pricing = updates.pricing;
    }

    if (updates.modifiers) {
      config.modifiers = updates.modifiers;
    }

    await config.save();

    res.json({
      message: "Configuration updated successfully",
      config,
    });
  } catch (error) {
    console.error("Update config error:", error);

    res.status(500).json({
      message: "Unable to update configuration",
    });
  }
};

module.exports = {
  getConfig,
  updateConfig,
};
