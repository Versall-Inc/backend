const ROUTES = [
  {
    url: "/user-management/auth/complete-profile",
    auth: true,
    checkProfile: false,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 500000,
    },
    proxy: {
      target: "http://user-management-service:4000/auth/complete-profile",
      changeOrigin: true,
    },
  },
  {
    url: "/user-management/auth/me",
    auth: true,
    checkProfile: false,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 500000,
    },
    proxy: {
      target: "http://user-management-service:4000/auth/me",
      changeOrigin: true,
    },
  },
  {
    url: "/user-management/auth",
    auth: false,
    checkProfile: false,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 500000,
    },
    proxy: {
      target: "http://user-management-service:4000/auth",
      changeOrigin: true,
    },
  },
  {
    url: "/user-management/user",
    auth: true,
    checkProfile: true,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 500000,
    },
    proxy: {
      target: "http://user-management-service:4000/user",
      changeOrigin: true,
      pathRewrite: {
        [`^/user`]: "",
      },
    },
  },
  {
    url: "/community-service",
    auth: true,
    checkProfile: true,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 500000,
    },
    proxy: {
      target: "http://community-service:4001",
      changeOrigin: true,
    },
  },
  {
    url: "/course-management",
    auth: true,
    checkProfile: true,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 500000,
    },
    proxy: {
      target: "http://course-management:4003",
      changeOrigin: true,
    },
  },
  {
    url: "/schedule-management",
    auth: true,
    checkProfile: true,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 500000,
    },
    proxy: {
      target: "http://schedule-management-service:4002",
      changeOrigin: true,
    },
  },
  {
    url: "/report-management",
    auth: true,
    checkProfile: true,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 500000,
    },
    proxy: {
      target: "http://report-management-service:4007",
      changeOrigin: true,
    },
  },
];

exports.ROUTES = ROUTES;
