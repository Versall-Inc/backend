const jwt = require("jsonwebtoken");
const { jwtMiddleware } = require("./middlewares");

const setupAuth = (app, routes) => {
  routes.forEach((r) => {
    if (r.auth) {
      app.use(r.url, jwtMiddleware);
    }
  });
};

exports.setupAuth = setupAuth;
