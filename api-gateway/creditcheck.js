const checkCredit = (req) => {
  return new Promise((resolve, reject) => {
    console.log("Checking credit with token", req.headers["authorization"]);
    setTimeout(() => {
      reject("No sufficient credits");
    }, 500);
  });
};

const setupCreditCheck = (app, routes) => {
  routes.forEach((r) => {
    if (r.creditCheck) {
      app.use(r.url, function (req, res, next) {
        next();
      });
    }
  });
};

exports.setupCreditCheck = setupCreditCheck;
