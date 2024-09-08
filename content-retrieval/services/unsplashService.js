const axios = require("axios");

exports.getUnsplashImage = async (searchTerm) => {
  const response = await axios.get("https://api.unsplash.com/search/photos", {
    params: {
      query: searchTerm,
      client_id: process.env.UNSPLASH_ACCESS_KEY,
      per_page: 1,
    },
  });

  const image = response.data.results[0];
  return {
    url: image.urls.small,
    description: image.alt_description,
    photographer: image.user.name,
  };
};
