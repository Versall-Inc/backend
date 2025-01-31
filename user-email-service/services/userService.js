const axios = require("axios");
const config = require("../config/config");

/**
 * Fetch user details from the User Management API
 * @param {string[]} userIds - Array of user IDs
 * @returns {Promise<Array>} - Resolves with an array of user objects
 */
const getUserDetails = async (userIds) => {
    try {
        // Send a request to the User Management API
        const response = await axios.post(config.USER_MANAGEMENT_API_URL, { ids: userIds });

        // Validate response
        if (!response.data || !Array.isArray(response.data)) {
            throw new Error("Invalid response from User Management API");
        }

        return response.data; // Expected to return an array of users with emails
    } catch (error) {
        console.error("Error fetching user details:", error.message || error);
        throw new Error("Failed to fetch user details");
    }
};

module.exports = { getUserDetails };
