// backend/simulator.js
require("dotenv").config();
console.log("Gemini key loaded:", !!process.env.GEMINI_API_KEY);
console.log("🔥 simulator.js file is being executed");

const { addEnvironmentSnapshot } = require("./firestore");
const { getAQIStatus, getHeatStatus } = require("./heatwavelogic");
const {
  generateHealthAdvisory,
  generateCombinedRisk
} = require("./AIinsight");
const { getWeatherForArea } = require("./weatherService");


// Utility function to slightly fluctuate pollution values
function fluctuate(base, range) {
  return base + Math.floor(Math.random() * range - range / 2);
}

function varyTemperature(baseTemp, areaType) {
  let temp = baseTemp;

  temp += (Math.random() - 0.5) * 0.4; // ±0.2°C

  if (areaType.includes("Industrial")) temp += 0.2;
  if (areaType.includes("Commercial")) temp += 0.1;

  return Number(temp.toFixed(1));
}



// ☀️ Simulated UV Index (ADD THIS EXACTLY HERE)
function getUVIndex(temp) {
  if (temp < 30) return 3;   // Low
  if (temp < 35) return 6;   // Moderate
  if (temp < 40) return 8;   // High
  return 11;                // Very High
}



// 🏙️ Jaipur areas (FINAL LIST)
const jaipurAreas = [
  { area: "Vaishali Nagar", areaType: ["Residential", "Commercial"], pm25: 85, pm10: 140 },
  { area: "Raja Park", areaType: ["Commercial", "Residential"], pm25: 90, pm10: 150 },
  { area: "Sanganer", areaType: ["Industrial", "Residential"], pm25: 110, pm10: 180 },
  { area: "Vishwakarma", areaType: ["Industrial"], pm25: 130, pm10: 200 },
  { area: "Sitapura", areaType: ["Industrial"], pm25: 125, pm10: 195 },
  { area: "Jagatpura", areaType: ["Residential"], pm25: 75, pm10: 125 },
  { area: "Mansarovar", areaType: ["Residential"], pm25: 80, pm10: 130 },
  { area: "Malviya Nagar", areaType: ["Residential"], pm25: 82, pm10: 135 },
  { area: "Bapu Bazaar", areaType: ["Commercial"], pm25: 95, pm10: 160 }
];

// 🔁 Generate one full snapshot for all areas
async function generateSnapshot() {
  console.log("🟡 Inside generateSnapshot()");

  try {
    for (const a of jaipurAreas) {
      console.log(`➡️ Processing area: ${a.area}`);

      console.log(`🌦️ Fetching weather for ${a.area}`);
      const weather = await getWeatherForArea(a.area);

      const pm25 = fluctuate(a.pm25, 20);
      const pm10 = fluctuate(a.pm10, 30);

      const temperature = varyTemperature(
        weather.temperature ?? 25,
        a.areaType
      );

      const feelsLike = weather.feelsLike ?? temperature;
      const humidity = weather.humidity ?? 50;
      const uvIndex = getUVIndex(temperature);

      const aqiStatus = getAQIStatus(pm25);
      const heatStatus = getHeatStatus(temperature);

      await addEnvironmentSnapshot({
        city: "Jaipur",
        area: a.area,
        areaType: a.areaType,

        pm25,
        pm10,
        temperature,
        feelsLike,
        humidity,
        uvIndex,

        aqiStatus,
        heatStatus,

        healthAdvisory: generateHealthAdvisory(
          a.areaType,
          aqiStatus,
          heatStatus
        ),
        combinedRisk: generateCombinedRisk(aqiStatus, heatStatus)
      });

      console.log(`✅ Data stored for ${a.area}`);
    }
  } catch (error) {
    console.error("❌ Error inside generateSnapshot():", error);
  }
}

 // 🚀 Continuous simulator (hourly updates)
(async () => {
  try {
    console.log("🚀 Simulator started (hourly mode)...");

    // Run once immediately
    await generateSnapshot();

    // Run every 1 hour
    setInterval(async () => {
      console.log("⏰ Hourly environment update...");
      await generateSnapshot();
    }, 30 * 60 * 1000); // 30 minutes

  } catch (error) {
    console.error("❌ Simulator failed:", error);
  }
})();
