const jwt = require("jsonwebtoken");
const { jwtMiddleware, profileCompletedMiddleware } = require("./middlewares");

const setupAuth = (app, routes) => {
  routes.forEach((r) => {
    if (r.auth && r.checkProfile) {
      app.use(r.url, jwtMiddleware, profileCompletedMiddleware);
    } else if (r.auth) {
      app.use(r.url, jwtMiddleware);
    }
  });
};

exports.setupAuth = setupAuth;
