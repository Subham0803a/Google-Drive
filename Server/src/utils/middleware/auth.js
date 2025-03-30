const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try{
    const parsed = jwt.verify(token, process.env.JWT_SECRET);
    req.user = parsed
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ status: 'error', message: 'Token expired' });
    }
    return res.status(403).json({ status: 'error', message: 'Invalid token' });
  }
};

module.exports = authMiddleware;