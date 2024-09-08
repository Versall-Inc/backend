const redis = require("redis");
const redisClient = redis.createClient();

redisClient.on("error", (err) => console.log("Redis Client Error", err));

exports.get = async (key) => {
  const value = await redisClient.get(key);
  return value;
};

exports.set = async (key, value) => {
  await redisClient.set(key, value, {
    EX: 3600, // 1 hour expiration
  });
};
