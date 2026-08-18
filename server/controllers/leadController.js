const Lead = require("../models/Lead");
const Configuration = require("../models/Configuration");

const { calculateEstimate } = require("../services/calculationService");

const createLead = async (req, res) => {
  try {
    const { name, phone, email, answers } = req.body;

    if (!name || !phone || !email || !answers) {
      return res.status(400).json({
        message: "Name, phone, email and answers are required",
      });
    }

    const configuration = await Configuration.findOne().sort({
      config_version: -1,
    });

    if (!configuration) {
      return res.status(500).json({
        message: "Configuration not found",
      });
    }

    const estimate = calculateEstimate(configuration, answers);

    const lead = await Lead.create({
      config_version: configuration.config_version,
      name,
      phone,
      email,
      answers,
      estimate_low: estimate.estimate_low,
      estimate_high: estimate.estimate_high,
    });

    res.status(201).json({
      message: "Lead created successfully",

      lead: {
        id: lead._id,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        answers: lead.answers,
        estimate_low: lead.estimate_low,
        estimate_high: lead.estimate_high,
      },
    });
  } catch (error) {
    console.error("Create lead error:", error);

    res.status(400).json({
      message: error.message || "Failed to create lead",
    });
  }
};

module.exports = {
  createLead,
};
