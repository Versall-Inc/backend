const searchService = require("../services/searchService");
const recommendationService = require("../services/recommendationService");

// Search for Topics, Public Courses, and Course Generators
exports.search = async (req, res) => {
  try {
    const { query, type } = req.query; // Query could be "topics", "courses", or "generators"

    const results = await searchService.search(query, type);
    return res.status(200).json({ success: true, results });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get course recommendations based on user profile and history
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId; // User ID from request params
    const recommendations = await recommendationService.getRecommendations(
      userId
    );
    return res.status(200).json({ success: true, recommendations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get trending topics, courses, and top course generators
exports.getTrending = async (req, res) => {
  try {
    const trendingData = await recommendationService.getTrending();
    return res.status(200).json({ success: true, data: trendingData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
