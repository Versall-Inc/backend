const app = require("./app");
const sequelize = require("./config/database");
const logger = require("./utils/logger");
const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
