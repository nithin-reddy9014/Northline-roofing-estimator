const Lead = require("../models/Lead");

const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    res.json({
      leads,
    });
  } catch (error) {
    console.error("Get leads error:", error);

    res.status(500).json({
      message: "Unable to load leads",
    });
  }
};

module.exports = {
  getLeads,
};
