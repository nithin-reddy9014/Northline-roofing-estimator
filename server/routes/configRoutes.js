const express = require("express");

const { getConfiguration } = require("../controllers/configController");

const router = express.Router();

router.get("/", getConfiguration);

module.exports = router;
