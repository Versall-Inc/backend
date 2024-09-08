const app = require("./app");
const sequelize = require("./config/database");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    logger.info(`User Management Service is running on port ${PORT}`);
  });
});
