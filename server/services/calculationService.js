const calculateEstimate = (configuration, answers) => {
  const questions = configuration.questions;

  const roofAreaQuestion = questions.find(
    (question) => question.key === "roof_area",
  );

  const materialQuestion = questions.find(
    (question) => question.key === "material",
  );

  const pitchQuestion = questions.find((question) => question.key === "pitch");

  const layersQuestion = questions.find(
    (question) => question.key === "layers",
  );

  const storiesQuestion = questions.find(
    (question) => question.key === "stories",
  );

  const roofArea = Number(answers.roof_area);

  if (
    !Number.isFinite(roofArea) ||
    roofArea < roofAreaQuestion.min ||
    roofArea > roofAreaQuestion.max
  ) {
    throw new Error(
      `Roof area must be between ${roofAreaQuestion.min} and ${roofAreaQuestion.max} sq ft`,
    );
  }

  const materialOption = materialQuestion.options.find(
    (option) => option.value === answers.material,
  );

  const pitchOption = pitchQuestion.options.find(
    (option) => option.value === answers.pitch,
  );

  const layersOption = layersQuestion.options.find(
    (option) => option.value === answers.layers,
  );

  const storiesOption = storiesQuestion.options.find(
    (option) => option.value === answers.stories,
  );

  if (!materialOption) {
    throw new Error("Invalid roofing material");
  }

  if (!pitchOption) {
    throw new Error("Invalid roof pitch");
  }

  if (!layersOption) {
    throw new Error("Invalid roofing layers");
  }

  if (!storiesOption) {
    throw new Error("Invalid number of stories");
  }

  const materialCost = roofArea * materialOption.rate_per_sqft;

  const wasteCost = materialCost * configuration.modifiers.waste_factor;

  const tearOffCost = roofArea * layersOption.tear_off_per_sqft;

  const subtotal = materialCost + wasteCost + tearOffCost;

  const adjustedSubtotal =
    subtotal * pitchOption.multiplier * storiesOption.multiplier;

  const finalEstimate =
    adjustedSubtotal + configuration.modifiers.permit_flat_fee;

  const spread = configuration.modifiers.range_spread_pct / 100;

  const estimateLow = finalEstimate * (1 - spread);

  const estimateHigh = finalEstimate * (1 + spread);

  return {
    estimate_low: Math.round(estimateLow),
    estimate_high: Math.round(estimateHigh),
  };
};

module.exports = {
  calculateEstimate,
};
