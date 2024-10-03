const elasticsearchClient = require("../config/elasticsearch");
const userProfileModel = require("../models/userProfileModel");

// Fetch recommendations based on user's past courses and expertise
exports.getRecommendations = async (userId) => {
  // Fetch user's profile and their expertise/interest areas
  const userProfile = await userProfileModel.findById(userId);
  const expertise = userProfile.expertise;

  // Search courses related to the user's expertise
  const { body } = await elasticsearchClient.search({
    index: "courses-index",
    body: {
      query: {
        match: { topic: expertise },
      },
    },
  });

  return body.hits.hits.map((hit) => hit._source);
};

// Fetch trending topics, courses, and top course generators
exports.getTrending = async () => {
  // Trending courses based on most enrollments/views/likes
  const trendingCourses = await elasticsearchClient.search({
    index: "courses-index",
    body: {
      query: {
        range: {
          views: { gte: 1000 }, // Example: Courses with more than 1000 views
        },
      },
      sort: [{ views: "desc" }],
    },
  });

  // Trending topics based on popular search queries or views
  const trendingTopics = await elasticsearchClient.search({
    index: "topics-index",
    body: {
      query: {
        range: {
          searches: { gte: 500 }, // Example: Topics with more than 500 searches
        },
      },
      sort: [{ searches: "desc" }],
    },
  });

  // Top course generators based on course ratings/enrollments
  const topGenerators = await elasticsearchClient.search({
    index: "generators-index",
    body: {
      query: {
        range: {
          enrollments: { gte: 200 }, // Example: Generators with more than 200 enrollments
        },
      },
      sort: [{ enrollments: "desc" }],
    },
  });

  return {
    trendingCourses: trendingCourses.hits.hits.map((hit) => hit._source),
    trendingTopics: trendingTopics.hits.hits.map((hit) => hit._source),
    topGenerators: topGenerators.hits.hits.map((hit) => hit._source),
  };
};
