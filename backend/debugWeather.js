console.log("🌦️ debugWeather started");

const { getCurrentWeather } = require("./weatherService");

(async () => {
  try {
    console.log("📡 Calling OpenWeather API...");
    const data = await getCurrentWeather();
    console.log("✅ Weather data received:", data);
  } catch (err) {
    console.error("❌ Weather error:", err);
  }
})();
