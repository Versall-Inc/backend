// middlewares/userMiddleware.js
module.exports = (req, res, next) => {
    const id = req.headers["x-user-id"];
    const email = req.headers["x-user-email"];
    const username = req.headers["x-user-username"];
    const profileCompleted = req.headers["x-user-profile-completed"];
  
    req.user = { id, email, username, profileCompleted };
    next();
  };