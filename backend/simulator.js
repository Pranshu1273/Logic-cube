// backend/simulator.js

const path = require("path");

// Load environment variables (safe even if .env is empty)
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

console.log("🔥 simulator.js file is being executed");

// 🧠 Local AI via Ollama (Gemma)
const { generateAIInsight } = require("./ollamaService");

// 🔥 Firestore
const { addEnvironmentSnapshot } = require("./firestore");

// 🌡️ Logic helpers
const { getAQIStatus, getHeatStatus } = require("./heatwavelogic");
const {
  generateHealthAdvisory,
  generateCombinedRisk,
} = require("./AIinsight");

// 🌦️ Weather
const { getWeatherForArea } = require("./weatherService");

/* -------------------------------------------------- */
/* Utility functions                                  */
/* -------------------------------------------------- */

// Slight random fluctuation for pollution
function fluctuate(base, range) {
  return base + Math.floor(Math.random() * range - range / 2);
}

// ☀️ UV Index simulation
function getUVIndex(temp) {
  if (temp < 30) return 3;   // Low
  if (temp < 35) return 6;   // Moderate
  if (temp < 40) return 8;   // High
  return 11;                // Very High
}

/* -------------------------------------------------- */
/* Jaipur Areas with Coordinates                      */
/* -------------------------------------------------- */

const jaipurAreas = [
  { area: "Vaishali Nagar", lat: 26.9124, lng: 75.7482, areaType: ["Residential", "Commercial"], pm25: 85, pm10: 140 },
  { area: "Raja Park", lat: 26.8932, lng: 75.8235, areaType: ["Commercial", "Residential"], pm25: 90, pm10: 150 },
  { area: "Sanganer", lat: 26.8205, lng: 75.8003, areaType: ["Industrial", "Residential"], pm25: 110, pm10: 180 },
  { area: "Vishwakarma", lat: 26.9636, lng: 75.7733, areaType: ["Industrial"], pm25: 130, pm10: 200 },
  { area: "Sitapura", lat: 26.7784, lng: 75.8412, areaType: ["Industrial"], pm25: 125, pm10: 195 },
  { area: "Jagatpura", lat: 26.8540, lng: 75.8655, areaType: ["Residential"], pm25: 75, pm10: 125 },
  { area: "Mansarovar", lat: 26.8470, lng: 75.7645, areaType: ["Residential"], pm25: 80, pm10: 130 },
  { area: "Malviya Nagar", lat: 26.8505, lng: 75.8120, areaType: ["Residential"], pm25: 82, pm10: 135 },
  { area: "Bapu Bazaar", lat: 26.9239, lng: 75.8267, areaType: ["Commercial"], pm25: 95, pm10: 160 },
];

/* -------------------------------------------------- */
/* Snapshot Generator                                 */
/* -------------------------------------------------- */

async function generateSnapshot() {
  console.log("🟡 Inside generateSnapshot()");

  try {
    for (const a of jaipurAreas) {
      console.log(`➡️ Processing area: ${a.area}`);
      console.log(`📍 Coordinates: ${a.lat}, ${a.lng}`);

      // 🌦️ Weather
      const weather = await getWeatherForArea(a.area);

      // 🌫️ Pollution
      const pm25 = fluctuate(a.pm25, 20);
      const pm10 = fluctuate(a.pm10, 30);

      // 🌡️ Temperature
      const temperature = weather.temperature;


      const feelsLike = weather.feelsLike ?? temperature;
      const humidity = weather.humidity ?? 50;
      const uvIndex = getUVIndex(temperature);

      // 🚦 Status
      const aqiStatus = getAQIStatus(pm25);
      const heatStatus = getHeatStatus(temperature);

      // 🧠 AI Insight (LOCAL – Gemma via Ollama)
      const aiInsight = await generateAIInsight({
        areaType: a.areaType,
        pm25,
        pm10,
        temperature,
        humidity,
        aqiStatus,
        heatStatus,
      });

      // 🔥 Firestore write
      await addEnvironmentSnapshot({
        city: "Jaipur",
        area: a.area,
        areaType: a.areaType,
        lat: a.lat,
        lng: a.lng,

        pm25,
        pm10,
        temperature,
        feelsLike,
        humidity,
        uvIndex,

        aqiStatus,
        heatStatus,
        aiInsight,

        healthAdvisory: generateHealthAdvisory(
          a.areaType,
          aqiStatus,
          heatStatus
        ),
        combinedRisk: generateCombinedRisk(aqiStatus, heatStatus),
      });

      console.log(`✅ Data stored for ${a.area}`);
    }
  } catch (error) {
    console.error("❌ Error inside generateSnapshot():", error);
  }
}

/* -------------------------------------------------- */
/* Runner                                             */
/* -------------------------------------------------- */

(async () => {
  try {
    console.log("🚀 Simulator started (hourly mode)...");

    // Run once immediately
    await generateSnapshot();

    // Run every 30 minutes
    setInterval(async () => {
      console.log("⏰ Scheduled environment update...");
      await generateSnapshot();
    }, 30 * 60 * 1000);

  } catch (error) {
    console.error("❌ Simulator failed:", error);
  }
})();
