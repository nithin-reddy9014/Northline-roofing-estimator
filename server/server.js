const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const configRoutes = require("./routes/configRoutes");
const leadRoutes = require("./routes/leadRoutes");
const authRoutes = require("./routes/authRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/config", configRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/owner", ownerRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Northline Roof Estimator API is running",
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
