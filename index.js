const express = require("express");
const axios = require("axios");
const redis = require("redis");
require("dotenv").config({ path: ".env.local" });

// Redic configuration
const redisClient = redis.createClient();
redisClient.connect().catch(console.error);

const app = express();
const PORT = 3000;

// API constans
const EXTERNAL_API_URL = "https://api.football-data.org/v4/matches";
const API_KEY = process.env.API_KEY;

// Fetch data and save in redis
const fetchAndCacheMatchData = async () => {
  try {
    const response = await axios.get(EXTERNAL_API_URL, {
      headers: { "X-Auth-Token": API_KEY },
    });

    // Zapisz wynik w Redis
    await redisClient.set("matchData", JSON.stringify(response.data));
    console.log("Data saved in Redis at: ", new Date().toLocaleTimeString());
  } catch (error) {
    console.error("Error fethcing data from API:", error);
  }
};

// Set fetching data in interval
setInterval(fetchAndCacheMatchData, 10000);

// Endpoint to fetch data from Redis
app.get("/data", async (req, res) => {
  try {
    const cachedData = await redisClient.get("matchData");
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "[data-server]: error", error });
  }
});

// Uruchom serwer
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
