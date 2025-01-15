const { createProxyMiddleware } = require("http-proxy-middleware");

const onProxyReq = function (proxyReq, req, res) {
  if (req.user) {
    proxyReq.setHeader("X-User-Id", req.user.id);
    proxyReq.setHeader("X-User-Email", req.user.email);
    proxyReq.setHeader("X-User-Username", req.user.username);
    proxyReq.setHeader("X-User-Profile-Completed", req.user.profileCompleted);
  }
};

const setupProxies = (app, routes) => {
  routes.forEach((r) => {
    app.use(
      r.url,
      createProxyMiddleware({
        ...r.proxy,
        on: { proxyReq: onProxyReq },
      })
    );
  });
};

module.exports.setupProxies = setupProxies;
