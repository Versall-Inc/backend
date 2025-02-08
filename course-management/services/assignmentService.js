// services/courseService.js
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function assessWritingAssignment(assignmentOverview, file) {
  const endpointUrl = "http://course-generation:4004/grade-writing-assignment";
  const formData = new FormData();

  formData.append("assignment_overview", assignmentOverview);
  formData.append("file", fs.createReadStream(file.path));

  try {
    const response = await axios.post(endpointUrl, formData, {
      headers: formData.getHeaders(),
    });

    return response.data;
  } catch (error) {
    console.error("Error assessing writing assignment:", error);
    throw new Error(
      `Failed to assess writing assignment: ${
        error.response ? error.response.data : error.message
      }`
    );
  }
}

module.exports = {
  assessWritingAssignment,
};
