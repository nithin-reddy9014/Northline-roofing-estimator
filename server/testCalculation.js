require("dotenv").config();

const Configuration = require("./models/Configuration");
const connectDB = require("./config/db");

const { calculateEstimate } = require("./services/calculationService");

const testCalculation = async () => {
  try {
    await connectDB();

    const configuration = await Configuration.findOne().sort({
      config_version: -1,
    });

    const answers = {
      roof_area: 1000,
      material: "asphalt_arch",
      pitch: "medium",
      layers: "1",
      stories: "2",
    };

    const result = calculateEstimate(configuration, answers);

    console.log("Test estimate:");
    console.log(result);

    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

testCalculation();
