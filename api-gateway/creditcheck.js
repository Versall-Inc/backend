const checkCredit = (req, res, next) => {
  // TODO: for public API, we can use API key to check credit
};

const setupCreditCheck = (app, routes) => {
  routes.forEach((r) => {
    if (r.creditCheck) {
      app.use(r.url, checkCredit);
    }
  });
};

exports.setupCreditCheck = setupCreditCheck;
