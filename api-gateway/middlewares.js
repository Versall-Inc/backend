const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const jwtMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

const profileCompletedMiddleware = (req, res, next) => {
  let profileCompleted = req.user.profileCompleted;
  if (!profileCompleted) {
    return res.status(403).json({
      message: "Please complete your profile before accessing this resource.",
    });
  }
  next();
};

exports.jwtMiddleware = jwtMiddleware;
exports.profileCompletedMiddleware = profileCompletedMiddleware;
