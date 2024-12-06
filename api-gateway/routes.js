const ROUTES = [
  {
    url: "/user",
    auth: true,
    creditCheck: false,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 500000,
    },
    proxy: {
      target: "http://user-management-service:4000",
      changeOrigin: true,
      pathRewrite: {
        [`^/user`]: "",
      },
    },
  },
  {
    url: "/premium",
    auth: true,
    creditCheck: true,
    proxy: {
      target: "https://www.google.com",
      changeOrigin: true,
      pathRewrite: {
        [`^/premium`]: "",
      },
    },
  },
];

exports.ROUTES = ROUTES;
