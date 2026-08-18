const express = require("express");

const protect = require("../middleware/authMiddleware");

const { getLeads } = require("../controllers/ownerController");

const {
  getConfig,
  updateConfig,
} = require("../controllers/ownerConfigController");

const router = express.Router();

router.get("/test", protect, (req, res) => {
  res.json({
    message: "Owner access granted",
    user: req.user,
  });
});

router.get("/leads", protect, getLeads);
router.get("/config", protect, getConfig);
router.put("/config", protect, updateConfig);

module.exports = router;
