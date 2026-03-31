const roleMiddleware = (role) => {
  return (req, res, next) => {
    // check req.user.role against role parameter
    if (req.user.role !== role)
      // if no match → 403
      return res.status(403).json({ message: 'Access denied' });
    // if match → next()
    next();
  };
};

module.exports = roleMiddleware;
