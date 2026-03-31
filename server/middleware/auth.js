const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Step 1 — get Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader)
      return res.status(401).json({ message: 'No token provided' });
    // Step 2 — extract token
    const token = authHeader.split(' ')[1];
    if (!token)
      return res.status(401).json({ message: 'Invalid token format' });
    // Step 3 — verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Step 4 — attach user to req, call next()
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
