const express = require("express");
const axios = require("axios");
const redis = require("redis");
require("dotenv").config({ path: ".env.local" });

// Redis configuration
const redisClient = redis.createClient({
  url: "redis://redis:6379",
});
redisClient.connect().catch(console.error);

const app = express();
const PORT = 3001;

// API constans
const EXTERNAL_API_URL = "https://api.football-data.org/v4/matches";
const API_KEY = process.env.API_KEY;

// Fetch data and save in redis
const fetchAndCacheMatchData = async () => {
  try {
    const response = await axios.get(EXTERNAL_API_URL, {
      headers: { "X-Auth-Token": API_KEY },
    });

    // Save data in redis
    await redisClient.set("matchData", JSON.stringify(response.data));
    console.log("Data saved in Redis at: ", new Date().toLocaleTimeString());
  } catch (error) {
    console.error("Error fethcing data from API:", error);
  }
};

// Set fetching data in interval
setInterval(fetchAndCacheMatchData, 20000);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
