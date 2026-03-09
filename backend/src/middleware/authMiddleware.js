const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // 1. Get token from request header
    // Frontend sends: Authorization: Bearer eyJhbGc...
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Access denied. No token provided.",
      });
    }

    // 2. Extract token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    // 3. Verify token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user info to request
    // Now any route using this middleware can access req.userId
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    // 5. Pass to next function (the actual route handler)
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({
      error: "Invalid or expired token. Please login again.",
    });
  }
};

module.exports = authMiddleware;
