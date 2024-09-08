const { getYouTubeVideos } = require("../services/youtubeService");
const { getUnsplashImage } = require("../services/unsplashService");
const cache = require("../utils/cache");

exports.fetchYouTubeContent = async (req, res) => {
  const { query } = req.body;

  const cachedData = await cache.get(query);
  if (cachedData) {
    return res.json({ data: JSON.parse(cachedData) });
  }

  try {
    const videos = await getYouTubeVideos(query);
    await cache.set(query, JSON.stringify(videos));
    res.json({ data: videos });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch YouTube content" });
  }
};

exports.fetchUnsplashImage = async (req, res) => {
  const { searchTerm } = req.body;

  const cachedData = await cache.get(searchTerm);
  if (cachedData) {
    return res.json({ data: JSON.parse(cachedData) });
  }

  try {
    const image = await getUnsplashImage(searchTerm);
    await cache.set(searchTerm, JSON.stringify(image));
    res.json({ data: image });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Unsplash image" });
  }
};
