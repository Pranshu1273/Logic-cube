// backend/firestore.js

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
 * Store one snapshot of environment data
 * (One area, one timestamp)
 */
async function addEnvironmentSnapshot(data) {
  try {
    await addDoc(collection(db, "environmentData"), {
      city: data.city,
      area: data.area,
      areaType: data.areaType,

      pm25: data.pm25,
      pm10: data.pm10,
      temperature: data.temperature,
      feelsLike: data.feelsLike,

      aqiStatus: data.aqiStatus,
      heatStatus: data.heatStatus,

      aiHealthAdvisory: data.aiHealthAdvisory,
      aiCombinedRisk: data.aiCombinedRisk,

      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error saving environment data:", error);
  }
}

/**
 * Fetch latest data for Jaipur (for dashboard)
 */
async function getLatestJaipurData() {
  try {
    const q = query(
      collection(db, "environmentData"),
      where("city", "==", "Jaipur"),
      orderBy("updatedAt", "desc"),
      limit(20)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching Jaipur data:", error);
  }
}

module.exports = {
  addEnvironmentSnapshot,
  getLatestJaipurData
};
