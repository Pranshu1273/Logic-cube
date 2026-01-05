// backend/ollamaService.js

const fetch = require("node-fetch");


async function generateAIInsight(data) {
  try {
    const prompt = `
You are an environmental health expert.

Analyze the combined impact of air pollution and heat.

Data:
- Area Type: ${data.areaType.join(", ")}
- AQI Status: ${data.aqiStatus}
- PM2.5: ${data.pm25}
- PM10: ${data.pm10}
- Temperature: ${data.temperature}°C
- Humidity: ${data.humidity}%
- Heat Status: ${data.heatStatus}

Your response MUST include:
1. Combined environmental risk (air + heat together)
2. Health impact (children, elderly, outdoor workers)
3. Mask recommendation (Yes/No + reason)
4. Food & hydration advice
5. Outdoor activity guidance

Keep it concise, practical, and easy to understand (4–6 lines).
`;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:4b",
        prompt,
        stream: false,
      }),
    });

    const result = await response.json();
    return result.response || "AI insight unavailable.";

  } catch (error) {
    console.error("❌ Ollama AI error:", error.message);
    return "AI insight temporarily unavailable.";
  }
}

module.exports = { generateAIInsight };
