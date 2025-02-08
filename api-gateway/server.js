const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const { ROUTES } = require("./routes");

const { setupLogging } = require("./logging");
const { setupRateLimit } = require("./ratelimit");
const { setupCreditCheck } = require("./creditcheck");
const { setupProxies } = require("./proxy");
const { setupAuth } = require("./auth");

const app = express();
const port = process.env.PORT || 3000;

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.protocol.toUpperCase()} ${req.method} ${req.url} - ${res.statusCode}`);
  next();
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    callback(null, origin);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: "API Gateway is running",
    timestamp: new Date().toISOString()
  });
});

app.get('/test', (req, res) => {
  res.json({ message: "Server is responding" });
});

app.get('/health', (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

setupLogging(app);
setupRateLimit(app, ROUTES);
setupAuth(app, ROUTES);
setupCreditCheck(app, ROUTES);
setupProxies(app, ROUTES);

// SSL configuration
const httpsOptions = {
  key: fs.readFileSync('/etc/ssl/certs/35.193.107.80.nip.io/privkey.pem'),
  cert: fs.readFileSync('/etc/ssl/certs/35.193.107.80.nip.io/fullchain.pem'),
  minVersion: 'TLSv1.2',
};
// Create HTTPS server
const server = https.createServer(httpsOptions, app);

server.listen(port, '0.0.0.0', () => {
  console.log(`HTTPS server running on port ${port}`);
});

// Error handling
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EACCES') {
    console.error(`Port ${port} requires elevated privileges`);
  } else if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
  }
});
