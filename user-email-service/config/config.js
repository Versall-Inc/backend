require("dotenv").config();

module.exports = {
    USER_MANAGEMENT_API_URL: process.env.USER_MANAGEMENT_API_URL || "http://user-management-service:4000/user/bulk",
    EMAIL_SERVICE_HOST: process.env.EMAIL_SERVICE_HOST || "smtp.office365.com",
    EMAIL_SERVICE_PORT: process.env.EMAIL_SERVICE_PORT || 587,
    EMAIL_SERVICE_USER: process.env.EMAIL_SERVICE_USER || "contact@intellicourse.ca",
    EMAIL_SERVICE_PASS: process.env.EMAIL_SERVICE_PASS || "2024IntelliCourse!",
    SERVER_PORT: process.env.SERVER_PORT || 5010
};
