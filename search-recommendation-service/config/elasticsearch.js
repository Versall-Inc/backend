const { Client } = require("@elastic/elasticsearch");

// Configure the Elasticsearch client
const client = new Client({
  node: "http://localhost:9200", // Replace with your actual Elasticsearch endpoint
});

module.exports = client;
