const Configuration = require("../models/Configuration");

const getConfiguration = async (req, res) => {
  try {
    const configuration = await Configuration.findOne().sort({
      config_version: -1,
    });

    if (!configuration) {
      return res.status(404).json({
        message: "Configuration not found",
      });
    }

    res.json(configuration);
  } catch (error) {
    console.error("Get configuration error:", error);

    res.status(500).json({
      message: "Failed to load configuration",
    });
  }
};

module.exports = {
  getConfiguration,
};
