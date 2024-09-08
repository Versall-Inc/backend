const axios = require("axios");

const getUnsplashImage = async (searchTerm) => {
  const response = await axios.get(`https://api.unsplash.com/photos/random`, {
    params: {
      query: searchTerm,
      client_id: process.env.UNSPLASH_ACCESS_KEY,
    },
  });

  return response.data.urls.regular;
};

module.exports = { getUnsplashImage };
