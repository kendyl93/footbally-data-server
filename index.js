const express = require("express");
const redis = require("redis");
require("dotenv").config({ path: ".env.local" });

// Redis configuration
const redisClient = redis.createClient();
redisClient.connect().catch(console.error);

const app = express();
const PORT = 4000;

// Endpoint to fetch match data from Redis (through the BFF)
app.get("/matches", async (req, res) => {
  try {
    // fetching data from redis
    const cachedData = await redisClient.get("matchData");
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    } else {
      return res.status(404).json({ message: "No data" });
    }
  } catch (error) {
    return res.status(500).json({ message: "[BFF]: error", error });
  }
});

app.post("/users", async (req, res) => {
  res.send("users");
});

// Start BFF server
app.listen(PORT, () => {
  console.log(`BFF Server running on port ${PORT}`);
});
