const express = require("express");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middleware (body parser, routes, etc.)
app.use(express.json());

// Import routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Use error handler (must be after all routes)
app.use(errorHandler);

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
