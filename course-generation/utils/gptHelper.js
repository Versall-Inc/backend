const axios = require("axios");

// New function to interact with the Content Retrieval Service
const fetchFromContentService = async (endpoint, data) => {
  const response = await axios.post(`http://content-service/${endpoint}`, data);
  return response.data;
};

// Example usage in GPT helper
const strict_output = async (instruction, prompt, schema) => {
  const response = await fetchFromContentService("generate-output", {
    instruction,
    prompt,
    schema,
  });
  return response.output;
};

module.exports = { strict_output };
