const express = require("express");

const { ROUTES } = require("./routes");

const { setupLogging } = require("./logging");
const { setupRateLimit } = require("./ratelimit");
const { setupCreditCheck } = require("./creditcheck");
const { setupProxies } = require("./proxy");
const { setupAuth } = require("./auth");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration to allow all origins with credentials
const corsOptions = {
  origin: function (origin, callback) {
    // If no origin is present in the request (e.g., mobile apps, curl requests), allow it
    if (!origin) return callback(null, true);
    // Otherwise, reflect the origin
    callback(null, origin);
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

setupLogging(app);
setupRateLimit(app, ROUTES);
setupAuth(app, ROUTES);
setupCreditCheck(app, ROUTES);
setupProxies(app, ROUTES);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
