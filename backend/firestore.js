const { db } = require("./firebase");

const {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} = require("firebase/firestore");

/**
 * Add one environment snapshot
 */
async function addEnvironmentSnapshot(data) {
  try {
    console.log("🧪 Writing snapshot for:", data.area, "UV:", data.uvIndex);

    await addDoc(collection(db, "environmentData"), {
      city: data.city,
      area: data.area,
      areaType: data.areaType,

      pm25: data.pm25,
      pm10: data.pm10,

      temperature: data.temperature,
      feelsLike: data.feelsLike,
      humidity: data.humidity,

      // ✅ SAFE: Firestore never receives undefined
      uvIndex: typeof data.uvIndex === "number" ? data.uvIndex : 0,

      aqiStatus: data.aqiStatus,
      heatStatus: data.heatStatus,

      healthAdvisory: data.healthAdvisory,
      combinedRisk: data.combinedRisk,

      updatedAt: Timestamp.now()
    });

    console.log("✅ Firestore write success:", data.area);
  } catch (error) {
    console.error("❌ Firestore write error:", error);
  }
}

module.exports = {
  addEnvironmentSnapshot
};
