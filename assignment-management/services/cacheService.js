// services/cacheService.js
const redisClient = require("../config/redis");

const getCache = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const setCache = (key, value, expiration = 3600) => {
  redisClient.setex(key, expiration, JSON.stringify(value));
};

module.exports = {
  getCache,
  setCache,
};
