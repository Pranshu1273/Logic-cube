const axios = require("axios");

const API_KEY = "20cd84d16d7de9edceb3fa38733fe01b";
const CITY = "Jaipur";

async function getCurrentWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;
  const response = await axios.get(url);

  return {
    temperature: response.data.main.temp,
    feelsLike: response.data.main.feels_like,
    humidity: response.data.main.humidity
  };
}

module.exports = { getCurrentWeather };
