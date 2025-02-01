/**
 * Global error handling middleware
 * Catches and formats errors before sending response
 */
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message || err);

    // Set default status code to 500 (Internal Server Error)
    const statusCode = err.status || 500;

    res.status(statusCode).json({
        error: true,
        message: err.message || "Internal Server Error",
    });
};

module.exports = errorHandler;
