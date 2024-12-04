const express = require("express");
const jwt = require("jsonwebtoken");
const { createProxyMiddleware } = require("http-proxy-middleware");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// JWT Secret (replace with your secret key)
const JWT_SECRET = "your_secret_key";

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to verify JWT
const jwtMiddleware = (req, res, next) => {
  const bypassRoutes = ["/user/signup", "/user/login"];

  if (bypassRoutes.includes(req.path)) {
    // Skip JWT validation for bypass routes
    return next();
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Attach decoded token attributes to the request
    req.user = decoded;
    next();
  });
};

// Route to User Management Service
app.use(
  "/user",
  jwtMiddleware,
  createProxyMiddleware({
    target: "http://user-management-service:4000", // Docker container name
    changeOrigin: true,
  })
);

// Add routes to other services as needed
app.use(
  "/other-service",
  jwtMiddleware,
  createProxyMiddleware({
    target: "http://other-service:5000", // Example for another service
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
