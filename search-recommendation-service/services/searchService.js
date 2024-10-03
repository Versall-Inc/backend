const elasticsearchClient = require("../config/elasticsearch");

// Search for topics, courses, or course generators
exports.search = async (query, type) => {
  const index =
    type === "topics"
      ? "topics-index"
      : type === "courses"
      ? "courses-index"
      : "generators-index"; // Choose the correct Elasticsearch index

  const { body } = await elasticsearchClient.search({
    index: index,
    body: {
      query: {
        match: { name: query }, // Search based on the name field
      },
    },
  });

  return body.hits.hits.map((hit) => hit._source);
};
