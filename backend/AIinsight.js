// backend/AIinsight.js

function generateHealthAdvisory(areaType, aqiStatus, heatStatus) {
  let advice = "General precautions advised.";

  if (aqiStatus === "Poor" || aqiStatus === "Very Poor" || aqiStatus === "Severe") {
    advice = "People with asthma, children, and elderly should avoid outdoor activities.";
  }

  if (heatStatus === "Heatwave Alert") {
    advice += " Stay hydrated and avoid outdoor exposure during peak afternoon hours.";
  }

  if (heatStatus === "Severe Heatwave") {
    advice += " Remain indoors, use cooling methods, and seek medical attention if unwell.";
  }

  if (areaType.includes("Industrial")) {
    advice += " Industrial emissions may worsen exposure; use protective masks if outdoors.";
  }

  return advice;
}

function generateCombinedRisk(aqiStatus, heatStatus) {
  if (
    (aqiStatus === "Poor" || aqiStatus === "Very Poor" || aqiStatus === "Severe") &&
    (heatStatus === "Heatwave Alert" || heatStatus === "Severe Heatwave")
  ) {
    return "High temperature combined with poor air quality significantly increases health risk.";
  }

  return "Moderate environmental risk. Follow standard precautions.";
}

module.exports = {
  generateHealthAdvisory,
  generateCombinedRisk
};
