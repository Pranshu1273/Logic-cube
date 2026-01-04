// backend/heatwavelogic.js

function getAQIStatus(pm25) {
  if (pm25 <= 60) return "Good";
  if (pm25 <= 90) return "Moderate";
  if (pm25 <= 120) return "Poor";
  if (pm25 <= 250) return "Very Poor";
  return "Severe";
}

function getHeatStatus(temperature) {
  if (temperature < 35) return "Normal";
  if (temperature < 40) return "Heatwave Alert";
  return "Severe Heatwave";
}

module.exports = {
  getAQIStatus,
  getHeatStatus
};
