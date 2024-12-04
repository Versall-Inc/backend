"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var swaggerUi = require('swagger-ui-express');

var swaggerDocument = require('./swagger/swagger.json');

var channelRoutes = require('./routes/channelRoutes');

var client = require('./config/cassandra');

var commentRoutes = require('./routes/commentRoutes');

var postRoutes = require('./routes/postRoutes');

var channelUserRoutes = require('./routes/channelUserRoutes');

client.connect().then(function () {
  console.log('Connected to Cassandra');
  return client.execute('SELECT release_version FROM system.local');
}).then(function (result) {
  console.log('Cassandra release version:', result.rows[0].release_version);
})["catch"](function (err) {
  console.error('Error connecting to Cassandra:', err);
});
var app = express(); // Middleware

app.use(bodyParser.json());
app.use('/uploads', express["static"]('uploads'));
app.use('/comments', commentRoutes);
app.use('/posts', postRoutes);
app.use('/channels', channelRoutes);
app.use('/channels', channelUserRoutes); // Swagger

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // Default Route

app.use(function (req, res) {
  return res.status(404).json({
    message: 'Endpoint not found'
  });
});
var PORT = 3000;
app.listen(PORT, function () {
  return console.log("Server running on http://localhost:".concat(PORT, "/api-docs"));
});