const axios = require("axios");

const API_KEY = "20cd84d16d7de9edceb3fa38733fe01b";

/**
 * Coordinates for each Jaipur locality
 */
const areaCoordinates = {
  "Vaishali Nagar": { lat: 26.9124, lon: 75.7481 },
  "Mansarovar": { lat: 26.8530, lon: 75.7640 },
  "Malviya Nagar": { lat: 26.8546, lon: 75.8150 },
  "Raja Park": { lat: 26.8946, lon: 75.8267 },
  "Sanganer": { lat: 26.8215, lon: 75.7943 },
  "Vishwakarma": { lat: 26.9633, lon: 75.7710 },
  "Sitapura": { lat: 26.7784, lon: 75.8496 },
  "Jagatpura": { lat: 26.8456, lon: 75.8723 },
  "Bapu Bazaar": { lat: 26.9239, lon: 75.8267 }
};

/**
 * Fetch weather for a specific area
 */
async function getWeatherForArea(areaName) {
  const coords = areaCoordinates[areaName];

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`;
  const response = await axios.get(url);

  // Take next 24 hours (8 entries × 3h)
  const next24h = response.data.list.slice(0, 8);

  const minTemp = Math.min(
    ...next24h.map(item => item.main.temp_min)
  );

  return {
    temperature: minTemp,
    feelsLike: minTemp,
    humidity: next24h[0].main.humidity
  };
}


module.exports = { getWeatherForArea };
