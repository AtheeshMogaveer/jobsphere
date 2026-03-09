const jwt = require("jsonwebtoken");

// Unlike authMiddleware, this never blocks the request
// It just quietly attaches userId if token exists
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
    }
  } catch (error) {
    // Token invalid? No problem, just continue without userId
  }

  next(); // Always continue regardless
};

module.exports = optionalAuth;
