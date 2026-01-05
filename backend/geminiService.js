// backend/geminiService.js
const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Gemini REST v1 endpoint (THIS IS IMPORTANT)
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent";


async function generateAIInsight(data) {
  try {
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are an environmental health assistant.

Analyze the following data and provide:
1. A short health insight (1–2 lines)
2. A short near-term prediction (next few hours)

Data:
- Area Type: ${data.areaType.join(", ")}
- AQI Status: ${data.aqiStatus}
- PM2.5: ${data.pm25}
- PM10: ${data.pm10}
- Temperature: ${data.temperature}°C
- Humidity: ${data.humidity}%
- Heat Status: ${data.heatStatus}

Keep the response simple, practical, and human-friendly.
`
            }
          ]
        }
      ]
    };

    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return (
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No AI insight generated."
    );
  } catch (error) {
    console.error(
      "❌ Gemini REST error:",
      error.response?.data || error.message
    );
    return "AI insight temporarily unavailable.";
  }
}

module.exports = { generateAIInsight };
