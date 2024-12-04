const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const channelRoutes = require('./routes/channelRoutes');
const client = require('./config/cassandra');
const commentRoutes = require('./routes/commentRoutes');
const postRoutes = require('./routes/postRoutes');
const channelUserRoutes = require('./routes/channelUserRoutes');
client.connect()
  .then(() => {
    console.log('Connected to Cassandra');
    return client.execute('SELECT release_version FROM system.local');
  })
  .then(result => {
    console.log('Cassandra release version:', result.rows[0].release_version);
  })
  .catch(err => {
    console.error('Error connecting to Cassandra:', err);
  });
  
const app = express();

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use('/comments', commentRoutes);
app.use('/posts', postRoutes);
app.use('/channels', channelRoutes);
app.use('/channels', channelUserRoutes);
// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Default Route
app.use((req, res) => res.status(404).json({ message: 'Endpoint not found' }));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/api-docs`));
