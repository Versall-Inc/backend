const express = require("express");
const searchController = require("../controllers/searchController");

const router = express.Router();

// Route for searching topics, public courses, and course generators
router.get("/search", searchController.search);

// Route for fetching course recommendations for a user
router.get("/recommendations/:userId", searchController.getRecommendations);

// Route for fetching trending data (topics, courses, top generators)
router.get("/trending", searchController.getTrending);

module.exports = router;
