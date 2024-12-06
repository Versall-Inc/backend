const jwtMiddleware = (req, res, next) => {
  const bypassRoutes = ["/api/auth/register", "/api/auth/login"];
  console.log(req.url, "test");

  if (bypassRoutes.includes(req.path)) {
    // Skip JWT validation for bypass routes
    console.log("Bypassing JWT validation");
    return next();
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Attach decoded token attributes to the request
    req.user = decoded;
    next();
  });
};

exports.jwtMiddleware = jwtMiddleware;
