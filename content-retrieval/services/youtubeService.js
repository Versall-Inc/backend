const axios = require("axios");

exports.getYouTubeVideos = async (query) => {
  const response = await axios.get(
    "https://www.googleapis.com/youtube/v3/search",
    {
      params: {
        part: "snippet",
        maxResults: 5,
        q: query,
        key: process.env.YOUTUBE_API_KEY,
      },
    }
  );

  return response.data.items.map((item) => ({
    title: item.snippet.title,
    videoId: item.id.videoId,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  }));
};
